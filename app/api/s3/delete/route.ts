import { auth } from '@/app/lib/auth';
import { s3Client } from '@/app/lib/s3-client';
import { env } from '@/env';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { headers } from 'next/headers';
import z from 'zod';

const schema = z.object({
  key: z.string().min(1),
});

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      return new Response('Unauthorized!', {
        status: 401,
      });
    }

    const body = await request.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const { key } = result.data;

    const command = new DeleteObjectCommand({ Bucket: env.AWS_BUCKET_NAME, Key: key });

    await s3Client.send(command);

    return new Response();
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
