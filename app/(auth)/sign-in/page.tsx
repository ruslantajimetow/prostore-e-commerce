import logo from '@/public/images/logo.svg';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CredentialsSignInForm from './credentials-signin-form';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex-center space-y-4">
        <Image src={logo} alt="logo" width={100} height={100} priority={true} />
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardDescription className="text-center">
        Sign in to your account
      </CardDescription>
      <CardContent className="space-y-4">
        <CredentialsSignInForm />
      </CardContent>
    </Card>
  );
}
