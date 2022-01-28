import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '../../components/ui/Loading';
import { supabase } from '../../utils/supabaseClient';

export default function Retailers() {
    const [retailers, setRetailers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const router = useRouter();

    useEffect(() => {
        getRetailers('');
    }, []);

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            getRetailers(searchText);
        }
    }

    async function getRetailers(search) {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.from('retailers').select('*').or(`name.ilike.%${search}%`);
            setRetailers(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Loading isLoading={isLoading} />
            <span className="text-2xl font-bold text-zinc-700 mb-6 flex justify-between items-center">
                Vendedoras
                <Link href="/retailers/new">
                    <a className="bg-red-400 rounded-full text-white p-4">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </a>
                </Link>
            </span>
            <div className="w-full flex-col sm:flex-row flex justify-between items-center">
                <div className="mb-6 sm:mb-0 relative w-full sm:w-fit h-fit shadow-lg shadow-zinc-400/10 rounded-full">
                    <input
                        className="rounded-full bg-white b text-zinc-400 w-full sm:w-60 py-3 pl-6 pr-12 outline-none text-xs"
                        placeholder="Busca una vendedora..."
                        onKeyDown={handleKeyDown}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
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
            </div>
            <div className="flex flex-col mt-2">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden sm:rounded-lg">
                            <div className="flex items-center justify-center">
                                <div className="container">
                                    <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg sm:shadow-zinc-100/10 my-5">
                                        <thead className="sm:bg-white border-b border-b-zinc-100">
                                            {retailers.map((retailer) => (
                                                <tr
                                                    key={retailer.id}
                                                    className="bg-white flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
                                                >
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        ID
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th className="h-20 sm:h-fit p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Fecha de Corte
                                                    </th>
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="flex-1 sm:flex-none">
                                            {retailers.map((retailer) => (
                                                <tr
                                                    key={retailer.id}
                                                    className="cursor-pointer rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                                                    onClick={() => {
                                                        router.push(`retailers/${retailer.id}`);
                                                    }}
                                                >
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {retailer.id}
                                                    </td>
                                                    <td className="h-20 sm:h-fit bg-white p-4 text-sm text-zinc-800">
                                                        {retailer.name}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {retailer.due_date}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex mt-4 justify-end">
                <button
                    className="mr-4 cursor-pointer rounded-full w-6 h-6 text-xs flex justify-center items-center"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <svg
                        className={`w-4 h-4 ${currentPage === 1 ? 'stroke-zinc-300' : 'stroke-zinc-700'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        className={`cursor-pointer rounded-full w-6 h-6 text-xs flex justify-center items-center ${
                            currentPage === n ? 'bg-red-400 text-white shadow-lg shadow-red-400/50' : 'text-zinc-600'
                        }`}
                        onClick={() => setCurrentPage(n)}
                    >
                        {n}
                    </button>
                ))}
                <button
                    className="ml-4 cursor-pointer rounded-full w-6 h-6 text-xs flex justify-center items-center"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                >
                    <svg
                        className={`w-4 h-4 ${currentPage === pageCount ? 'stroke-zinc-300' : 'stroke-zinc-700'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </>
    );
}
