import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from '../../components/ui/Select';
import { MONTHS } from '../../utils/constants';
import { getPageCount, getPagination, getYearsRange } from '../../utils/helpers';
import { supabase } from '../../utils/supabaseClient';

export default function Sales() {
    const [isLoading, setIsLoading] = useState(false);
    const [monthSelected, setMonthSelected] = useState(moment().month() + 1);
    const [yearSelected, setYearSelected] = useState(moment().year());
    const [years, setYears] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const currentYear = moment().year();
        const range = getYearsRange(currentYear);
        setYears(range);
    }, []);

    useEffect(() => {
        getSales(monthSelected, yearSelected, currentPage);
    }, [currentPage, monthSelected, yearSelected]);

    function onMonthChange(month) {
        setMonthSelected(month);
    }

    function onYearChange(year) {
        setYearSelected(year);
    }

    async function getSales(month, year, page) {
        try {
            setIsLoading(true);
            const { from, to } = getPagination({ page });
            const {
                data: sales,
                error,
                count,
            } = await supabase
                .from('sales')
                .select(
                    `
                      id,
                      sale_price,
                      created_at,
                      note,
                      client,
                      products (
                        description,
                        id,
                        price
                      ),
                      profiles (
                        id,
                        first_name,
                        last_name,
                        avatar_url
                      )
                  `,
                    { count: 'exact' },
                )
                .gte('created_at', `${year}-${month}-01`)
                .lte('created_at', `${year}-${month}-${moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()}`)
                .range(from, to);
            setPageCount(getPageCount(count));
            setSales(sales ?? []);
        } catch (error) {
            console.log(error);
            toast.error('Ocurrio un error, recarga para intentar de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div
                className={`absolute bg-white/80 flex justify-center items-center inset-0 ease-in-out duration-300 pointer-events-none ${
                    isLoading ? 'opacity-1' : 'opacity-0'
                }`}
            >
                <Image src="/loading.svg" width={120} height={120} alt="loading-indicator" />
            </div>
            <span className="text-2xl font-bold text-zinc-700 mb-6 flex justify-between items-center">
                Ventas
                <Link href="/sales/new">
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
            <div className="w-full flex justify-between items-center">
                <div className="flex mt-2 justify-end">
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
                                currentPage === n
                                    ? 'bg-red-400 text-white shadow-lg shadow-red-400/50'
                                    : 'text-zinc-600'
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
                <div className="flex gap-2">
                    <Select label="Año" value={yearSelected} onChange={(year) => onYearChange(+year)}>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </Select>
                    <Select label="Mes" value={monthSelected} onChange={(mo) => onMonthChange(+mo)}>
                        {MONTHS.map((m, i) => (
                            <option key={i} value={i + 1}>
                                {m}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="flex flex-col mt-2">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden sm:rounded-lg">
                            <table className="min-w-full">
                                <thead className="bg-white border-b border-b-zinc-100 py-10">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Producto
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Descripción Producto
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Vendedor(a)
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Valor Producto
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Precio de Venta
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Cliente
                                        </th>
                                        <th scope="col" className="relative px-6 py-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {sales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-zinc-800">
                                                            {sale.products.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-800">{sale.products.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-800">
                                                    {sale.profiles.first_name} {sale.profiles.last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800">
                                                Q{sale.products.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800">
                                                Q{sale.sale_price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800">
                                                {sale.client}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-red-300 hover:text-red-400">
                                                    Editar
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
