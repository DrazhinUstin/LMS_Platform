import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import VerifyOtpForm from './verify-otp-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify OTP',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/');
  }

  const email = (await searchParams).email;

  if (!email) {
    notFound();
  }

  return (
    <main className="grid h-screen place-items-center">
      <VerifyOtpForm email={email} />
    </main>
  );
}
