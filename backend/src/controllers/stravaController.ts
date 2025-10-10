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
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      const error = new Error('Access token is required');
      (error as any).status = 400;
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
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      const error = new Error('Access token is required');
      (error as any).status = 400;
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
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Access token is required'
        });
        return;
      }

      // Fetch and transform activities
      const activities = await this.stravaService.getActivities(token, 30); // More activities for analytics

      // Generate analytics
      const analytics = await this.aiService.analyzeTrainingPatterns(activities);

      res.json({
        success: true,
        analytics,
        totalActivities: activities.length
      });

    } catch (error) {
      console.error('Error in getAnalytics:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics'
      });
    }
  }
}