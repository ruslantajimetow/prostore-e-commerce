'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const links = [
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Orders',
    href: '/user/orders',
  },
];

export default function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className={cn(
            'text-md font-medium transition-colors hover:text-primary',
            pathName.includes(link.href) ? '' : 'text-muted-foreground'
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
