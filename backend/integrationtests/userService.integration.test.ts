import { describe, it, expect, afterAll, afterEach } from 'vitest';
import { UserService } from '../src/services/userService';
import prisma from '../src/prisma/client';
import { StravaAthlete } from '../src/types/strava/StravaAthlete';
import jwt from 'jsonwebtoken';

describe('UserService Integration Test', () => {
  const userService = new UserService();

  afterEach(async () => {
    // Clean up the database after each test to ensure they are isolated.
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from the database after all tests are done.
    await prisma.$disconnect();
  });

  const athleteData: StravaAthlete = {
    id: 12345,
    username: 'testuser',
    resource_state: 2,
    firstname: 'Test',
    lastname: 'User',
    bio: 'I run sometimes',
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
    profile_medium: 'http://example.com/profile_medium.jpg',
    profile: 'http://example.com/profile.jpg',
    friend: 'null',
    follower: 'null',
  };

  const tokenData = {
    access_token: 'test_access_token',
    refresh_token: 'test_refresh_token',
    expires_at: 1672531200, // 2023-01-01
    token_type: 'Bearer',
    expires_in: 21600,
    athlete: athleteData,
  };

  describe('upsertUserFromStrava', () => {
    it('should create a new user in the database if they do not exist', async () => {
      // Act: Call the method to create the user.
      await userService.upsertUserFromStrava(athleteData, tokenData);
  
      // Assert: Verify the user was created in the database.
      const userInDb = await prisma.user.findUnique({
        where: { stravaId: athleteData.id },
      });
  
      expect(userInDb).not.toBeNull();
      expect(userInDb?.stravaId).toBe(athleteData.id);
      expect(userInDb?.firstname).toBe(athleteData.firstname);
      expect(userInDb?.profilePicture).toBe(athleteData.profile);
      expect(userInDb?.accessToken).toBe(tokenData.access_token);
    });
  
    it('should update an existing user in the database', async () => {
      // Arrange: Create an initial user.
      await userService.upsertUserFromStrava(athleteData, tokenData);
  
      // Act: Call the method again with updated token data
      const updatedTokenData = {
        ...tokenData,
        access_token: 'new_access_token',
        expires_at: 1672534800, // 2023-01-01 01:00:00
      };
      await userService.upsertUserFromStrava(athleteData, updatedTokenData);
  
      // Assert: Verify the user was updated.
      const userInDb = await prisma.user.findUnique({
        where: { stravaId: athleteData.id },
      });
  
      const userCount = await prisma.user.count();
      expect(userCount).toBe(1); // Ensure no new user was created.
  
      expect(userInDb).not.toBeNull();
      expect(userInDb?.accessToken).toBe(updatedTokenData.access_token);
      expect(userInDb?.tokenExpiresAt).toEqual(new Date(updatedTokenData.expires_at * 1000));
    });
  });

  describe('getUserProfile', () => {
    it('should return a user profile for a valid token', async () => {
      // Arrange: Create a user and a valid JWT for them.
      const createdUser = await userService.upsertUserFromStrava(athleteData, tokenData);
      const validToken = jwt.sign({ stravaId: createdUser.stravaId }, process.env.JWT_SECRET!);

      // Act
      const userProfile = await userService.getUserProfile(validToken);

      // Assert
      expect(userProfile).not.toBeNull();
      expect(userProfile.id).toBe(createdUser.id);
      expect(userProfile.firstname).toBe(createdUser.firstname);
      expect(userProfile.lastname).toBe(createdUser.lastname);
      expect(userProfile.profilePicture).toBe(createdUser.profilePicture);
      // Ensure it doesn't return sensitive data
      expect(userProfile).not.toHaveProperty('accessToken');
    });

    it('should throw a 404 error if the user in the token does not exist', async () => {
      // Arrange: Create a token for a user that doesn't exist in the DB.
      const nonExistentStravaId = 99999;
      const tokenForNonExistentUser = jwt.sign({ stravaId: nonExistentStravaId }, process.env.JWT_SECRET!);

      // Act & Assert
      await expect(userService.getUserProfile(tokenForNonExistentUser)).rejects.toThrow('User not found');
    });

    it('should throw a 401 error for an invalid token', async () => {
      // Arrange
      const invalidToken = 'this.is.not.a.valid.token';

      // Act & Assert
      await expect(userService.getUserProfile(invalidToken)).rejects.toThrow('Invalid or expired token');
    });
  });
});
