import { s3Client } from '@/app/lib/s3-client';
import { env } from '@/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import z from 'zod';

const schema = z.object({
  filename: z.string().min(1),
  filetype: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return new Response('Invalid request body!', {
        status: 400,
      });
    }

    const { filename, filetype } = result.data;

    const key = `${filename}-${crypto.randomUUID()}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: filetype,
    });

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 300 });

    return Response.json({ presignedUrl, key });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error!', {
      status: 500,
    });
  }
}
