import { StravaAthlete } from '../types/strava/StravaAthlete';
import { UserRepository, userRepository } from '../repositories/userRepository';
import { UserMapper } from '../mappers/userMapper';
import { StravaTokens } from '../types/strava/StravaTokens';
import { UserDbo } from '../types/domain/UserDBO';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepo: UserRepository = userRepository) {
    this.userRepository = userRepo;
  }

  async upsertUserFromStrava(athleteData: StravaAthlete, tokenData: StravaTokens) {
    const userDbo = UserMapper.toUserDbo(athleteData, tokenData);
    return this.userRepository.upsert(userDbo);
  }
}
