import { Activity } from '../types/Activity';
import { StravaActivity } from '../types/StravaActivity';
import { ActivityForPromt } from '../types/ActivityForPromt';
import { AIService } from '../services/aiService';

export class ActivityMapper {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  public toActivityPromt(stravaActivity: StravaActivity): ActivityForPromt {

    const activityId = stravaActivity.id.toString();
    return {
      id: activityId,
      name: stravaActivity.name,
      distance: stravaActivity.distance,
      moving_time: stravaActivity.moving_time || 0,
      total_elevation_gain: stravaActivity.total_elevation_gain,
      average_heartrate: stravaActivity.average_heartrate,
      type: stravaActivity.type,
    }
  }

  public async toActivity(stravaActivities: StravaActivity[]): Promise<Activity[]> {
    // Generate all comments in a single batch call
    const comments = await this.aiService.generateCommentsForActivitiesBatch(stravaActivities);

    return stravaActivities.map((stravaActivity) => {
      const activityId = stravaActivity.id.toString();
      return {
        id: activityId,
        name: stravaActivity.name,
        date: stravaActivity.start_date,
        distance: stravaActivity.distance
          ? Math.round((stravaActivity.distance / 1000) * 10) / 10
          : 0, // Convert meters to km
        pace: this.calculatePace(stravaActivity.distance || 0, stravaActivity.moving_time || 0),
        duration: Math.round((stravaActivity.moving_time || 0) / 60), // Convert seconds to minutes
        description: comments[activityId] || this.aiService.generateCommentForActivity(stravaActivity), // Use batch-generated comment or a fallback
        elevation: stravaActivity.total_elevation_gain,
        heartRate: stravaActivity.average_heartrate,
        type: this.mapActivityType(stravaActivity.type),
      };
    });
  }

  /**
   * Calculate pace from distance and time.
   */
  private calculatePace(distanceMeters: number, timeSeconds: number): string {
    if (!distanceMeters || !timeSeconds) return '--:--';

    const distanceKm = distanceMeters / 1000;
    const paceSecondsPerKm = timeSeconds / distanceKm;
    const minutes = Math.floor(paceSecondsPerKm / 60);
    const seconds = Math.round(paceSecondsPerKm % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Map Strava activity type to our internal type.
   */
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
