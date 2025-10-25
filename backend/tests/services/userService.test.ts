import { describe, it, expect, vi } from 'vitest';
import { UserService } from '../../src/services/userService';
import prisma from '../../src/prisma/client';
import { StravaAthlete } from '../../src/types/strava/StravaAthlete';

vi.mock('../../src/prisma/client', () => ({
  default: {
    user: {
      upsert: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  it('should call prisma.user.upsert with correct arguments', async () => {
    const userService = new UserService();

    const athleteData: StravaAthlete = {
      id: 12345,
      username: "testuser",
      resource_state: 2,
      firstname: 'Test',
      lastname: 'User',
      bio: "I run sometimes",
      city: 'Testville',
      state: 'TS',
      country: 'Testland',
      sex: 'M',
      premium: false,
      summit: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      badge_type_id: 0,
      weight: 75,
      profile_medium: "http://example.com/profile_medium.jpg",
      profile: 'http://example.com/profile.jpg',
      friend: "null",
      follower: "null",
    };

    const tokenData = {
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token',
      expires_at: 1672531200, // 2023-01-01
      token_type: 'Bearer',
      expires_in: 21600,
      athlete: athleteData,
    };

    const expectedUserData = {
      id: 1,
      stravaId: 12345,
      firstname: 'Test',
      lastname: 'User',
      profilePicture: 'http://example.com/profile.jpg',
      accessToken: 'test_access_token',
      refreshToken: 'test_refresh_token',
      tokenExpiresAt: new Date('2023-01-01T00:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.upsert as ReturnType<typeof vi.fn>).mockResolvedValue(expectedUserData);

    const result = await userService.upsertUserFromStrava(athleteData, tokenData);

    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { stravaId: athleteData.id },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(tokenData.expires_at * 1000),
      },
      create: {
        stravaId: athleteData.id,
        firstname: athleteData.firstname,
        lastname: athleteData.lastname,
        profilePicture: athleteData.profile,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(tokenData.expires_at * 1000),
      },
    });

    expect(result).toEqual(expectedUserData);
  });
});
