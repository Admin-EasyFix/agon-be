import { type Activity, type Athlete } from "../../types/strava";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

export class StravaClient {
  private readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async _fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${STRAVA_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Strava API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  public async fetchActivities(perPage = 30, page = 1): Promise<Activity[]> {
    return this._fetch<Activity[]>(`/athlete/activities?per_page=${perPage}&page=${page}`);
  }

  public async fetchAthlete(): Promise<Athlete> {
    return this._fetch<Athlete>("/athlete");
  }
}
