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

  async get(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async getByStravaId(stravaId: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { stravaId }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}

export const userRepository = new UserRepository();
