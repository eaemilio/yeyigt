import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuthSession } from '../lib/hooks';

export default function ProfileAvatar() {
    const { userMeta } = useAuthSession();

    return (
        <Link href="/profile">
            <a className="flex items-center cursor-pointer z-20">
                <div className="flex flex-col mx-2">
                    <span className="font-bold text-xs text-zinc-800">
                        {userMeta?.first_name ?? ''} {userMeta?.last_name ?? ''}
                    </span>
                </div>
                <Image
                    className="rounded-full  dark:ring-zinc-700"
                    src={userMeta?.avatar_url ?? '/vercel.svg'}
                    alt="Profile"
                    width={36}
                    height={36}
                />
            </a>
        </Link>
    );
}
