import { ShoppingCart, User, UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import ThemeDropdown from './theme-dropdown';

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex-between wrapper">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={48}
              height={48}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div className="space-x-2">
          <ThemeDropdown />
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart /> Cart
            </Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/sign-in">
              <UserIcon /> Sign in
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
