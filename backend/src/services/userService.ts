import { UserRepository, userRepository } from '../repositories/userRepository';
import { UserMapper } from '../mappers/userMapper';
import { StravaTokens } from '../types/strava/StravaTokens';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '@prisma/client';
import { JwtPayload } from '../types/auth/JwtPayload';
import { HttpStatusCode } from 'axios';

const { Unauthorized } = HttpStatusCode;
const { NotFound } = HttpStatusCode;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepo: UserRepository = userRepository) {
    this.userRepository = userRepo;
  }

  async getUserProfile(token: string): Promise<Partial<User>> {
    const decodedPayload = this._decodeJwt(token);
    return await this._getExistingUserByStravaId(decodedPayload.stravaId);
  }

  async upsertUserFromStrava(tokens: StravaTokens) {
    const userDbo = UserMapper.toUserDbo(tokens);
    return this.userRepository.upsert(userDbo);
  }

  private async _getExistingUserByStravaId(stravaId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findByStravaId(stravaId);
    if (!user) {
      throw createError(NotFound, 'User not found');
    }
    return user;
  }

  private _decodeJwt(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      throw createError(Unauthorized, 'Invalid or expired token');
    }
  }

  async getUserById(userId: number): Promise<StravaTokens | null> {
    const userDbo = await this.userRepository.get(userId);
    return userDbo ? UserMapper.toStravaTokens(userDbo) : null;
  }
}
