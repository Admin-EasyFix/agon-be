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
   * @param perPage The number of activities to fetch.
   * @returns A promise that resolves to an array of transformed activities.
   */
  async getActivities(accessToken: string, perPage: number = 10): Promise<Activity[]> {
    const stravaClient = new StravaClient(accessToken);
    const stravaActivities = await stravaClient.fetchActivities(perPage);
    return this.activityMapper.toActivities(stravaActivities, { withAi: true });
  }
}