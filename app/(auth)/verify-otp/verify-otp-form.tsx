'use client';

import ButtonLoading from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/app/components/ui/input-otp';
import { authClient } from '@/app/lib/auth-client';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function VerifyOtpForm({ email }: { email: string }) {
  const [otp, setOtp] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function loginWithOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp(
        {
          email,
          otp,
        },
        {
          onSuccess: () => {
            router.push('/');
            toast.success('You have successfully logged in!');
          },
          onError: () => {
            toast.error('Sorry, there was an error. Unable to login with the provided OTP.');
          },
        }
      );
    });
  }

  return (
    <div className="bg-card text-card-foreground w-full max-w-lg space-y-4 rounded-lg border p-8 shadow-md">
      <h2 className="text-center text-xl font-semibold">Login with OTP</h2>
      <p className="text-center text-sm">
        Check your email for the one-time password we sent you and enter it in the field below
      </p>
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <ButtonLoading
        className="w-full"
        onClick={loginWithOtp}
        loading={isPending}
        disabled={otp.trim().length < 6}
      >
        <SendIcon />
        Submit
      </ButtonLoading>
      <div className="text-center">
        <Button variant="link" size="sm" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </div>
  );
}
