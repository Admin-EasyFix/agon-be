import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  accelerateUrl: process.env.DATABASE_URL,
});

export default prisma;