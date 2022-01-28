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
                      retailers (
                        id,
                        name
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
                            <div className="flex items-center justify-center">
                                <div className="container">
                                    <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg sm:shadow-zinc-100/10 my-5">
                                        <thead className="sm:bg-white border-b border-b-zinc-100">
                                            {sales.map((sale) => (
                                                <tr
                                                    key={sale.id}
                                                    className="bg-white flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
                                                >
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Producto
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Descripción Producto
                                                    </th>
                                                    <th className="h-20 sm:h-fit p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Vendedor(a)
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Valor Producto
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Precio de Venta
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                                                        Cliente
                                                    </th>
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="flex-1 sm:flex-none">
                                            {sales.map((sale) => (
                                                <tr
                                                    key={sale.id}
                                                    className="rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                                                >
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {sale.products.id}
                                                    </td>
                                                    <td className="h-20 sm:h-fit bg-white p-4 text-sm text-zinc-800">
                                                        {sale.products.description}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {sale.retailers.name}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800 text-ellipsis overflow-hidden break-all">
                                                        Q{sale.products.price.toFixed(2)}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        Q{sale.sale_price.toFixed(2)}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {sale.client}
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
