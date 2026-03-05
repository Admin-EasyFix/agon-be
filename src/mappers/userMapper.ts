import { StravaTokens } from '../types/strava/StravaTokens';
import { UserDbo } from '../types/domain/UserDBO';
import { User } from '@prisma/client';

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
  toStravaTokens(user: User): StravaTokens {
    const expiresAtSec = Math.floor(user.tokenExpiresAt.getTime() / 1000);
    const nowSec = Math.floor(Date.now() / 1000);
    return {
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
      expires_at: expiresAtSec,
      expires_in: expiresAtSec - nowSec,
      token_type: "Bearer",
      athlete: {
        id: user.stravaId,
        firstname: user.firstname,
        lastname: user.lastname,
        profile: user.profilePicture
      } as StravaTokens["athlete"],
    };
  },
  toPartialUser(user: User): Partial<User> {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      profilePicture: user.profilePicture,
    };
  }
};
