import { StravaAthlete } from '../types/strava/StravaAthlete';
import { CreateUserDBO } from '../types/domain/CreateUserDBO';
import { UpdateUserDBO } from '../types/domain/UpdateUserDBO';
import { StravaTokens } from '../types/strava/StravaTokens';

export const UserMapper = {
  toCreateDBO(athleteData: StravaAthlete, tokenData: StravaTokens): CreateUserDBO {
    const tokenExpiresAt = new Date(tokenData.expires_at * 1000);
    return {
      stravaId: athleteData.id,
      firstname: athleteData.firstname,
      lastname: athleteData.lastname,
      profilePicture: athleteData.profile,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt,
    };
  },

  toUpdateDBO(tokenData: StravaTokens): UpdateUserDBO {
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt: new Date(tokenData.expires_at * 1000),
    };
  },
};
