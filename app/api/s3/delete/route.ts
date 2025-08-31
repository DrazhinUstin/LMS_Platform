import { s3Client } from '@/app/lib/s3-client';
import { env } from '@/env';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import z from 'zod';

const schema = z.object({
  key: z.string().min(1),
});

export async function DELETE(request: Request) {
  try {
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
