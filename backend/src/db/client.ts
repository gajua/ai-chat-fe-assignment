import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client 싱글톤 인스턴스
 * 개발 환경에서 핫 리로드 시 여러 인스턴스 생성 방지
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}



