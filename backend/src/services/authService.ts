import axios from "axios";
import dotenv from 'dotenv';
import { StravaTokens } from '../types/StravaTokens';

dotenv.config();

const STRAVA_AUTH_BASE = "https://www.strava.com/oauth";

export class AuthService {

  getAuthorizationUrl = (state: string): string => {
    const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
    if (!CLIENT_ID) {
      throw new Error("STRAVA_CLIENT_ID is not set in environment variables.");
    }
    const PORT = process.env.PORT || 4000;
    const REDIRECT_URI_BASE = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: `${REDIRECT_URI_BASE}/api/strava/auth/callback`,
        state: state,
        scope: "read,activity:read_all",
        approval_prompt: "auto",
    });

    return `${STRAVA_AUTH_BASE}/authorize?${params.toString()}`;
  };

  exchangeCodeForToken = async (code: string): Promise<StravaTokens> => {
    const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
    if (!CLIENT_ID) {
      throw new Error("STRAVA_CLIENT_ID is not set in environment variables.");
    }
    const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
    if (!CLIENT_SECRET) {
      throw new Error("STRAVA_CLIENT_SECRET is not set in environment variables.");
    }
    const response = await axios.post(`${STRAVA_AUTH_BASE}/token`, {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
    });

    return response.data as StravaTokens;
  };
}