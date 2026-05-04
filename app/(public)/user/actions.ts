'use server';

import z from 'zod';
import { ProfileSchema } from '@/app/lib/schemas';
import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function editProfile(data: z.infer<typeof ProfileSchema>) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Unauthorized!');
    }

    const validation = ProfileSchema.safeParse(data);

    if (!validation.success) {
      throw new Error('Invalid data!');
    }

    const editedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: validation.data,
    });

    revalidatePath('/');

    return editedProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
