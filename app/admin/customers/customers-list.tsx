import { cn, formatPrice } from '@/app/lib/utils';
import { Skeleton } from '@/app/components/ui/skeleton';
import UserAvatar from '@/app/components/user-avatar';
import { customersPerPage, type CustomerTypeWithSelect } from './get-customers';

export default function CustomersList({ customers }: { customers: CustomerTypeWithSelect[] }) {
  return (
    <ul className="text-sm">
      <li className="hidden grid-cols-[2fr_2fr_1fr_1fr] gap-2 border-b pb-2 font-semibold lg:grid">
        <h4>Name</h4>
        <h4>Email</h4>
        <h4>Enrollments</h4>
        <h4>Total amount</h4>
      </li>
      {customers.map((customer, index) => (
        <li
          key={customer.id}
          className={cn(
            'grid gap-2 border-b py-4 lg:grid-cols-[2fr_2fr_1fr_1fr] lg:items-center',
            index === 0 && 'border-t lg:border-t-0'
          )}
        >
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Name</h4>
            <div className="flex items-center gap-x-2">
              <UserAvatar src={customer.image} width={24} height={24} />
              <h4 className="line-clamp-1 font-medium">{customer.name}</h4>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Email</h4>
            <p className="line-clamp-1">{customer.email}</p>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Enrollments</h4>
            <p>{customer.enrollments.length}</p>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Total amount</h4>
            <p>
              {formatPrice(customer.enrollments.reduce((acc, item) => acc + item.amount, 0) / 100)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CustomersListSkeleton() {
  return (
    <ul className="text-sm">
      <li className="hidden grid-cols-[2fr_2fr_1fr_1fr] gap-2 border-b pb-2 font-semibold lg:grid">
        <h4>Name</h4>
        <h4>Email</h4>
        <h4>Enrollments</h4>
        <h4>Total amount</h4>
      </li>
      {Array.from({ length: customersPerPage }).map((_, index) => (
        <li
          key={index}
          className={cn(
            'grid gap-2 border-b py-4 lg:grid-cols-[2fr_2fr_1fr_1fr] lg:items-center',
            index === 0 && 'border-t lg:border-t-0'
          )}
        >
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Name</h4>
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Email</h4>
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Enrollments</h4>
            <Skeleton className="h-5 w-18" />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-x-2 lg:block">
            <h4 className="font-semibold lg:hidden">Total amount</h4>
            <Skeleton className="h-5 w-18" />
          </div>
        </li>
      ))}
    </ul>
  );
}
