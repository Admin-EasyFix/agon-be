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
  - Evaluate performance trends but do not reference specific past workouts.
  - Consider signs of improvement, decline, or consistency.
  - Assume that the days without logged activities are rest days.
  - Suggest a workout that promotes progress while minimizing injury risk.:
    - improvement (e.g., faster pace, lower heart rate)
    - decline (e.g., slower pace, higher effort)
    - consistency

  - Detect fatigue signals, such as:
    - decreasing performance over recent activities
    - increasing heart rate for similar effort
    - high frequency without recovery days

  Training logic:
  - Follow progressive overload (max ~10% increase).
  - If improving → suggest slight progression.
  - If declining or fatigued → suggest an easier workout OR a rest day.
  - If highly fatigued → strongly prefer a rest day.
  - If inconsistent → suggest a safe, easy workout.

  Rest day rules:
  - A rest day is valid and should be suggested when recovery is needed.
  - If suggesting rest:
    - type MUST be "rest"
    - distance = 0
    - duration = 0
    - pace = null
    - name = "Rest Day"

  Output MUST be valid JSON only (no extra text).

  Return EXACTLY this structure:
  {
    "id": number,
    "name": string,
    "date": "${date}",
    "distance": number,
    "duration": number,
    "pace": string | null,
    "type": "running" | "cycling" | "swimming" | "hiking" | "other" | "rest",
    "description": string
  }

  Rules:
  - distance and duration must be numbers
  - pace must be "M:SS" or null if rest
  - description must be 1 to 3 sentences explaining the reasoning
  - Use ONLY available data
  - no fields outside this schema
`;

export const getBatchCommentsPrompt = (activitiesForPrompt: Activity[]) => `
  You are a fitness performance analyst.

  Analyze each activity and generate a short, precise, data-driven comment without referencing specific past workouts or dates.

  Activities (JSON):
  ${JSON.stringify(activitiesForPrompt, null, 2)}

  Instructions:
  - Return EXACTLY one comment per activity.

  Comment requirements:
  - 1 to 3 sentences maximum.
  - Be concise and specific (no fluff).
  - Base insights ONLY on available data (pace, heart rate, elevation, distance, duration, etc.).
  - Highlight performance trends in a **generic way** (e.g., "steady pace", "higher effort", "consistent performance") rather than comparing to a specific past activity.
  - Do NOT mention dates, previous run names, or exact past metrics.
  - Avoid generic encouragement (e.g., "Great job", "Nice run").

  Output format:
  - Return valid JSON ONLY (no extra text).
  - Keys MUST exactly match the activity IDs.
  - Include ALL activity IDs, no more, no less.
  - Values must be strings.

  Example:
  {
    "12345": "Pace remained steady with moderate effort throughout the run.",
    "67890": "Elevations increased during this workout, requiring slightly more effort.",
    "99999": "Performance shows consistent speed and effort."
  }

  Now generate the result.
`;