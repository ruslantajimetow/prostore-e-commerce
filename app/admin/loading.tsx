import Image from 'next/image';
import loader from '@/assets/loader.gif';

export default function LoadingPage() {
  return (
    <div className="mt-20 flex-center">
      <Image
        src={loader}
        height={80}
        width={80}
        alt="Loading..."
        priority={true}
      />
    </div>
  );
}
