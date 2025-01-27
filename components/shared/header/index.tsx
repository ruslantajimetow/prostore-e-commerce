import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoryDrawer from './category-drawer';

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex-between wrapper">
        <div className="flex-start gap-3">
          <CategoryDrawer />
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
          <Menu />
        </div>
      </div>
    </header>
  );
}
