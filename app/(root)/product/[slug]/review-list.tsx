'use client';

import { Review } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

export default function Reviewlist({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <p>No reviews yet</p>}

      {userId ? (
        <>Review Form</>
      ) : (
        <div>
          Please{' '}
          <Link
            className="text-blue-600"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign-in
          </Link>{' '}
          to leave a review
        </div>
      )}
      <div className="flex flex-col gap-3"></div>
    </div>
  );
}
