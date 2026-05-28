'use server';

import z from 'zod';
import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getS3ObjectUrl } from '@/app/lib/utils';

export async function updateUserImage(s3key: string) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const validation = z.string().safeParse(s3key);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: getS3ObjectUrl(s3key) },
    });

    revalidatePath('/');

    return updatedUser.image;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
