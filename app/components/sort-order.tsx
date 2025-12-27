'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SortOrder({ options }: { options: Array<[value: string, name: string]> }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('order', value);

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Select defaultValue={searchParams.get('order') ?? undefined} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select sort order" />
      </SelectTrigger>
      <SelectContent>
        {options.map(([value, name]) => (
          <SelectItem key={value} value={value}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
