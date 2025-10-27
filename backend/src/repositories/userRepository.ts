import prisma from '../prisma/client';
import { UserDbo } from '../types/domain/UserDBO';

export class UserRepository {
  async upsert(dbo: UserDbo) {
    const { stravaId, ...updateData } = dbo;

    return prisma.user.upsert({
      where: { stravaId },
      create: {
        ...dbo,
      },
      update: {
        ...updateData,
      },
    });
  }
}

export const userRepository = new UserRepository();
