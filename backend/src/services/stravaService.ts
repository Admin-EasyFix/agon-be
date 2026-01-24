import { Activity } from '../types/Activity';
import { StravaClient } from '../clients/stravaClient';
import { AIService } from './aiService';
import { ActivityMapper } from '../mappers/activityMapper';

export class StravaService {
  private aiService: AIService;
  private activityMapper: ActivityMapper;

  constructor() {
    this.aiService = new AIService();
    this.activityMapper = new ActivityMapper(this.aiService);
  }

  /**
   * Fetches and transforms activities from the Strava API.
   * @param accessToken The user's Strava access token.
   * @returns A promise that resolves to an array of transformed activities.
   */
  async getActivities(accessToken: string): Promise<Activity[]> {
    const stravaClient = new StravaClient(accessToken);

    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = Math.floor(new Date().setMonth(new Date().getMonth() - 1) / 1000);

    const stravaActivities = await stravaClient.fetchActivities(30, 1, now, oneMonthAgo);
    const runningActivities = stravaActivities.filter(activity => activity.type === 'Run');
    return this.activityMapper.toActivities(runningActivities, { withAi: true });
  }
}