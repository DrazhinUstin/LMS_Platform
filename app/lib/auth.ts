import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/app/lib/prisma';
import { env } from '@/env';
import { admin, emailOTP } from 'better-auth/plugins';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'sign-in') {
          const { error } = await resend.emails.send({
            from: 'LMS Platform <onboarding@resend.dev>',
            to: [email],
            subject: 'Login to the LMS Platform',
            html: `<p>Your verification one time password is <strong>${otp}</strong></p>`,
          });
          if (error) throw error;
        }
      },
    }),
    admin(),
  ],
});

export type Session = typeof auth.$Infer.Session;
