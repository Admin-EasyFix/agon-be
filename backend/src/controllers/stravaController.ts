import { Request, Response } from 'express';
import { StravaService } from '../services/stravaService';
import { AIService } from '../services/aiService';

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
  async getActivities(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      const error = new Error('Bearer token is required');
      (error as any).status = 401; // Unauthorized
      throw error;
    }

    const activities = await this.stravaService.getActivities(token, 10);

    res.json(activities);
  }

  /**
   * GET /api/suggest
   * Generate AI recommendation based on user activities
   */
  async getSuggestion(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      const error = new Error('Bearer token is required');
      (error as any).status = 401;
      throw error;
    }

    const activities = await this.stravaService.getActivities(token, 10);

    const recommendation = await this.aiService.suggestNextActivity(activities);

    res.json(recommendation);
  }


  /**
   * GET /api/analytics
   * Get detailed training analytics
   */
  async getAnalytics(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      const error = new Error('Bearer token is required');
      (error as any).status = 401;
      throw error;
    }

    // Fetch and transform activities
    const activities = await this.stravaService.getActivities(token, 30); // More activities for analytics

    // Generate analytics
    const analytics = await this.aiService.analyzeTrainingPatterns(activities);

    // Note: This endpoint still returns an object, not the analytics data directly.
    res.json(analytics);
  }
}