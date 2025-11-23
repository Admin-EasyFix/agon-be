import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/authService";
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import crypto from 'crypto';
import { UserService } from '../services/userService';
import { extractStravaAccessToken, extractUserIdFromRequest } from '../middleware/auth';
import { HttpStatusCode } from 'axios';

const { BadRequest } = HttpStatusCode;

export class AuthController {
  private authService: AuthService;
  private userService: UserService;
  private readonly jwtSecret: string | undefined;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in env.");
    }
    this.authService = new AuthService();
    this.userService = new UserService();
    this.jwtSecret = process.env.JWT_SECRET;
  }

  /**
   * GET /api/strava/auth/authorize
   * Redirects the user to Strava's OAuth2 authorization page.
   */
    getStravaAuthorizationUrl = (req: Request, res: Response, next: NextFunction) => {
        try {
          const { redirect_uri } = req.query;
          if (!redirect_uri) {
            throw createError(400, 'Missing redirect_uri');
          }

          const allowedRedirects = (process.env.ALLOWED_REDIRECT_URIS || '')
            .split(',')
            .map(u => u.trim())
            .filter(Boolean);

          const isAllowed = allowedRedirects.length > 0
          ? allowedRedirects.includes(String(redirect_uri)) : false;

          if (!isAllowed) {
            throw createError(400, 'Invalid redirect_uri');
          }

          const nonce = crypto.randomBytes(8).toString('hex');
          const state = jwt.sign({ nonce, redirect_uri }, this.jwtSecret!, { expiresIn: '5m' });
          const authorization_url = this.authService.getAuthorizationUrl(state);
          res.status(200).json( { authorization_url } );
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/strava/auth/callback
     * Handles the OAuth2 callback from Strava.
     */
    handleStravaCallback = async (req: Request, res: Response, next: NextFunction) => {
      const { code, state } = req.query;

      if (!code || !state) {
        return next(createError(BadRequest, 'Missing code or state'));
      }

      try {
        const decodedState = jwt.verify(state as string, this.jwtSecret!) as { nonce: string; redirect_uri: string };
        const allowedRedirects = (process.env.ALLOWED_REDIRECT_URIS || '')
          .split(',')
          .map(u => u.trim())
          .filter(Boolean);

        if (!allowedRedirects.includes(decodedState.redirect_uri)) {
          return next(createError(400, 'Invalid redirect_uri in state'));
        }
        const tokens = await this.authService.exchangeCodeForToken(code as string);
        try {
          const existingTokens = await this.userService.getStravaTokensByStravaId(tokens.athlete.id);
          if (existingTokens) {
            await this.authService.deauthorize(existingTokens.access_token);
          }
        } catch (error: any) { }
        const user = await this.userService.upsertUserFromStrava(tokens);
        const token = jwt.sign({ id: user.id }, this.jwtSecret!, { expiresIn: '7d' });
        const redirectUrl = `${decodedState.redirect_uri}#token=${encodeURIComponent(token)}`;
        res.redirect(redirectUrl);
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          return next(createError(BadRequest, 'OAuth state expired, please retry login.'));
        }
        next(error);
      }
    };

    /**
     * POST /api/strava/auth/deauthorize
     * Deauthorize user.
     */
    deauthorizeUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = await extractStravaAccessToken(req, this.userService, this.authService);
        await this.authService.deauthorize(token);
        const userId = await extractUserIdFromRequest(req);
        await this.userService.deleteUserById(userId);
        res.status(204).send();
      } catch (error: any) {
        next(error);
      }
    };
};