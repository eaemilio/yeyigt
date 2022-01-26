import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import ProfileAvatar from '../ProfileAvatar';
import { useRouter } from 'next/router';
import { SessionContext } from '../../lib/context';
import { supabase } from '../../utils/supabaseClient';
import { AVAILABLE } from '../../utils/constants';
import { useAuthSession } from '../../lib/hooks';

export default function Dashboard(props) {
    const { pathname } = useRouter();
    const [current, setCurrent] = useState('');
    const [productCount, setProductCount] = useState(0);
    const [isSignedIn, setIsSignedIn] = useState(true);
    const { session } = useContext(SessionContext);
    const { userMeta } = useAuthSession();

    useEffect(() => {
        setIsSignedIn(!!session.access_token);
        setCurrent(pathname.split('/')[1]);
        getProductsCount();
        supabase
            .from('products')
            .on('*', () => {
                getProductsCount();
            })
            .subscribe();
    }, [session, pathname]);

    async function getProductsCount() {
        const { count } = await supabase.from('products').select('id', { count: 'exact' }).eq('status', AVAILABLE);
        setProductCount(count);
    }

    function logout() {
        supabase.auth.signOut();
    }

    return isSignedIn ? (
        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex">
            <div className="h-full w-1/4 max-w-xs min-w-fit border bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 py-24 px-6 hidden flex-col justify-between md:flex">
                <div>
                    {userMeta?.roles?.id === 1 && (
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
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                Dashboard
                            </a>
                        </Link>
                    )}
                    <Link href="/products">
                        <a
                            className={`relative font-lg my-5 rounded-full py-3 px-6 text-sm flex items-center ease-in-out duration-300 ${
                                current === 'products'
                                    ? 'bg-red-400 text-white shadow-lg shadow-red-400/50'
                                    : 'bg-gray-50 text-zinc-800'
                            }`}
                        >
                            <svg
                                className="w-5 h-5 mr-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Productos
                            <div
                                className={`flex w-6 h-6 text-xs items-center justify-center rounded-full absolute right-8 top-50 ${
                                    current === 'products' ? 'bg-white text-red-400' : 'bg-red-400 text-white'
                                }`}
                            >
                                {productCount}
                            </div>
                        </a>
                    </Link>
                    {userMeta?.roles?.id === 1 && (
                        <Link href="/sales">
                            <a
                                className={`font-lg my-5 rounded-full py-3 px-6 text-sm flex items-center ease-in-out duration-300 ${
                                    current === 'sales'
                                        ? 'bg-red-400 text-white shadow-lg shadow-red-400/50'
                                        : 'bg-gray-50 text-zinc-800'
                                }`}
                            >
                                <svg
                                    className="w-5 h-5 mr-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Ventas
                            </a>
                        </Link>
                    )}
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
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
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
