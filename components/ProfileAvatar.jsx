import Image from 'next/image';
import Link from 'next/link';
import { useAuthSession } from '../lib/hooks';

export default function ProfileAvatar() {
    const { userMeta } = useAuthSession();

    return userMeta ? (
        <Link href="/profile">
            <a className="flex items-center cursor-pointer">
                <div className="flex flex-col mx-2">
                    <span className="font-bold text-xs text-zinc-800">
                        {userMeta.first_name} {userMeta.last_name}
                    </span>
                </div>
                <Image
                    className="rounded-full ring-2 ring-white dark:ring-zinc-700"
                    src={userMeta.avatar_url}
                    alt="Profile"
                    width={24}
                    height={24}
                />
            </a>
        </Link>
    ) : (
        <div></div>
    );
}
