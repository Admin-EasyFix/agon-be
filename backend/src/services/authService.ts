import axios from "axios";
import dotenv from 'dotenv';
import { StravaTokens } from '../types/strava/StravaTokens';

dotenv.config();

export class AuthService {
  private redirectUri: string;
  private clientId: string;
  private clientSecret: string;
  private static readonly stravaAuthBase = "https://www.strava.com/oauth";

  constructor() {
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
      throw new Error("STRAVA_CLIENT_ID or STRAVA_CLIENT_SECRET is not set in env.");
    }

    this.clientId = process.env.STRAVA_CLIENT_ID;
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET;

    const PORT = process.env.PORT || 4000;
    const BASE_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    this.redirectUri = `${BASE_URL}/api/strava/auth/callback`;
  }

  /**
   * Builds the Strava OAuth authorization URL.
   */
  getAuthorizationUrl = (state: string): string => {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      state: state,
      scope: "read,activity:read_all",
      approval_prompt: "auto",
    });

    return `${AuthService.stravaAuthBase}/authorize?${params.toString()}`;
  };

  /**
   * Exchanges an authorization code for access + refresh tokens.
   */
  exchangeCodeForToken = async (code: string): Promise<StravaTokens> => {
    const response = await axios.post(`${AuthService.stravaAuthBase}/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: "authorization_code",
    });

    return response.data as StravaTokens;
  };  

  /**
   * Validates Strava tokens. If expired, refreshes and returns new tokens.
   * Throws Unauthorized if refresh fails.
   */
  async validateStravaTokens(tokens: StravaTokens): Promise<StravaTokens> {
    const now = Math.floor(Date.now() / 1000);
    if (tokens.expires_at > now) {
      return tokens;
    }
    return this.refreshAccessToken(tokens.refresh_token);
  }

  /**
   * Refreshes an expired access token using a refresh token.
   */
  refreshAccessToken = async (refreshToken: string): Promise<StravaTokens> => {
    try {
      console.log("🔄 Refreshing Strava access token...");
      const response = await axios.post(`${AuthService.stravaAuthBase}/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      const tokens = response.data as StravaTokens;
      console.log("Token refreshed successfully.");
      return tokens;
    } catch (error: any) {
      console.error("Failed to refresh Strava token:", error.response?.data || error.message);
      throw new Error("Failed to refresh Strava access token");
    }
  };
}
