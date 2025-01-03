import React from 'react';
import ThemeDropdown from './theme-dropdown';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';

export default function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex items-center w-full max-w-xs gap-1">
        <ThemeDropdown />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex items-start flex-col gap-2">
            <SheetTitle>Menu</SheetTitle>

            <ThemeDropdown />
            <Button asChild className="w-1/2 sm:w-1/3" variant="outline">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
