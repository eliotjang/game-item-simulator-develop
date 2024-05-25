import { PrismaClient } from '../../../prisma/gameClient/index.js';

const gamePrisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],

  errorFormat: 'pretty',
});

export default gamePrisma;
