import { Request, Response, NextFunction } from 'express';
import { StravaService } from '../services/stravaService';
import { AIService } from '../services/aiService';
import { extractStravaAccessToken } from '../middleware/auth';

export class StravaController {
  private stravaService: StravaService;
  private aiService: AIService;

  constructor() {
    this.stravaService = new StravaService();
    this.aiService = new AIService();
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