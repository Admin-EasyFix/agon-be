import { Activity } from '../types/Activity';
import { StravaActivity } from '../types/StravaActivity';
import { AIService } from '../services/aiService';

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
      const activityId = stravaActivity.id.toString();
      return {
        id: activityId,
        name: stravaActivity.name,
        date: stravaActivity.start_date,
        distance: stravaActivity.distance ? Math.round((stravaActivity.distance / 1000) * 10) / 10 : 0,
        pace: this.calculatePace(stravaActivity.distance || 0, stravaActivity.moving_time || 0),
        duration: Math.round((stravaActivity.moving_time || 0) / 60),
        description: comments[activityId] || this.aiService.generateCommentForActivity(stravaActivity),
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


  private mapActivityType(stravaType: string): Activity['type'] {
    const typeMap: Record<string, Activity['type']> = {
      Run: 'running',
      Ride: 'cycling',
      Swim: 'swimming',
      Hike: 'hiking',
      Walk: 'hiking',
    };
    return typeMap[stravaType] || 'other';
  }
}
