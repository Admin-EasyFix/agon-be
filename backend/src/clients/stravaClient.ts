import { StravaActivity } from '../types/StravaActivity';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export class StravaClient {
  /**
   * Fetches a list of activities for the authenticated athlete from the Strava API.
   * @param accessToken The user's Strava access token.
   * @param perPage The number of activities to fetch.
   * @returns A promise that resolves to an array of raw Strava activities.
   */
  async fetchActivities(accessToken: string, perPage: number = 10): Promise<StravaActivity[]> {
    const url = `${STRAVA_API_BASE}/athlete/activities?per_page=${perPage}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Strava API request failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Failed to fetch activities from Strava. Status: ${response.status}`);
    }

    return response.json() as Promise<StravaActivity[]>;
  }
}