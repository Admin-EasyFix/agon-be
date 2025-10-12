import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/authService";
import createError from 'http-errors';
import crypto from 'crypto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * GET /api/strava/auth
   * Redirects the user to Strava's OAuth2 authorization page.
   */
    redirectToStrava = (req: Request, res: Response, next: NextFunction) => {
        try {
            const state = crypto.randomBytes(16).toString('hex');
            res.cookie('strava_oauth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 300000 }); // 5 minutes
            const authorizationUrl = this.authService.getAuthorizationUrl(state);
            res.redirect(authorizationUrl); // Redirect the user to Strava's authorization page
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
        const storedState = req.cookies.strava_oauth_state;

        if (!state || state !== storedState) {
            return next(createError(400, "Invalid state parameter. Possible CSRF attack."));
        }

        res.clearCookie('strava_oauth_state');

        if (!code) {
            return next(createError(400, "Authorization code is missing"));
        }

        try {
            const token = await this.authService.exchangeCodeForToken(code as string);
            res.status(200).json(token);
        } catch (error) {
            next(error);
        }
    };
};