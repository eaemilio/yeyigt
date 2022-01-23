import Link from 'next/link';
import React, { useEffect } from 'react';
import ProfileAvatar from '../ProfileAvatar';
import { useRouter } from 'next/router';

export default function Dashboard(props) {
    const { pathname } = useRouter();
    const current = pathname.split('/')[1];
    return (
        <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex">
            <div className="h-full w-1/4 max-w-xs min-w-fit border bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700 py-24 px-6 flex flex-col">
                <Link href="/">
                    <a
                        className={`font-lg my-3 rounded-3xl py-3 px-6 text-sm flex items-center ${
                            current === '' ? 'bg-red-400 text-white' : 'bg-gray-50 text-zinc-800'
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
                        className={`font-lg my-3 rounded-3xl py-3 px-6 text-sm flex items-center ${
                            current === 'products' ? 'bg-red-400 text-white' : 'bg-gray-50 text-zinc-800'
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
                        className={`font-lg my-3 rounded-3xl py-3 px-6 text-sm flex items-center ${
                            current === 'profile' ? 'bg-red-400 text-white' : 'bg-gray-50 text-zinc-800'
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
            <div className="h-full flex-1">
                <div className="flex flex-col w-full">
                    <div className="bg-white dark:bg-zinc-700 flex justify-between items-center py-5 px-6 w-full">
                        <span></span>
                        <ProfileAvatar />
                    </div>
                    <div className="py-10 px-8">{props.children}</div>
                </div>
            </div>
        </div>
    );
}
