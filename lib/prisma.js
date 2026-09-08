import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
const globalForPrisma = globalThis;

function createPrismaClient() {
  // Menyiapkan adapter MariaDB
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT|| 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'database_development',
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}