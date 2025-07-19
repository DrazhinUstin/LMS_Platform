import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ButtonLoading({
  children,
  loading,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'asChild'> & { loading?: boolean }) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </Button>
  );
}
