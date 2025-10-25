import { StravaActivity } from '../types/strava/StravaActivity';
import createError from 'http-errors';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export class StravaClient {
  private accessToken: string;

  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error('StravaClient requires an access token.');
    }
    this.accessToken = accessToken;
  }

  private async _fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${STRAVA_API_BASE}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw createError(401, 'Unauthorized: Invalid or expired Strava token.');
        }
        throw createError(response.status, `Strava API error: ${response.statusText}`);
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json() as Promise<T>;
    } catch (err) {
      if (createError.isHttpError(err)) {
        throw err; 
      }
      console.error(`Network error contacting Strava API: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw createError(502, 'Unable to reach Strava API');
    }
  }

  /**
   * Fetches a list of activities for the authenticated athlete from the Strava API.
   * @param perPage The number of activities to fetch.
   * @returns A promise that resolves to an array of raw Strava activities.
   */
  public async fetchActivities(perPage: number = 10): Promise<StravaActivity[]> {
    return this._fetch<StravaActivity[]>(`/athlete/activities?per_page=${perPage}`);
  }
}