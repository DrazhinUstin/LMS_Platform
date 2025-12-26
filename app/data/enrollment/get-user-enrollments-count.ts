import 'server-only';
import { prisma } from '@/app/lib/prisma';

export async function getUserEnrollmentsCount({ userId }: { userId: string }) {
  try {
    const count = await prisma.enrollment.count({ where: { userId, status: 'ACTIVE' } });
    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
