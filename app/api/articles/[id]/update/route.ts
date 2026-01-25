import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { ArticleSchema } from '@/app/lib/schemas';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
      return new Response('Record not found or you are not authorized to update it!', {
        status: 404,
      });
    }

    const body = await request.json();

    const validation = ArticleSchema.safeParse(body);

    if (!validation.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: article.id },
      data: { ...validation.data },
    });

    return Response.json(updatedArticle);
  } catch (error) {
    console.error(error);

    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
