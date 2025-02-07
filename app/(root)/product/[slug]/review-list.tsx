'use client';

import { Review } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import ReviewForm from './review-form';

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
        <ReviewForm userId={userId} productId={productId} />
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
