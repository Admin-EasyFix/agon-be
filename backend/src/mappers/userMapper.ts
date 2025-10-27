import { StravaAthlete } from '../types/strava/StravaAthlete';
import { StravaTokens } from '../types/strava/StravaTokens';
import { UserDbo } from '../types/domain/UserDBO';

export const UserMapper = {
  toUserDbo(athleteData: StravaAthlete, tokenData: StravaTokens): UserDbo {
    const tokenExpiresAt = new Date(tokenData.expires_at * 1000);
    return {
      stravaId: athleteData.id,
      firstname: athleteData.firstname,
      lastname: athleteData.lastname,
      profilePicture: athleteData.profile,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt: tokenExpiresAt,
    };
  },
};
