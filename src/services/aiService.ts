import { Activity} from '../types/Activity';
import { GeminiClient } from '../clients/geminiClient';
import { StravaActivity } from '../types/strava/StravaActivity';
import { ActivityMapper } from '../mappers/activityMapper';
import {
  WELCOME_SUGGESTION,
  FALLBACK_SUGGESTION,
  FALLBACK_COMMENTS,
  getSuggestionPrompt,
  getBatchCommentsPrompt
} from '../utils/aiConstants';

export class AIService {
  private geminiClient: GeminiClient;
  private activityMapper: ActivityMapper;

  constructor() {
    this.geminiClient = new GeminiClient();
    this.activityMapper = new ActivityMapper(this);
  }

  async suggestNextActivity(activities: Activity[]): Promise<Activity> {
    if (activities.length === 0) {
      return { ...WELCOME_SUGGESTION, date: new Date().toISOString() };
    }

    const prompt = getSuggestionPrompt(activities, new Date().toISOString());
    
    try {
      const jsonResponse = await this.geminiClient.generateContent(prompt);
      return JSON.parse(jsonResponse) as Activity;
    } catch (error) {
      console.error("Failed to parse Gemini recommendation response:", error);
      return { ...FALLBACK_SUGGESTION, date: new Date().toISOString() };
    }
  }

  public generateCommentForActivity(activity: StravaActivity): string {
    const distanceKm = activity.distance ? activity.distance / 1000 : 0;
    const durationMinutes = activity.moving_time ? activity.moving_time / 60 : 0;
    
    if (distanceKm > 10) {
      return "Impressive long distance workout! Your endurance is really building up.";
    } else if (distanceKm > 5) {
      return "Great mid-distance effort! Keep up the consistent training.";
    } else if (durationMinutes > 60) {
      return "Nice long training session! Time on feet is valuable.";
    } else if (activity.average_heartrate && activity.average_heartrate > 150) {
      return "High intensity workout! Great for building speed and power.";
    } else {
      return FALLBACK_COMMENTS[Math.floor(Math.random() * FALLBACK_COMMENTS.length)];
    }
  }


  async generateCommentsForActivitiesBatch(activities: StravaActivity[]): Promise<Record<string, string>> {
    if (activities.length === 0) {
      return {};
    }

    const activitiesForPrompt = await this.activityMapper.toActivities(activities, { withAi: false });

    const prompt = getBatchCommentsPrompt(activitiesForPrompt);

    try {
      const jsonResponse = await this.geminiClient.generateContent(prompt);
      return JSON.parse(jsonResponse) as Record<string, string>;
    } catch (error) {
      console.error("Failed to generate AI comments in batch:", error);
      return {}; 
    }
  }
}