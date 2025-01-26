import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { formatId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Users',
};

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page = '1' } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page) });
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">NAME</TableHead>
              <TableHead className="text-center">EMAIL</TableHead>
              <TableHead className="text-center">ROLE</TableHead>
              <TableHead className="text-center">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">
                  {formatId(user.id)}
                </TableCell>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  {user.role === 'admin' ? (
                    <Badge variant="default">{user.role}</Badge>
                  ) : (
                    <Badge variant="outline">{user.role}</Badge>
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-2 justify-center">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPages} />
        )}
      </div>
    </div>
  );
}
