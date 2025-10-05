import { stravaFetch } from "./client";
import { type Activity } from "../../types/strava";

export async function getActivities(accessToken: string, perPage = 30, page = 1) {
  return stravaFetch<Activity[]>(`/athlete/activities?per_page=${perPage}&page=${page}`, accessToken);
}
