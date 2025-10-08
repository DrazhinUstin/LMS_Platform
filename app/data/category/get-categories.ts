import 'server-only';
import { prisma } from '@/app/lib/prisma';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
