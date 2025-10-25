import prisma from '../prisma/client';
import { CreateUserDBO } from '../types/domain/CreateUserDBO';
import { UpdateUserDBO } from '../types/domain/UpdateUserDBO';

export class UserRepository {
  async upsert(stravaId: number, create: CreateUserDBO, update: UpdateUserDBO) {
    return prisma.user.upsert({
      where: { stravaId },
      create: {
        ...create,
      },
      update: {
        ...update,
      },
    });
  }
}

export const userRepository = new UserRepository();
