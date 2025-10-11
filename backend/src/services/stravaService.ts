import { Activity } from '../types/Activity';
import { StravaActivity } from '../types/StravaActivity';
import { StravaClient } from '../clients/stravaClient';
import { AIService } from './aiService';
import { ActivityMapper } from '../mappers/activityMapper';

export class StravaService {
  private stravaClient: StravaClient;
  private aiService: AIService;
  private activityMapper: ActivityMapper;

  constructor() {
    this.stravaClient = new StravaClient();
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
    const stravaActivities = await this.stravaClient.fetchActivities(accessToken, perPage);
    return this.activityMapper.toActivity(stravaActivities);
  }
}