import Image from 'next/image';
import loader from '@/assets/loader.gif';

export default function LoadingPage() {
  return (
    <div className="w-screen h-screen flex-center">
      <Image
        src={loader}
        height={150}
        width={150}
        alt="Loading..."
        priority={true}
      />
    </div>
  );
}
