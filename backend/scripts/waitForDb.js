const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const timeout = 60000; // 60 seconds
const startTime = Date.now();

const tryPrismaConnection = async () => {
  console.log('Attempting to connect to the database...');
  try {
    await prisma.$connect();
    console.log('Database connection established via Prisma Client!');
    await prisma.$disconnect(); // Disconnect after successful connection check
    process.exit(0); // Success
  } catch (error) {
    const now = Date.now();
    if (now - startTime > timeout) {      
      console.error('Database connection timed out after multiple retries.');
      console.error('Error details:', error.message); // Log the actual Prisma error message
      process.exit(1);
    }
    console.log(`Connection failed. Retrying in 1 second... (Error: ${error.message})`);
    setTimeout(tryPrismaConnection, 1000);
  }
};

tryPrismaConnection();