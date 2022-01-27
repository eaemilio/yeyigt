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
    const [productTypes, setProductTypes] = useState([]);
    const [typeSelected, setTypeSelected] = useState(0);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const currentYear = moment().year();
        const range = getYearsRange(currentYear);
        setYears(range);
        getProductTypes();
    }, []);

    useEffect(() => {
        getProducts({
            month: monthSelected,
            year: yearSelected,
            page: currentPage,
            type: typeSelected,
            types: productTypes,
            search: '',
        });
    }, [currentPage, monthSelected, yearSelected, typeSelected, productTypes]);

    async function getProductTypes() {
        const { data: productTypes, error } = await supabase.from('product_types').select('*');
        setProductTypes(productTypes);
    }

    async function getProducts({ month, year, page, type, types, search }) {
        try {
            setIsLoading(true);
            const { from, to } = getPagination({ page });
            const typeFilter = type === 0 ? [...types.map((p) => p.id)] : [type];
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
                  type,
                  description,
                  price,
                  created_at,
                  status
              `,
                    { count: 'exact' },
                )
                .filter('id', `${search.trim() === '' ? 'not.eq' : 'eq'}`, `${search.trim() === '' ? '0' : search}`)
                .in('type', typeFilter)
                .gte('created_at', `${year}-${month}-01`)
                .lte('created_at', `${year}-${month}-${moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()}`)
                .order('id', { ascending: true })
                .range(from, to);
            setPageCount(getPageCount(count));
            setProducts(products ?? []);
        } catch (error) {
            toast.error('Ocurrió un error, recarga para intentar de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }

    function onMonthChange(month) {
        setSearchText('');
        setMonthSelected(month);
    }

    function onYearChange(year) {
        setSearchText('');
        setYearSelected(year);
    }

    function onTypeChange(type) {
        setSearchText('');
        setTypeSelected(type);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            getProducts({
                month: monthSelected,
                year: yearSelected,
                page: currentPage,
                type: typeSelected,
                types: productTypes,
                search: searchText,
            });
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
            <div className="w-full flex-col sm:flex-row flex justify-between items-center">
                <div className="mb-6 sm:mb-0 relative w-fit h-fit shadow-lg shadow-zinc-400/10 rounded-full">
                    <input
                        className="rounded-full bg-white b text-zinc-400 w-60 py-3 pl-6 pr-12 outline-none text-xs"
                        placeholder="Busca un accesorio..."
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
                <div className="flex gap-2">
                    <Select label="Tipo" value={typeSelected} onChange={(type) => onTypeChange(+type)}>
                        <option value={0}>Todos</option>
                        {productTypes.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.type}
                            </option>
                        ))}
                    </Select>
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
                                            {products.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="bg-white flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
                                                >
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Código
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tipo
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Descripción
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Precio
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha Agregado
                                                    </th>
                                                    <th className="p-4 sm:px-6 sm:py-4 text-left text-sm sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody className="flex-1 sm:flex-none">
                                            {products.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                                                >
                                                    <td className="bg-white p-4 text-sm text-zinc-800">{product.id}</td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {product.product_types?.type ?? ''}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {product.description}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        Q{product.price.toFixed(2)}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
                                                        {formatDate(product.created_at)}
                                                    </td>
                                                    <td className="bg-white p-4 text-sm text-zinc-800">
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
