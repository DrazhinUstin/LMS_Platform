import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { stripe } from '@/app/lib/stripe';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id, authorId: session.user.id },
      select: { id: true, stripeProductId: true, stripePriceId: true },
    });

    if (!course) {
      return new Response('Record not found or you are not authorized to delete it!', {
        status: 404,
      });
    }

    await stripe.products.update(course.stripeProductId, { default_price: '' });

    await stripe.prices.update(course.stripePriceId, {
      active: false,
    });

    try {
      await stripe.products.del(course.stripeProductId);
    } catch {
      await stripe.products.update(course.stripeProductId, { active: false });
    }

    const deletedCourse = await prisma.course.delete({ where: { id: course.id } });

    revalidatePath('/admin/courses');

    return Response.json(deletedCourse);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
