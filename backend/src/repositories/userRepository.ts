import prisma from '../prisma/client';
import { UserDbo } from '../types/domain/UserDBO';
import { User } from '@prisma/client';

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

  async get(id: number): Promise<UserDbo | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async findByStravaId(stravaId: number): Promise<Partial<User> | null> {
    return prisma.user.findUnique({
      where: { stravaId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        profilePicture: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
