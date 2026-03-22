import { Activity } from '../types/Activity';
import { ActivityType } from '../types/ActivityType';

export const WELCOME_SUGGESTION: Activity = {
  id: 0,
  name: "Welcome to Agon!",
  date: new Date().toISOString(),
  distance: 5,
  pace: "6:00",
  duration: 30,
  description: "Log your first activity to get personalized suggestions.",
  type: ActivityType.Running
};

export const FALLBACK_SUGGESTION: Activity = {
  id: 1,
  name: "Easy Recovery Run",
  date: new Date().toISOString(),
  distance: 3,
  pace: "7:00",
  duration: 21,
  description: "A light activity to keep you moving. Keep up the great work!",
  type: ActivityType.Running
};

export const FALLBACK_COMMENTS = [
  "Solid training session. Every workout counts!",
  "Good effort! Consistency is key to improvement.",
  "Nice work! Building that base fitness."
];

export const getSuggestionPrompt = (activities: Activity[], date: string) => `
      You are an experienced running coach.

    Analyze the user's recent activities and suggest their next workout.

    User's recent activities (JSON):
    ${JSON.stringify(activities.slice(0, 10), null, 2)}

    Instructions:
    - Identify patterns in frequency, distance, and intensity.
    - Follow progressive overload (increase difficulty gradually, max ~10%).
    - If recent activity is inconsistent or intense, suggest an easier workout.
    - If consistent, suggest a slight progression.
    - Avoid unrealistic jumps in distance or pace.

    Output MUST be valid JSON only (no extra text).

    Return EXACTLY this structure:
    {
      "id": number,
      "name": string,
      "date": "${date}",
      "distance_km": number,
      "duration_min": number,
      "pace_min_per_km": string,
      "type": "running" | "cycling" | "swimming" | "hiking" | "other",
      "description": string
    }

    Rules:
    - distance_km and duration_min must be numbers (not strings)
    - pace_min_per_km must be in "MM:SS" format
    - description must be 1–3 sentences max
    - no fields outside this schema
    `;

export const getBatchCommentsPrompt = (activitiesForPrompt: Activity[]) => `
      As an expert fitness analyst, review the following activities. For each one, provide a concise, one-sentence analytical comment highlighting a key performance metric (like pace, elevation, or heart rate consistency).
      Avoid generic encouragement.

      Activities Data (JSON format):
      ${JSON.stringify(activitiesForPrompt, null, 2)}

      Generate a response in a valid JSON format where each key is an activity ID and the value is the comment string. Example:
      {
        "12345": "Great pace on your run!",
        "67890": "Awesome elevation gain on that hike."
      }

      Do not include any text outside of the JSON object. The keys in the JSON object must be the IDs of the activities provided.
    `;