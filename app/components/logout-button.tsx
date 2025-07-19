'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/app/lib/auth-client';
import ButtonLoading from '@/app/components/button-loading';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function logout() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login');
            toast.success('You have successfully logged out!');
          },
          onError: () => {
            toast.error('Sorry, there was an error while logging out. Please try again.');
          },
        },
      });
    });
  }

  return (
    <ButtonLoading
      type="button"
      variant="destructive"
      className={className}
      onClick={logout}
      loading={isPending}
    >
      <LogOutIcon />
      Logout
    </ButtonLoading>
  );
}
