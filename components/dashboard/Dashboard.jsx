import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import ProfileAvatar from '../ProfileAvatar';
import { useRouter } from 'next/router';
import { SessionContext } from '../../lib/context';
import { supabase } from '../../utils/supabaseClient';

export default function Dashboard(props) {
    const { pathname } = useRouter();
    const [current, setCurrent] = useState('');
    const [isSignedIn, setIsSignedIn] = useState(true);
    const { session } = useContext(SessionContext);

    useEffect(() => {
        setIsSignedIn(!!session.access_token);
        setCurrent(pathname.split('/')[1]);
    }, [session, pathname]);

    function logout() {
        supabase.auth.signOut();
    }

    return isSignedIn ? (
        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex">
            <div className="h-full w-1/4 max-w-xs min-w-fit border bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 py-24 px-6 flex flex-col justify-between">
                <div>
                    <Link href="/">
                        <a
                            className={`font-lg my-5 rounded-full py-3 px-6 text-sm flex items-center ease-in-out duration-300 ${
                                current === ''
                                    ? 'bg-red-400 text-white shadow-lg shadow-red-400/50'
                                    : 'bg-gray-50 text-zinc-800'
                            }`}
                        >
                            <svg
                                className="w-5 h-5 mr-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                />
                            </svg>
                            Dashboard
                        </a>
                    </Link>
                    <Link href="/products">
                        <a
                            className={`font-lg my-5 rounded-full py-3 px-6 text-sm flex items-center ease-in-out duration-300 ${
                                current === 'products'
                                    ? 'bg-red-400 text-white shadow-lg shadow-red-400/50'
                                    : 'bg-gray-50 text-zinc-800'
                            }`}
                        >
                            <svg
                                className="w-5 h-5 mr-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            Productos
                        </a>
                    </Link>
                    <Link href="/profile">
                        <a
                            className={`font-lg my-5 rounded-full py-3 px-6 text-sm flex items-center ease-in-out duration-300 ${
                                current === 'profile'
                                    ? 'bg-red-400 text-white shadow-lg shadow-red-400/50'
                                    : 'bg-gray-50 text-zinc-800'
                            }`}
                        >
                            <svg
                                className="w-5 h-5 mr-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            Perfil
                        </a>
                    </Link>
                </div>
                <div className="flex justify-center">
                    <button
                        className=" bg-red-500 rounded-full py-6 px-6 w-fit flex items-center justify-center h-fit"
                        onClick={() => logout()}
                    >
                        <svg
                            className="w-6 h-6 stroke-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-full flex-1">
                <div className="flex flex-col flex-1 h-full w-full">
                    <div className="bg-white dark:bg-zinc-700 flex justify-between items-center py-4 px-6 w-full">
                        <div className="relative w-fit h-fit">
                            <input
                                className="rounded-full bg-zinc-100 text-zinc-400 w-60 py-3 pl-6 pr-12 outline-none text-xs"
                                placeholder="Busca un accesorio..."
                            />
                            <svg
                                className="stroke-zinc-400 w-4 h-4 absolute top-1/2 right-4 translate-y-[-50%]"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <ProfileAvatar />
                    </div>
                    <div className="relative py-10 px-8 h-full overflow-y-auto">{props.children}</div>
                </div>
            </div>
        </div>
    ) : (
        props.children
    );
}
