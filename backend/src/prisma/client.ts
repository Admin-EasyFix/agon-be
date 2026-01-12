import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  accelerateUrl: "prisma+postgres://" + process.env.DATABASE_URL,
});

export default prisma;