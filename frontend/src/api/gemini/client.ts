import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StravaActivity } from "../../types/strava-api";
import type { Activity } from "../../types/strava";

const GEMINI_MODEL = "gemini-2.0-flash";

export function StravaActivityToString(activity: StravaActivity): string {
    const parts: string[] = [`Type: ${activity.type}`];
    if (activity.distance !== undefined) {
        parts.push(`Distance: ${activity.distance} km`);
    }
    if (activity.moving_time !== undefined) {
        const durationMin = Math.round(activity.moving_time / 60);
        parts.push(`Duration: ${durationMin} min`);
    }
    if (activity.elapsed_time !== undefined) {
        const elapsedMin = Math.round(activity.elapsed_time / 60);
        parts.push(`Elapsed Time: ${elapsedMin} min`);
    }
    if (activity.average_speed !== undefined) {
        const pace = activity.average_speed > 0 ? (1000 / activity.average_speed / 60).toFixed(2) : "N/A";
        parts.push(`Pace: ${pace} min/km`);
    }
    if (activity.max_speed !== undefined) {
        const maxPace = activity.max_speed > 0 ? (1000 / activity.max_speed / 60).toFixed(2) : "N/A";
        parts.push(`Max Pace: ${maxPace} min/km`);
    }
    if (activity.average_cadence !== undefined) {
        parts.push(`Avg Cadence: ${Math.round(activity.average_cadence)} rpm`);
    }
    if (activity.workout_type !== undefined) {
        parts.push(`Workout Type: ${activity.workout_type}`);
    }
    if (activity.calories !== undefined) {
        parts.push(`Calories: ${Math.round(activity.calories)} kcal`);
    }
    if (activity.splits_metric !== undefined) {
        parts.push(`Splits (metric): ${activity.splits_metric.length}`);
    }
    if (activity.splits_standard !== undefined) {
        parts.push(`Splits (standard): ${activity.splits_standard.length}`);
    }
    if (activity.laps !== undefined) {
        parts.push(`Laps: ${activity.laps.length}`);
    }
    if (activity.total_elevation_gain !== undefined) {
        parts.push(`Elevation Gain: ${activity.total_elevation_gain} m`);
    }
    if (activity.average_heartrate !== undefined) {
        parts.push(`Avg Heart Rate: ${Math.round(activity.average_heartrate)} bpm`);
    }
    if (activity.max_heartrate !== undefined) {
        parts.push(`Max Heart Rate: ${Math.round(activity.max_heartrate)} bpm`);
    }
    if (activity.suffer_score !== undefined) {
        parts.push(`Suffer Score: ${activity.suffer_score}`);
    }
    return parts.join(", ");
}

export function ActivityToString(activity: Activity): string {
    const parts: string[] = [`Type: ${activity.type}`];
    parts.push(`Distance: ${activity.distance} km`);
    parts.push(`Pace: ${activity.pace}`);
    parts.push(`Duration: ${activity.duration} min`);
    if (activity.elevation !== undefined) {
        parts.push(`Elevation: ${activity.elevation} m`);
    }
    if (activity.heartRate !== undefined) {
        parts.push(`Heart Rate: ${activity.heartRate} bpm`);
    }
    return parts.join(", ");
}

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = GEMINI_MODEL) {
    console.log("Initializing GeminiClient with model:", modelName);
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  private async generateFromPrompt(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

async generateComment(activity: StravaActivity): Promise<string> {
    const prompt = `
      You are an assistant that reviews user activities.
      Given the following activity, generate a short insightful comment:

      ${StravaActivityToString(activity)}
    `;
    return this.generateFromPrompt(prompt);
  }

  async generateComments(activities: StravaActivity[]): Promise<string> {
    if (activities.length === 0) {
      return "No activities available to comment on.";
    }
    const prompt = `
      You are an assistant that reviews user activities.
      Given the following list of activities, generate a list of short insightful comments:

      ${activities.map(a => StravaActivityToString(a)).join("\n")}
    `;
    return this.generateFromPrompt(prompt);
  }

  async generateStravaActivity(activities: StravaActivity[]): Promise<string> {
    const prompt = `
      You are an assistant that suggests new activities.
      Based on the following activities, suggest one new activity:

      ${activities.map(a => StravaActivityToString(a)).join("\n")}
    `;
    return this.generateFromPrompt(prompt);
  }

  async generateActivity(activities: Activity[]): Promise<string> {
    const prompt = `
      You are an assistant that suggests new activities.
      Based on the following activities, suggest one new activity:

      ${activities.map(a => ActivityToString(a)).join("\n")}
    `;
    return this.generateFromPrompt(prompt);
  }
}
