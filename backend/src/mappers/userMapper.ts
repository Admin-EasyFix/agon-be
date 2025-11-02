import { StravaTokens } from '../types/strava/StravaTokens';
import { UserDbo } from '../types/domain/UserDBO';

export const UserMapper = {
  toUserDbo(tokens: StravaTokens): UserDbo {
    const tokenExpiresAt = new Date(tokens.expires_at * 1000);
    return {
      stravaId: tokens.athlete.id,
      firstname: tokens.athlete.firstname,
      lastname: tokens.athlete.lastname,
      profilePicture: tokens.athlete.profile,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: tokenExpiresAt,
    };
  },
  toStravaTokens(dbo: UserDbo): StravaTokens {
    const expiresAtSec = Math.floor(dbo.tokenExpiresAt.getTime() / 1000);
    const nowSec = Math.floor(Date.now() / 1000);
    return {
      access_token: dbo.accessToken,
      refresh_token: dbo.refreshToken,
      expires_at: expiresAtSec,
      expires_in: expiresAtSec - nowSec,
      token_type: "Bearer",
      athlete: {
        id: dbo.stravaId,
        firstname: dbo.firstname,
        lastname: dbo.lastname,
        profile: dbo.profilePicture
      } as StravaTokens["athlete"],
    };
  }
};
