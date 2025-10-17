import axios from "axios";
import dotenv from 'dotenv';
import { StravaTokens } from '../types/StravaTokens';

dotenv.config();

export class AuthService {
  private redirectUri: string;
  private clientId: string | undefined;
  private clientSecret: string | undefined;
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

  getAuthorizationUrl = (state: string): string => {
    const params = new URLSearchParams({
        client_id: this.clientId!,
        response_type: "code",
        redirect_uri: this.redirectUri,
        state: state,
        scope: "read,activity:read_all",
        approval_prompt: "auto",
    });

    return `${AuthService.stravaAuthBase}/authorize?${params.toString()}`;
  };

  exchangeCodeForToken = async (code: string): Promise<StravaTokens> => {
    const response = await axios.post(`${AuthService.stravaAuthBase}/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: "authorization_code",
    });

    return response.data as StravaTokens;
  };
}