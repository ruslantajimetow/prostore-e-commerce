'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/types';
import AutoPlay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
export default function ProductCarousel({ data }: { data: Product[] }) {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[
        AutoPlay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((p: Product) => (
          <CarouselItem key={p.id}>
            <Link href={`/product/${p.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={p.banner!}
                  alt="banner image"
                  height="0"
                  width="0"
                  className="w-full h-auto"
                  sizes="100vw"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                    {p.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
