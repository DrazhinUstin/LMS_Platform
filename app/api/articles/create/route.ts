import { getSession } from '@/app/lib/auth.get-session';
import { prisma } from '@/app/lib/prisma';
import { ArticleSchema } from '@/app/lib/schemas';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const body = await request.json();

    const validation = ArticleSchema.safeParse(body);

    if (!validation.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const createdArticle = await prisma.article.create({
      data: {
        ...validation.data,
        authorId: session.user.id,
      },
    });

    return Response.json(createdArticle);
  } catch (error) {
    console.error(error);

    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
