'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminSearch() {
  const pathName = usePathname();
  const formActionUrl = pathName.includes('/admin/orders')
    ? '/admin/orders'
    : pathName.includes('/admin/products')
    ? '/admin/products'
    : '/admin/users';

  const searchParams = useSearchParams();
  const searchValue = searchParams.get('query') || '';

  const [search, setSearch] = useState(searchValue);

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        placeholder="Search..."
        type="search"
        name="query"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
}
