import { cn } from '@/lib/utils';
import Link from 'next/link';

const pricesRate = [
  { label: 'Any', value: 'all' },
  { label: '$1 to $50', value: '1-50' },
  { label: '$51 to $100', value: '51-100' },
  { label: '$101 to $200', value: '101-200' },
  { label: '$201 to $500', value: '201-500' },
  { label: '$500 to $1000', value: '501-1000' },
];

const ratings = [
  { label: 'Any', value: 'all' },
  { label: '4 stars & up', value: '4' },
  { label: '3 stars & up', value: '3' },
  { label: '2 stars & up', value: '2' },
  { label: '1 star & up', value: '1' },
];

export default function FilterLinks({
  allCategories,
  linksFn,
  category,
  price,
  rating,
}: {
  allCategories: { category: string; _count: number }[];
  linksFn: ({
    c,
    query,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    query?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => string;
  category?: string;
  price?: string;
  rating?: string;
}) {
  return (
    <div className="flex justify-center items-start gap-8 md:flex-col md:justify-start md:space-y-8 md:gap-0">
      <div className="flex flex-col items-start space-y-2">
        <h3 className="text-2xl font-normal">Department</h3>
        <Link
          href={linksFn({ c: 'all' })}
          className={cn('text-md', category === 'all' ? 'font-bold' : '')}
        >
          Any
        </Link>

        {allCategories.map((c) => (
          <Link
            key={c.category}
            href={linksFn({ c: c.category })}
            className={cn(
              'text-md',
              category === c.category ? 'font-bold' : ''
            )}
          >
            {c.category}
          </Link>
        ))}
      </div>
      <div className="flex flex-col items-start space-y-2">
        <h3 className="text-2xl font-normal">Price</h3>
        {pricesRate.map((prices) => (
          <Link
            key={prices.label}
            href={linksFn({ p: prices.value })}
            className={cn('text-md', price === prices.value ? 'font-bold' : '')}
          >
            {prices.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col items-start space-y-2">
        <h3 className="text-2xl font-normal">Customer Review</h3>
        {ratings.map((rt) => (
          <Link
            key={rt.label}
            href={linksFn({ r: rt.value })}
            className={cn('text-md', rating === rt.value ? 'font-bold' : '')}
          >
            {rt.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
