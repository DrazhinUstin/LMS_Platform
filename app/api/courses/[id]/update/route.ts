import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { CourseSchema } from '@/app/lib/schemas';
import { headers } from 'next/headers';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const { id } = await params;

    const course = await prisma.course.findUnique({ where: { id }, select: { id: true } });

    if (!course) {
      return new Response('Record not found!', {
        status: 404,
      });
    }

    const body = await request.json();

    const validation = CourseSchema.safeParse(body);

    if (!validation.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { ...validation.data },
    });

    return Response.json(updatedCourse);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
