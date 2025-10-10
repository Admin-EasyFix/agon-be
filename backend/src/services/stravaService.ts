import { Activity } from '../types/Activity';
import { StravaActivity } from '../types/StravaActivity';
import { StravaClient } from '../clients/stravaClient';
import { AIService } from './aiService';

export class StravaService {
  private stravaClient: StravaClient;
  private aiService: AIService;

  constructor() {
    this.stravaClient = new StravaClient();
    this.aiService = new AIService();
  }

  /**
   * Fetches and transforms activities from the Strava API.
   * @param accessToken The user's Strava access token.
   * @param perPage The number of activities to fetch.
   * @returns A promise that resolves to an array of transformed activities.
   */
  async getActivities(accessToken: string, perPage: number = 10): Promise<Activity[]> {
    const stravaActivities = await this.stravaClient.fetchActivities(accessToken, perPage);
    return await this.transformActivities(stravaActivities);
  }

  /**
   * Transform Strava activities to our internal Activity format
   */
  async transformActivities(stravaActivities: StravaActivity[]): Promise<Activity[]> {
    const transformedActivities = await Promise.all(stravaActivities.map(async (stravaActivity) => {
      return {
        id: stravaActivity.id.toString(),
        name: stravaActivity.name,
        date: stravaActivity.start_date,
        distance: stravaActivity.distance 
          ? Math.round((stravaActivity.distance / 1000) * 10) / 10 
          : 0, // Convert meters to km
        pace: this.calculatePace(stravaActivity.distance || 0, stravaActivity.moving_time || 0),
        duration: Math.round((stravaActivity.moving_time || 0) / 60), // Convert seconds to minutes
        description: await this.aiService.generateCommentForActivity(stravaActivity),
        elevation: stravaActivity.total_elevation_gain,
        heartRate: stravaActivity.average_heartrate,
        type: this.mapActivityType(stravaActivity.type),
      };
    }));
    return transformedActivities;
  }

  /**
   * Calculate pace from distance and time
   */
  private calculatePace(distanceMeters: number, timeSeconds: number): string {
    if (!distanceMeters || !timeSeconds) return "--:--";
    
    const distanceKm = distanceMeters / 1000;
    const paceSecondsPerKm = timeSeconds / distanceKm;
    const minutes = Math.floor(paceSecondsPerKm / 60);
    const seconds = Math.round(paceSecondsPerKm % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Map Strava activity type to our internal type
   */
  private mapActivityType(stravaType: string): Activity['type'] {
    const typeMap: Record<string, Activity['type']> = {
      'Run': 'running',
      'Ride': 'cycling',
      'Swim': 'swimming',
      'Hike': 'hiking',
      'Walk': 'hiking'
    };
    return typeMap[stravaType] || 'other';
  }
}