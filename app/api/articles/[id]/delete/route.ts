import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
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

    const article = await prisma.article.findUnique({
      where: { id, authorId: session.user.id },
      select: { id: true },
    });

    if (!article) {
      return new Response('Record not found or you are not authorized to delete it!', {
        status: 404,
      });
    }

    const deletedArticle = await prisma.article.delete({ where: { id: article.id } });

    revalidatePath('/admin/articles');

    return Response.json(deletedArticle);
  } catch (error) {
    console.error(error);

    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
