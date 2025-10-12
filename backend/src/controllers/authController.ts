import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/authService";
import createError from 'http-errors';

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
            const authorizationUrl = this.authService.getAuthorizationUrl();
            console.log("Redirecting to Strava authorization URL:", authorizationUrl);
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
        const { code } = req.query;

        if (!code) {
            throw createError(400, "Authorization code is missing");
        }

        try {
            const token = await this.authService.exchangeCodeForToken(code as string);
            res.status(200).json(token);
        } catch (error) {
            next(error);
        }
    };
};