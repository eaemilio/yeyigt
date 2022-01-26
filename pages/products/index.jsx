import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from '../../components/ui/Select';
import { AVAILABLE, DEFAULT_PAGE_SIZE, MONTHS, PRODUCT_STATUS } from '../../utils/constants';
import { formatDate, getPageCount, getPagination, getYearsRange } from '../../utils/helpers';
import { supabase } from '../../utils/supabaseClient';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [monthSelected, setMonthSelected] = useState(moment().month() + 1);
    const [yearSelected, setYearSelected] = useState(moment().year());
    const [years, setYears] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const currentYear = moment().year();
        const range = getYearsRange(currentYear);
        setYears(range);
    }, []);

    useEffect(() => {
        getProducts(monthSelected, yearSelected, currentPage);
    }, [currentPage, monthSelected, yearSelected]);

    async function getProducts(month, year, page) {
        try {
            setIsLoading(true);
            const { from, to } = getPagination({ page });
            const {
                data: products,
                error,
                count,
            } = await supabase
                .from('products')
                .select(
                    `
                  id,
                  product_types (
                    type
                  ),
                  description,
                  price,
                  created_at,
                  status
              `,
                    { count: 'exact' },
                )
                .gte('created_at', `${year}-${month}-01`)
                .lte('created_at', `${year}-${month}-${moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()}`)
                .range(from, to);
            setPageCount(getPageCount(count));
            setProducts(products ?? []);
        } catch (error) {
            toast.error('Ocurrio un error, recarga para intentar de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }

    function onMonthChange(month) {
        setMonthSelected(month);
        getProducts(month, yearSelected);
    }

    function onYearChange(year) {
        setYearSelected(year);
        getProducts(monthSelected, year);
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
                Productos
                <Link href="/products/new">
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
                                            Código
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Tipo
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Descripción
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Precio
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Fecha Agregado
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Estado
                                        </th>
                                        <th scope="col" className="relative px-6 py-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-zinc-800">
                                                            {product.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-800">
                                                    {product.product_types.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-800">{product.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800">
                                                Q{product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800">
                                                {formatDate(product.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-800">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        product.status === AVAILABLE
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {PRODUCT_STATUS[product.status]}
                                                </span>
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
