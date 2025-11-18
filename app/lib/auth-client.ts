import { env } from '@/env';
import { createAuthClient } from 'better-auth/react';
import { emailOTPClient, adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [emailOTPClient(), adminClient()],
});
