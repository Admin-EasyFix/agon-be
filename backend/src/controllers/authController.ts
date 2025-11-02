import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/authService";
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import crypto from 'crypto';
import { UserService } from '../services/userService';

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
    redirectToStrava = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { redirect_uri } = req.query;
            if (!redirect_uri) {
                throw createError(400, 'Missing redirect_uri');
            }

            const nonce = crypto.randomBytes(8).toString('hex');
            const state = jwt.sign({ nonce, redirect_uri }, this.jwtSecret!, { expiresIn: '5m' });
            const authorizationUrl = this.authService.getAuthorizationUrl(state);
            res.redirect(authorizationUrl);
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
        return next(createError(400, 'Missing code or state'));
      }

      try {
        const decodedState = jwt.verify(state as string, this.jwtSecret!) as { nonce: string; redirect_uri: string };
        const tokens = await this.authService.exchangeCodeForToken(code as string);
        const user = await this.userService.upsertUserFromStrava(tokens);
        const token = jwt.sign({ id: user.id }, this.jwtSecret!, { expiresIn: '7d' });
        res.redirect(`${decodedState.redirect_uri}#token=${token}`);
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          return next(createError(400, 'OAuth state expired, please retry login.'));
        }
        next(error);
      }
    };
};