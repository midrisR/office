import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
const globalForPrisma = globalThis;

function createPrismaClient() {
  // Menyiapkan adapter MariaDB
  const adapter = new PrismaMariaDb({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST || "srv2186.hstgr.io",
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || "u119661370_trp",
    password: process.env.DATABASE_PASSWORD || "Seles12Gbs",
    database: process.env.DATABASE_NAME || "u119661370_development",
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
