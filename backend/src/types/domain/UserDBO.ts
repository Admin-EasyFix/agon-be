import { User } from '@prisma/client';

/**
 * A flexible Database Object for creating and updating users.
 *
 * It requires `stravaId` for all operations but makes other fields optional,
 * suitable for both creation (where most fields are present) and partial updates.
 */
export type UserDbo = Pick<User, 'stravaId'> &
  Partial<
    Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'stravaId'
    >
  >;
