'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function CredentialsSignInForm() {
  return (
    <form>
      <div className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            required
            placeholder="johndoe@example.com"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            required
            placeholder="********"
          />
        </div>
        <div>
          <Button variant="default" type="submit" className="w-full">
            Sign in
          </Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
