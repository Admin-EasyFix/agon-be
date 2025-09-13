import { stravaFetch } from "./client";
import { type StravaActivity } from "../../types/strava-api";

export async function getActivities(accessToken: string, perPage = 30, page = 1) {
  return stravaFetch<StravaActivity[]>(`/athlete/activities?per_page=${perPage}&page=${page}`, accessToken);
}
