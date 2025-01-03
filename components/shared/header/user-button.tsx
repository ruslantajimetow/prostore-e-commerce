import { auth } from '@/auth';
import { signOutAction } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';

export default async function UserButton() {
  const session = await auth();
  const firstLetter = session?.user?.name?.charAt(0);
  return (
    <div>
      {session ? (
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 ml-2"
                >
                  {firstLetter}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="p-0">
                <div className="flex flex-col items-center bg-gray-100 p-2 rounded-lg">
                  <span className="text-sm font-bold">
                    {session?.user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2 mb-1">
                <form action={signOutAction} className="w-full">
                  <Button
                    className="w-full py-4 px-2 h-4 justify-start"
                    variant="ghost"
                  >
                    Sign Out
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button asChild variant="default">
          <Link href="/sign-in">
            <UserIcon /> Sign in
          </Link>
        </Button>
      )}
    </div>
  );
}
