import { Activity} from '../types/Activity';
import { GeminiClient } from '../clients/geminiClient';
import { StravaActivity } from '../types/StravaActivity';
import { ActivityMapper } from '../mappers/activityMapper';

export class AIService {
  private geminiClient: GeminiClient;
  private activityMapper: ActivityMapper;

  constructor() {
    this.geminiClient = new GeminiClient();
    this.activityMapper = new ActivityMapper(this);
  }

  /**
   * Suggests a new activity based on recent user activities.
   */
  async suggestNextActivity(activities: Activity[]): Promise<Activity> {
    if (activities.length === 0) {
      return {
        id: 'suggestion-0',
        name: "Welcome to Agon!",
        date: new Date().toISOString(),
        distance: 5,
        pace: "6:00",
        duration: 30,
        description: "Log your first activity to get personalized suggestions.",
        type: 'running'
      };
    }

    const prompt = `
      As a world-class running and fitness coach, analyze the following recent activities of a user and suggest a new activity.

      User's recent activities (JSON format):
      ${JSON.stringify(activities.slice(0, 10), null, 2)}

      Based on this data, generate a response in a valid JSON format with the following structure:
      {
        "id": "suggestion-1",
        "name": "A short, catchy name for the suggested activity (e.g., 'Tempo Run')",
        "date": "${new Date().toISOString()}",
        "distance": "A suggested distance in kilometers (number).",
        "duration": "A suggested duration in minutes (number).",
        "pace": "A suggested pace in 'minutes:seconds' per kilometer format (string).",
        "description": "A 1-2 sentence personalized message explaining the purpose of this workout.",
        "type": "The type of activity: 'running', 'cycling', 'swimming', 'hiking', or 'other'."
      }

      Do not include any text outside of the JSON object.
    `;
    
    try {
      const jsonResponse = await this.geminiClient.generateContent(prompt);
      return JSON.parse(jsonResponse) as Activity;
    } catch (error) {
      console.error("Failed to parse Gemini recommendation response:", error);
      // Fallback in case of API or parsing error
      return {
        id: 'suggestion-fallback',
        name: "Easy Recovery Run",
        date: new Date().toISOString(),
        distance: 3,
        pace: "7:00",
        duration: 21,
        description: "A light activity to keep you moving. Keep up the great work!",
        type: 'running'
      };
    }
  }

  /**
   * Generates content based on a prompt using an AI model.
   * @param prompt The prompt string to send to the AI model.
   * @returns A promise that resolves to the generated content as a string.
   */
  async generateContent(prompt: string): Promise<string> {
    return this.geminiClient.generateContent(prompt);
  }

  /**
   * Generates an insightful comment for a single activity.
   */
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
      const comments = [
        "Solid training session. Every workout counts!",
        "Good effort! Consistency is key to improvement.",
        "Nice work! Building that base fitness."
      ];
      return comments[Math.floor(Math.random() * comments.length)];
    }
  }

  /**
   * Generates insightful comments for a batch of activities.
   */
  async generateCommentsForActivitiesBatch(activities: StravaActivity[]): Promise<Record<string, string>> {
    if (activities.length === 0) {
      return {};
    }

    const activitiesForPrompt = await this.activityMapper.toActivities(activities, { withAi: false });

    const prompt = `
      As a friendly and encouraging fitness coach, analyze the following activities and for each one, provide a one-sentence, insightful comment.
      Focus on a positive aspect or offer a small piece of encouragement.

      Activities Data (JSON format):
      ${JSON.stringify(activitiesForPrompt, null, 2)}

      Generate a response in a valid JSON format where each key is an activity ID and the value is the comment string. Example:
      {
        "12345": "Great pace on your run!",
        "67890": "Awesome elevation gain on that hike."
      }

      Do not include any text outside of the JSON object. The keys in the JSON object must be the IDs of the activities provided.
    `;

    try {
      const jsonResponse = await this.geminiClient.generateContent(prompt);
      return JSON.parse(jsonResponse) as Record<string, string>;
    } catch (error) {
      console.error("Failed to generate AI comments in batch:", error);
      return {}; // Return empty object on failure
    }
  }
}