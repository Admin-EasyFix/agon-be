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
    try {
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

      try {
        const data = await response.json();
        return data as StravaActivity[];
      } catch (e) {
        console.error('Strava API returned invalid JSON');
        throw createError(502, 'Invalid response from Strava API');
      }
    } catch (err: any) {
      if (err.status) {
        throw err;
      }
      console.error(`Network error contacting Strava API: ${err?.message || err}`);
      throw createError(502, 'Unable to reach Strava API');
    }
  }
}