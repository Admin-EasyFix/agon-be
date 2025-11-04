import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../src/services/userService';
import { UserRepository } from '../../src/repositories/userRepository';
import { UserMapper } from '../../src/mappers/userMapper';
import { UserDbo } from '../../src/types/domain/UserDBO';
import { StravaAthlete } from '../../src/types/strava/StravaAthlete';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

// Mock dependencies
vi.mock('../../src/repositories/userRepository');
vi.mock('../../src/mappers/userMapper');
vi.mock('jsonwebtoken');
vi.mock('http-errors', async (importOriginal) => {
  const actual = await importOriginal<typeof createError>();
  // Mock the default export (the createError function) to return a standard Error object
  // which works well with Vitest's `toThrow` matcher.
  return {
    ...actual,
    default: (status: number, message: string) => {
      const err = new Error(message) as createError.HttpError;
      err.status = status;
      err.statusCode = status;
      return err;
    },
  };
});

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: UserRepository;

  beforeEach(() => {
    // Create new instances for each test to ensure isolation
    vi.clearAllMocks();
    mockUserRepository = new UserRepository();
    userService = new UserService(mockUserRepository);
    // Set a mock JWT secret for the test environment
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('upsertUserFromStrava', () => {
    it('should map strava data to a DBO and call the repository to upsert the user', async () => {
      // Arrange
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
  
      const userDbo: UserDbo = {
        stravaId: 12345,
        firstname: 'Test',
        lastname: 'User',
        profilePicture: 'http://example.com/profile.jpg',
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        tokenExpiresAt: new Date('2023-01-01T00:00:00.000Z'),
      };
  
      const expectedUserResult = {
        ...userDbo,
        id: 1,
        tokenExpiresAt: new Date('2023-01-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      // Mock the mapper and repository responses
      vi.spyOn(UserMapper, 'toUserDbo').mockReturnValue(userDbo);
      vi.spyOn(mockUserRepository, 'upsert').mockResolvedValue(expectedUserResult as any);
      // Act
      const result = await userService.upsertUserFromStrava(athleteData, tokenData);
  
      // Assert
      // 1. Check that the mapper was called correctly
      expect(UserMapper.toUserDbo).toHaveBeenCalledWith(athleteData, tokenData);
  
      // 2. Check that the repository was called with the result from the mapper
      expect(mockUserRepository.upsert).toHaveBeenCalledWith(userDbo);
  
      // 3. Check that the service returns the result from the repository
      expect(result).toEqual(expectedUserResult);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile for a valid token', async () => {
      // Arrange
      const token = 'valid.token.here';
      const decodedPayload = { stravaId: 123 };
      const mockUser = { id: 1, firstname: 'Test', lastname: 'User', profilePicture: 'url' };

      vi.mocked(jwt.verify).mockReturnValue(decodedPayload as any);
      vi.mocked(mockUserRepository.findByStravaId).mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserProfile(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(mockUserRepository.findByStravaId).toHaveBeenCalledWith(decodedPayload.stravaId);
      expect(result).toEqual(mockUser);
    });

    it('should throw 401 Unauthorized for an invalid or expired token', async () => {
      // Arrange
      const token = 'invalid.token.here';
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(userService.getUserProfile(token)).rejects.toThrow('Invalid or expired token');
      expect(mockUserRepository.findByStravaId).not.toHaveBeenCalled();
    });

    it('should throw 404 Not Found if user does not exist', async () => {
      // Arrange
      const token = 'valid.token.for.nonexistent.user';
      const decodedPayload = { stravaId: 404 };

      vi.mocked(jwt.verify).mockReturnValue(decodedPayload as any);
      // Mock the repository to return null, simulating a user not found
      vi.mocked(mockUserRepository.findByStravaId).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserProfile(token)).rejects.toThrow('User not found');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(mockUserRepository.findByStravaId).toHaveBeenCalledWith(decodedPayload.stravaId);
    });
  });
});