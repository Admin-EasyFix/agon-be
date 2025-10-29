import { StravaAthlete } from '../types/strava/StravaAthlete';
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

  async upsertUserFromStrava(athleteData: StravaAthlete, tokenData: StravaTokens) {
    const userDbo = UserMapper.toUserDbo(athleteData, tokenData);
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
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      throw createError(Unauthorized, 'Invalid or expired token');
    }
  }
}
