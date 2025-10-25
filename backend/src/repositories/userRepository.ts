import prisma from '../prisma/client';
import { UserDbo } from '../types/domain/UserDBO';

export class UserRepository {
  async upsert(dbo: UserDbo) {
    const { stravaId, ...updateData } = dbo;

    return prisma.user.upsert({
      where: { stravaId },
      create: {
        // The DBO is flexible, but for creation, we expect all fields.
        // Casting to `any` here is a pragmatic way to handle the mismatch
        // between the flexible DBO and the strict `create` input type.
        ...(dbo as any),
      },
      update: {
        ...updateData,
      },
    });
  }
}

export const userRepository = new UserRepository();
