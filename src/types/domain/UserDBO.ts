import { User } from '@prisma/client';

/**
 * A Database Object for creating or updating a user with a full set of data,
 * typically after an OAuth flow.
 *
 * It makes database-generated fields optional but requires all fields
 * that are expected from the identity provider.
 */
export type UserDbo = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt'
>;
