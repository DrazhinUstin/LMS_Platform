'use client';

import Image from 'next/image';
import githubMark from '@/public/github-mark-white.svg';
import googleMark from '@/public/google-mark.svg';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import ButtonLoading from '@/app/components/button-loading';
import { useTransition } from 'react';
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SendIcon } from 'lucide-react';

export default function LoginForm() {
  return (
    <div className="w-full max-w-96 space-y-4 rounded-md border p-8 shadow-md">
      <h2 className="text-center text-xl font-semibold">Login with</h2>
      <EmailOtp />
      <div className="before:bg-border relative flex items-center justify-center before:absolute before:-z-10 before:h-[1px] before:w-full">
        <span className="bg-background px-4">or</span>
      </div>
      <SocialProviders />
    </div>
  );
}

function EmailOtp() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function sendVerificationOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: 'sign-in',
        },
        {
          onSuccess: () => {
            router.push(`/verify-otp?email=${email}`);
          },
          onError: () => {
            toast.error('Sorry, there was an error. Unable to send OTP to the provided email.');
          },
        }
      );
    });
  }

  return (
    <form onSubmit={sendVerificationOtp}>
      <Label htmlFor="email" className="mb-2">
        Email
      </Label>
      <div className="flex gap-x-1">
        <Input type="email" id="email" placeholder="mefisto666@mail.com" required />
        <ButtonLoading loading={isPending}>
          <SendIcon />
        </ButtonLoading>
      </div>
    </form>
  );
}

function SocialProviders() {
  const [isGithubLoginPending, startGithubLoginTransition] = useTransition();
  const [isGoogleLoginPending, startGoogleLoginTransition] = useTransition();

  function loginWithGithub() {
    startGithubLoginTransition(async () => {
      await authClient.signIn.social(
        { provider: 'github', callbackURL: '/' },
        {
          onError: () => {
            toast.error('Sorry, there was an error. Unable to login with github.');
          },
        }
      );
    });
  }

  function loginWithGoogle() {
    startGoogleLoginTransition(async () => {
      await authClient.signIn.social(
        { provider: 'google', callbackURL: '/' },
        {
          onError: () => {
            toast.error('Sorry, there was an error. Unable to login with google.');
          },
        }
      );
    });
  }

  return (
    <div className="space-y-4">
      <ButtonLoading
        type="button"
        className="w-full"
        loading={isGithubLoginPending}
        onClick={loginWithGithub}
      >
        <Image src={githubMark} alt="github mark" className="size-5" />
        Github
      </ButtonLoading>
      <ButtonLoading
        type="button"
        className="w-full"
        variant="outline"
        loading={isGoogleLoginPending}
        onClick={loginWithGoogle}
      >
        <Image src={googleMark} alt="google mark" className="size-5" />
        Google
      </ButtonLoading>
    </div>
  );
}
