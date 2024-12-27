'use client';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

export default function NotFoundPage() {
  return (
    <div className="flex-center flex-col h-screen">
      <Image
        src="/images/logo.svg"
        height={48}
        width={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 w-1/3 text-center shadow-md rounded-lg mt-3">
        <h1 className="h1-bold">Not Found</h1>
        <p className="text-destructive mt-4">Couldn't find requested page</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.replace('/')}
        >
          Back to Home Page
        </Button>
      </div>
    </div>
  );
}
