import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database functions

// Contest functions
export async function createContest(name: string, postId: string, description?: string) {
  return prisma.contest.create({
    data: {
      name,
      postId,
      description,
    },
  });
}

export async function getContests() {
  return prisma.contest.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      entries: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getContestById(id: number) {
  return prisma.contest.findUnique({
    where: { id },
  });
}

export async function updateContest(id: number, data: Record<string, unknown>) {
  return prisma.contest.update({
    where: { id },
    data,
  });
}

export async function deleteContest(id: number) {
  return prisma.contest.delete({
    where: { id },
  });
}

// Entry functions
export async function createEntry(contestId: number, commentId: string, userName: string, number: number) {
  return prisma.entry.create({
    data: {
      contestId,
      commentId,
      userName,
      number,
    },
  });
}

export async function getContestEntries(contestId: number) {
  return prisma.entry.findMany({
    where: {
      contestId,
    },
    orderBy: {
      number: 'asc',
    },
  });
}

export async function getEntryByCommentId(contestId: number, commentId: string) {
  return prisma.entry.findFirst({
    where: {
      contestId,
      commentId,
    },
  });
}

export async function getEntryByNumber(contestId: number, number: number) {
  return prisma.entry.findFirst({
    where: {
      contestId,
      number,
    },
  });
}

// Facebook token functions
export async function saveAccessToken(tokenType: string, token: string, expiresAt: Date | null = null) {
  const result = await prisma.facebookToken.create({
    data: {
      tokenType,
      token,
      expiresAt,
    },
  });
  
  return result.id;
}

export async function getLatestAccessToken() {
  return prisma.facebookToken.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Activity log functions
export async function logActivity(type: string, message: string, contestId: number | null = null, ipAddress: string | null = null) {
  return prisma.activity.create({
    data: {
      type,
      message,
      contestId,
      ipAddress,
    },
  });
}

export async function getRecentActivityLogs(limit: number = 50, contestId: number | null = null) {
  return prisma.activity.findMany({
    where: contestId ? { contestId } : {},
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    include: {
      contest: {
        select: {
          name: true,
        },
      },
    },
  });
}
