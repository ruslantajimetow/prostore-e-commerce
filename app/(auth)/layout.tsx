import Footer from '@/components/footer';
import Header from '@/components/shared/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-screen wrapper flex-center">{children}</main>;
}
