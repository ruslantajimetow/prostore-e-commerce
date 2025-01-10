import { cn } from '@/lib/utils';
import React from 'react';

export default function CheckOutSteps({ current = 0 }: { current: number }) {
  return (
    <div className="flex-between flex-col space-x-2 space-y-2 mb-10 md:flex-row">
      {['User Login', 'Shipping address', 'Payment Method', 'Place order'].map(
        (step, i) => {
          return (
            <React.Fragment key={step}>
              <div
                className={cn(
                  'p-2 w-56 rounded-full text-center text-sm',
                  i === current
                    ? 'bg-secondary font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {step}
              </div>
              {step !== 'Place order' && (
                <hr className="w-16 border-t border-gray-300 mx-2" />
              )}
            </React.Fragment>
          );
        }
      )}
    </div>
  );
}
