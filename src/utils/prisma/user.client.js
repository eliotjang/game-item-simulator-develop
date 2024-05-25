import { PrismaClient } from '../../../prisma/userClient/index.js';

const userPrisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],

  errorFormat: 'pretty',
});

export default userPrisma;
