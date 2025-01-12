import { Metadata } from 'next';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@/auth';
import PaymentMethodForm from './payment-method-form';
import CheckOutSteps from '@/components/shared/check-out-steps';

export const metadata: Metadata = {
  title: 'Payment Method',
};

export default async function page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User id not found');

  const user = await getUserById(userId);

  return (
    <div>
      <CheckOutSteps current={2} />
      <PaymentMethodForm prefferredPaymentMethod={user.paymantMethod} />
    </div>
  );
}
