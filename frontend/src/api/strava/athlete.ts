import { stravaFetch } from "./client";
import { type StravaAthlete } from "../../types/strava-api";

export async function getAthlete(accessToken: string) {
  return stravaFetch<StravaAthlete>("/athlete", accessToken);
}
