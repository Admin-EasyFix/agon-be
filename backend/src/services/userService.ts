import { UserRepository, userRepository } from '../repositories/userRepository';
import { UserMapper } from '../mappers/userMapper';
import { StravaTokens } from '../types/strava/StravaTokens';
import createError from 'http-errors';
import { User } from '@prisma/client';
import { HttpStatusCode } from 'axios';

const { NotFound } = HttpStatusCode;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepo: UserRepository = userRepository) {
    this.userRepository = userRepo;
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      throw createError(NotFound, 'User not found');
    }
    return user;
  }

  async getPartialUserById(userId: number): Promise<Partial<User>> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw createError(NotFound, 'User not found');
    }
    return UserMapper.toPartialUser(user);
  }

  async upsertUserFromStrava(tokens: StravaTokens) {
    const userDbo = UserMapper.toUserDbo(tokens);
    return this.userRepository.upsert(userDbo);
  }

  async getStravaTokensById(userId: number): Promise<StravaTokens | null> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      throw createError(NotFound, 'User not found');
    }
    return user ? UserMapper.toStravaTokens(user) : null;
  }

  async getStravaTokensByStravaId(stravaId: number): Promise<StravaTokens | null> {
    const user = await this.userRepository.getByStravaId(stravaId);
    if (!user) {
      throw createError(NotFound, 'User not found');
    }
    return user ? UserMapper.toStravaTokens(user) : null;
  }

  async deleteUserById(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
