import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthSession } from '../lib/hooks';
import { supabase } from '../utils/supabaseClient';

export default function ProfileAvatar() {
  const { userMeta } = useAuthSession();

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!userMeta) {
      return;
    }
    setAvatarUrl(userMeta.avatar_url);
  }, [userMeta]);

  return (
    <Link href="/profile" legacyBehavior>
      <a className="flex items-center cursor-pointer z-20">
        <div className="flex flex-col mx-2">
          <span className="font-bold text-xs text-zinc-800">
            {userMeta?.first_name ?? ''} {userMeta?.last_name ?? ''}
          </span>
        </div>
        <div className="block h-10 w-10 relative">
          {avatarUrl && (
            <Image
              className="rounded-full object-cover"
              src={`https://supabase-cdn.vercel.app/api/resize?f=${avatarUrl}&b=avatars&w=150`}
              alt="Profile"
              width={36}
              height={36}
              layout="responsive"
            />
          )}
        </div>
      </a>
    </Link>
  );
}
