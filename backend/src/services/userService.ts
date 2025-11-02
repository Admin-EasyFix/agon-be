import { UserRepository, userRepository } from '../repositories/userRepository';
import { UserMapper } from '../mappers/userMapper';
import { StravaTokens } from '../types/strava/StravaTokens';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepo: UserRepository = userRepository) {
    this.userRepository = userRepo;
  }

  async upsertUserFromStrava(tokens: StravaTokens) {
    const userDbo = UserMapper.toUserDbo(tokens);
    return this.userRepository.upsert(userDbo);
  }

  async getUserById(userId: number): Promise<StravaTokens | null> {
    const userDbo = await this.userRepository.get(userId);
    return userDbo ? UserMapper.toStravaTokens(userDbo) : null;
  }
}
