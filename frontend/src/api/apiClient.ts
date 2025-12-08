import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Activity } from "../types/Activity";
import type { User } from "../types/User";

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseUrl = import.meta.env.VITE_API_URL;
    if (!baseUrl) {
      throw new Error(
        "VITE_API_URL is not set! Please add it to your .env file."
      );
    }

    this.client = axios.create({
      baseURL: baseUrl
    });
  }

  setToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }
  }

  hasToken(): boolean {
    return !!this.client.defaults.headers.common["Authorization"];
  }

  getIndex() {
    return this.client.get<string>("/");
  }

  getAuthorizationUrl(redirectUri: string) {
    return this.client.get("/api/strava/auth/authorize?redirect_uri=" + encodeURIComponent(redirectUri));
  }

  deauthorize() {
    return this.client.post<void>("/api/strava/auth/deauthorize");
  }

  getActivities() {
    return this.client.get<Activity[]>("/api/strava/activities");
  }

  getSuggestion() {
    return this.client.get<Activity>("/api/suggest");
  }

  getUserProfile() {
    return this.client.get<User>("/api/users/profile");
  }
}

export const apiClient = new ApiClient();