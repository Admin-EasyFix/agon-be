import { Activity } from '../types/Activity';

export const WELCOME_SUGGESTION: Activity = {
  id: 'suggestion-0',
  name: "Welcome to Agon!",
  date: new Date().toISOString(),
  distance: 5,
  pace: "6:00",
  duration: 30,
  description: "Log your first activity to get personalized suggestions.",
  type: 'running'
};

export const FALLBACK_SUGGESTION: Activity = {
  id: 'suggestion-fallback',
  name: "Easy Recovery Run",
  date: new Date().toISOString(),
  distance: 3,
  pace: "7:00",
  duration: 21,
  description: "A light activity to keep you moving. Keep up the great work!",
  type: 'running'
};

export const FALLBACK_COMMENTS = [
  "Solid training session. Every workout counts!",
  "Good effort! Consistency is key to improvement.",
  "Nice work! Building that base fitness."
];

export const getSuggestionPrompt = (activities: Activity[], date: string) => `
      As a world-class running and fitness coach, analyze the following recent activities of a user and suggest a new activity.

      User's recent activities (JSON format):
      ${JSON.stringify(activities.slice(0, 10), null, 2)}

      Based on this data, generate a response in a valid JSON format with the following structure:
      {
        "id": "suggestion-1",
        "name": "A short, catchy name for the suggested activity (e.g., 'Tempo Run')",
        "date": "${date}",
        "distance": "A suggested distance in kilometers (number).",
        "duration": "A suggested duration in minutes (number).",
        "pace": "A suggested pace in 'minutes:seconds' per kilometer format (string).",
        "description": "A 1-2 sentence personalized message explaining the purpose of this workout.",
        "type": "The type of activity: 'running', 'cycling', 'swimming', 'hiking', or 'other'."
      }

      Do not include any text outside of the JSON object.
    `;

export const getBatchCommentsPrompt = (activitiesForPrompt: Activity[]) => `
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