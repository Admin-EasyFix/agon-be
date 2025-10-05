import { stravaFetch } from "./client";
import { type Athlete } from "../../types/strava";

export async function getAthlete(accessToken: string) {
  return stravaFetch<Athlete>("/athlete", accessToken);
}
