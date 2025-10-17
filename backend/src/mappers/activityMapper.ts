import { Activity } from '../types/Activity';
import { StravaActivity } from '../types/StravaActivity';
import { AIService } from '../services/aiService';
import { ActivityType } from '../types/ActivityType';

export class ActivityMapper {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * Transforms Strava activities into the internal Activity format.
   * Can optionally enrich activities with AI-generated comments.
   * @param stravaActivities - An array of activities from the Strava API.
   * @param options - Options for the transformation.
   * @param options.withAi - If true, fetches comments from the AI service.
   * @returns A promise that resolves to an array of transformed activities.
   */
  public async toActivities(
    stravaActivities: StravaActivity[],
    options: { withAi: boolean } = { withAi: false }
  ): Promise<Activity[]> {
    let comments: Record<string, string> = {};
    if (options.withAi) {
      comments = await this.aiService.generateCommentsForActivitiesBatch(stravaActivities);
    }

    return stravaActivities.map(stravaActivity => {
      return {
        id: stravaActivity.id,
        name: stravaActivity.name,
        date: stravaActivity.start_date_local,
        distance: stravaActivity.distance ? Math.round((stravaActivity.distance / 1000) * 10) / 10 : 0,
        pace: this.calculatePace(stravaActivity.distance || 0, stravaActivity.moving_time || 0),
        duration: Math.round((stravaActivity.moving_time || 0) / 60),
        description: comments[stravaActivity.id] || this.aiService.generateCommentForActivity(stravaActivity),
        elevation: stravaActivity.total_elevation_gain,
        heartRate: stravaActivity.average_heartrate,
        type: this.mapActivityType(stravaActivity.type),
      };
    });
  }


  private calculatePace(distanceMeters: number, timeSeconds: number): string {
    if (!distanceMeters || !timeSeconds) return '--:--';

    const distanceKm = distanceMeters / 1000;
    const paceSecondsPerKm = timeSeconds / distanceKm;
    const minutes = Math.floor(paceSecondsPerKm / 60);
    const seconds = Math.round(paceSecondsPerKm % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }


  private mapActivityType(stravaType: string): ActivityType {
    const typeMap: Record<string, ActivityType> = {
      Run: ActivityType.Running,
      Ride: ActivityType.Cycling,
      Swim: ActivityType.Swimming,
      Hike: ActivityType.Hiking,
      Walk: ActivityType.Hiking,
    };
    return typeMap[stravaType] || ActivityType.Other;
  }
}
