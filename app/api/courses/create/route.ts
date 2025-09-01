import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { CourseSchema } from '@/app/lib/schemas';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const body = await request.json();

    const result = CourseSchema.safeParse(body);

    if (!result.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const createdCourse = await prisma.course.create({
      data: { ...result.data, authorId: session.user.id },
    });

    return Response.json(createdCourse);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
