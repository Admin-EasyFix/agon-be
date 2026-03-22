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
  - Treat activities as a timeline (ordered by date).
  - Identify patterns in frequency, distance, and intensity.
  - Evaluate performance trends:
    - improvement (e.g., faster pace, lower heart rate for similar effort)
    - decline (e.g., slower pace, higher effort)
    - consistency

  - When possible, compare similar activities (e.g., similar distance or type).

  Training logic:
  - Follow progressive overload (increase difficulty gradually, max ~10%).
  - If performance is improving → allow slight progression.
  - If performance is declining or fatigue is detected → suggest an easier workout.
  - If inconsistent → prioritize a safe, moderate effort.
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
  - description must be 1 to 3 sentences and MUST explain the reasoning based on recent trends
  - Use ONLY available data (do not assume missing metrics)
  - no fields outside this schema

  Fallback:
  - If data is insufficient or inconsistent, suggest a safe easy run.
`;

export const getBatchCommentsPrompt = (activitiesForPrompt: Activity[]) => `
  You are a fitness performance analyst.

  Analyze each activity in the context of the athlete's recent history and generate a short, precise, data-driven comment.

  Activities (JSON):
  ${JSON.stringify(activitiesForPrompt, null, 2)}

  Instructions:
  - Consider ALL activities as a timeline (ordered by date).
  - For each activity, compare it to previous ones to identify trends (improvement, decline, or consistency).
  - Return EXACTLY one comment per activity.

  Comment requirements:
  - 1 to 3 sentences maximum.
  - Be concise and specific (no fluff).
  - Base insights ONLY on available data (pace, heart rate, elevation, distance, duration, etc.).
  - Do NOT assume missing metrics.
  - Highlight:
    - performance trends (e.g., faster pace vs previous runs, improved endurance, increased effort)
    - or regressions (e.g., slower pace, higher heart rate for similar effort)
    - or consistency (stable performance)

  - Avoid generic encouragement (e.g., "Great job", "Nice run").

  Output format:
  - Return valid JSON ONLY (no extra text).
  - Keys MUST exactly match the activity IDs.
  - Include ALL activity IDs, no more, no less.
  - Values must be strings.

  Example:
  {
    "12345": "Your pace improved compared to recent runs, indicating better speed endurance.",
    "67890": "This run shows a slower pace and higher effort than previous ones, suggesting possible fatigue.",
    "99999": "Performance remains consistent with recent activities, maintaining a steady pace and effort."
  }

  Now generate the result.
`;