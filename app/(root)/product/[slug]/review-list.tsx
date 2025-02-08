'use client';

import { Review } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserIcon } from 'lucide-react';
import { formatDateAndTime } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';

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

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews(productId);
      setReviews(res.reviews);
    };
    loadReviews();
  }, [productId]);

  const reload = async () => {
    const res = await getReviews(productId);
    setReviews([...res.reviews]);
  };
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <p>No reviews yet</p>}

      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
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
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle>{review.title}</CardTitle>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Rating value={Number(review.rating)} />
            </CardContent>
            <CardFooter>
              <div className="flex gap-3 text-sm text-muted-foreground">
                <div className="flex">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {review.user.name}
                </div>
                <div>{formatDateAndTime(review.createdAt).dateTime}</div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
