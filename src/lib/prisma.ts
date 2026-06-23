import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaBetterSqlite3 | undefined;
};

function getAdapter() {
  if (globalForPrisma.adapter) return globalForPrisma.adapter;

  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.adapter = adapter;
  }

  return adapter;
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: getAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
