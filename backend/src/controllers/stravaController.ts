import { Request, Response, NextFunction } from 'express';
import { StravaService } from '../services/stravaService';
import { AIService } from '../services/aiService';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { extractStravaAccessToken } from '../utils/auth';

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

  /**
   * GET /api/strava/activities
   * Fetch user activities from Strava API
   */
  async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = await extractStravaAccessToken(req);
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
      const token = await extractStravaAccessToken(req);
      const activities = await this.stravaService.getActivities(token, 10);
  
      const recommendation = await this.aiService.suggestNextActivity(activities);
  
      res.json(recommendation);
    } catch (error) {
      next(error);
    }
  }
}