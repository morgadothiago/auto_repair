import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;