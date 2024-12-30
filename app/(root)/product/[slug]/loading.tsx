import Image from 'next/image';
import loader from '@/assets/loader.gif';

export default function LoadingPage() {
  return (
    <div className="w-full flex-center mt-16">
      <Image
        src={loader}
        height={60}
        width={60}
        alt="Loading..."
        priority={true}
      />
    </div>
  );
}
