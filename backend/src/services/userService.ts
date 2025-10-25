import { StravaAthlete } from '../types/strava/StravaAthlete';
import { UserRepository, userRepository } from '../repositories/userRepository';
import { UserMapper } from '../mappers/userMapper';
import { StravaTokens } from '../types/strava/StravaTokens';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepo: UserRepository = userRepository) {
    this.userRepository = userRepo;
  }

  async upsertUserFromStrava(athleteData: StravaAthlete, tokenData: StravaTokens) {
    const createData = UserMapper.toCreateDBO(athleteData, tokenData);
    const updateData = UserMapper.toUpdateDBO(tokenData);

    return this.userRepository.upsert(athleteData.id, createData, updateData);
  }
}
