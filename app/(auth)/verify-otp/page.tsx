import { notFound, redirect } from 'next/navigation';
import VerifyOtpForm from './verify-otp-form';
import type { Metadata } from 'next';
import { getSession } from '@/app/lib/auth.get-session';

export const metadata: Metadata = {
  title: 'Verify OTP',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const session = await getSession();

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
