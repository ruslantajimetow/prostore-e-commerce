'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';

export default function ProductImages({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <Image
        src={`${images[mainImage]}`}
        alt="Product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
        priority={true}
      />
      <div className="flex gap-2">
        {images.map((image, index) => {
          return (
            <Image
              key={index}
              src={image}
              alt="Product image"
              width={100}
              height={100}
              priority={true}
              className={cn(
                'cursor-pointer hover:border',
                mainImage === index && 'border border-yellow-400'
              )}
              onClick={() => setMainImage(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
