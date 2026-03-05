import { describe, it, expect, afterAll, afterEach } from 'vitest';
import { UserService } from '../../src/services/userService';
import prisma from '../../src/prisma/client';
import { StravaAthlete } from '../../src/types/strava/StravaAthlete';
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
      await userService.upsertUserFromStrava(tokenData);
  
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
      await userService.upsertUserFromStrava(tokenData);
  
      // Act: Call the method again with updated token data
      const updatedTokenData = {
        ...tokenData,
        access_token: 'new_access_token',
        expires_at: 1672534800, // 2023-01-01 01:00:00
      };
      await userService.upsertUserFromStrava(updatedTokenData);
  
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

  describe('getPartialUserById', () => {
    it('should return a partial user for a valid token', async () => {
      // Arrange: Create a user and a valid JWT for them.
      const createdUser = await userService.upsertUserFromStrava(tokenData);
      const validToken = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET!);

      // Act
      const userProfile = await userService.getPartialUserById(createdUser.id);

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
      const nonExistentId = 99999;

      // Act & Assert
      await expect(userService.getPartialUserById(nonExistentId)).rejects.toThrow('User not found');
    });
  });

  describe('getStravaTokensById', () => {
    it('should return Strava tokens for a valid user ID', async () => {
      // Arrange: Create a user in the database
      const createdUser = await userService.upsertUserFromStrava(tokenData);

      // Act: Retrieve the Strava tokens
      const stravaTokens = await userService.getStravaTokensById(createdUser.id);

      // Assert
      expect(stravaTokens).not.toBeNull();
      expect(stravaTokens?.access_token).toBe(tokenData.access_token);
      expect(stravaTokens?.refresh_token).toBe(tokenData.refresh_token);
      expect(stravaTokens?.expires_at).toBe(tokenData.expires_at);
    });

    it('should throw a 404 error if the user does not exist', async () => {
      // Arrange: Use a non-existent user ID
      const nonExistentId = 99999;

      // Act & Assert
      await expect(userService.getStravaTokensById(nonExistentId)).rejects.toThrow('User not found');
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      // Arrange: Create a user in the database
      const createdUser = await userService.upsertUserFromStrava(tokenData);

      // Act: Delete the user
      await userService.deleteUserById(createdUser.id);

      // Assert: Ensure the user no longer exists in the database
      const userInDb = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(userInDb).toBeNull();
    });

    it('should throw an error if the user does not exist', async () => {
      // Arrange: Use a non-existent user ID
      const nonExistentId = 99999;

      // Act & Assert: Ensure error is thrown
      await expect(userService.deleteUserById(nonExistentId)).rejects.toThrow();
    });
  });

  describe('upsertUserFromStrava - Concurrent Updates', () => {
    it('should handle concurrent updates gracefully', async () => {
      // Arrange: Create initial token data
      const initialTokenData = { ...tokenData };

      // Act: Perform concurrent updates
      await Promise.all([
        userService.upsertUserFromStrava(initialTokenData),
        userService.upsertUserFromStrava({ ...initialTokenData, access_token: 'new_access_token' }),
      ]);

      // Assert: Ensure the user exists and the latest data is saved
      const userInDb = await prisma.user.findUnique({
        where: { stravaId: athleteData.id },
      });

      expect(userInDb).not.toBeNull();
      expect(['test_access_token', 'new_access_token']).toContain(userInDb?.accessToken);
    });
  });

  describe('getUserById', () => {
    it('should return a user for a valid user ID', async () => {
      // Arrange: Create a user in the database
      const createdUser = await userService.upsertUserFromStrava(tokenData);

      // Act: Retrieve the user
      const user = await userService.getUserById(createdUser.id);

      // Assert
      expect(user).not.toBeNull();
      expect(user.id).toBe(createdUser.id);
      expect(user.firstname).toBe(createdUser.firstname);
    });

    it('should throw a 404 error if the user does not exist', async () => {
      // Arrange: Use a non-existent user ID
      const nonExistentId = 99999;

      // Act & Assert
      await expect(userService.getUserById(nonExistentId)).rejects.toThrow('User not found');
    });
  });
});
