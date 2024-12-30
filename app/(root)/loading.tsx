import Image from 'next/image';
import loader from '@/assets/loader.gif';

export default function LoadingPage() {
  return (
    <div className="w-full flex-center">
      <Image
        src={loader}
        height={100}
        width={100}
        alt="Loading..."
        priority={true}
      />
    </div>
  );
}
