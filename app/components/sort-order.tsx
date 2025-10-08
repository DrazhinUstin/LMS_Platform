'use client';

import type { Prisma } from '@/generated/prisma';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type OptionType = {
  id: string | number;
  name: string;
  value: { [key: string]: Prisma.SortOrder };
};

export default function SortOrder({ options }: { options: OptionType[] }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set('orderBy', value);

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Select
      defaultValue={searchParams.get('orderBy') ?? undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select sort order" />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ id, name, value }) => (
          <SelectItem key={id} value={JSON.stringify(value)}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
