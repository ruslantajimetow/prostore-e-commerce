import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UpdateUSerForm from './update-user-form';

export const metadata: Metadata = {
  title: 'Admin User Update',
};

export default async function AdminUserUpdatePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUSerForm user={user} />
    </div>
  );
}
