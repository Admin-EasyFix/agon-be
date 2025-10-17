import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/authService";
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import crypto from 'crypto';

export class AuthController {
  private authService: AuthService;
  private readonly stateSecret: string | undefined;


  constructor() {
    if (!process.env.STATE_SECRET) {
      throw new Error("STATE_SECRET is not set in env.");
    }
    this.authService = new AuthService();
    this.stateSecret = process.env.STATE_SECRET;
  }

  /**
   * GET /api/strava/auth
   * Redirects the user to Strava's OAuth2 authorization page.
   */
    redirectToStrava = (req: Request, res: Response, next: NextFunction) => {
        try {
            const nonce = crypto.randomBytes(8).toString('hex');
            const state = jwt.sign({ nonce }, this.stateSecret!, { expiresIn: '5m' });
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
        jwt.verify(state as string, this.stateSecret!);
        const tokens = await this.authService.exchangeCodeForToken(code as string);
        res.status(200).json(tokens);
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          return next(createError(400, 'OAuth state expired, please retry login.'));
        }
        next(error);
      }
    };
};