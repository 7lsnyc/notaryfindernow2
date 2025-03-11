import Image from 'next/image';
import { Notary } from '@/types';

interface NotaryProfileProps {
  notary: Notary;
}

export default function NotaryProfile({ notary }: NotaryProfileProps) {
  return (
    <div className="relative h-32 w-32 overflow-hidden rounded-full">
      <Image
        src={notary.profile_image_url || '/default-profile.png'}
        alt={`${notary.name}'s profile picture`}
        fill
        className="object-cover"
        sizes="(max-width: 128px) 100vw, 128px"
        priority
      />
    </div>
  );
}
