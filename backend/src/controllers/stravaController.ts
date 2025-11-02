import { Request, Response, NextFunction } from 'express';
import { StravaService } from '../services/stravaService';
import createError from 'http-errors';
import { AIService } from '../services/aiService';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import jwt from 'jsonwebtoken';

export class StravaController {
  private stravaService: StravaService;
  private aiService: AIService;
  private userService: UserService;
  private authService: AuthService;
  private readonly jwtSecret: string | undefined;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in env.");
    }
    this.userService = new UserService();
    this.authService = new AuthService();
    this.stravaService = new StravaService();
    this.aiService = new AIService();
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async _extractStravaAccessToken(req: Request): Promise<string> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      if (!token) {
        throw createError(401, 'Missing or invalid Authorization header');
      }

      const decodedToken = jwt.verify(token as string, this.jwtSecret!) as { id: number };
      const userId = decodedToken?.id;
      if (!userId) {
        throw createError(401, 'Invalid JWT: user ID missing');
      }

      const stravaTokens = await this.userService.getUserById(userId);
      if (!stravaTokens) {
        throw createError(404, 'Strava tokens not found for the user');
      }

      const validTokens = await this.authService.validateStravaTokens(stravaTokens);

      if (validTokens && validTokens !== stravaTokens) {
        await this.userService.upsertUserFromStrava(validTokens);
      }

      return validTokens?.access_token ?? stravaTokens.access_token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET /api/strava/activities
   * Fetch user activities from Strava API
   */
  async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = await this._extractStravaAccessToken(req);
      const activities = await this.stravaService.getActivities(token, 10);
  
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/suggest
   * Generate AI recommendation based on user activities
   */
  async getSuggestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = await this._extractStravaAccessToken(req);
      const activities = await this.stravaService.getActivities(token, 10);
  
      const recommendation = await this.aiService.suggestNextActivity(activities);
  
      res.json(recommendation);
    } catch (error) {
      next(error);
    }
  }
}