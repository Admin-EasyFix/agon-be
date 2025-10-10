import { StravaActivity } from '../types/StravaActivity';
import createError from 'http-errors';

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
      if (response.status === 401) {
        throw createError(401, 'Unauthorized: Invalid or expired Strava token.');
      }
      console.error(`Strava API request failed with status ${response.status}: ${response.statusText}`);
      throw createError(response.status, `Failed to fetch from Strava: ${response.statusText}`);
    }

    return response.json() as Promise<StravaActivity[]>;
  }
}