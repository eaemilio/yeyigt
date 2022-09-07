import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProductsTable from '../../components/ProductsTable';
import Loading from '../../components/ui/Loading';
import Select from '../../components/ui/Select';
import { useAuthSession } from '../../lib/hooks';
import { MONTHS, PRODUCT_STATUS } from '../../utils/constants';
import { getPageCount, getPagination, getYearsRange } from '../../utils/helpers';
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
  const [status, setStatus] = useState(3);
  const [typeSelected, setTypeSelected] = useState(0);
  const [searchText, setSearchText] = useState('');
  const { userMeta } = useAuthSession();

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
      statusSelected: status,
    });
  }, [currentPage, monthSelected, yearSelected, typeSelected, productTypes, status]);

  async function getProductTypes() {
    const { data: productTypes, error } = await supabase.from('product_types').select('*');
    setProductTypes(productTypes);
  }

  async function getProducts({ month, year, page, type, types, search, statusSelected }) {
    try {
      setIsLoading(true);
      const { from, to } = getPagination({ page });
      const typeFilter = type === 0 ? [...types.map((p) => p.id)] : [type];
      const statusFilter =
        statusSelected === PRODUCT_STATUS.length - 1 ? [...PRODUCT_STATUS.map((_, index) => index)] : [status];
      console.log(statusFilter);
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
        .or(`description.ilike.%${search ?? ''}%${search.trim() !== '' && !isNaN(search) ? `,id.eq.${search}` : ''}`)
        .in('type', typeFilter)
        .in('status', statusFilter)
        .gte('created_at', `${year}-${month === 0 ? '01' : month}-01`)
        .lte(
          'created_at',
          `${year}-${month === 0 ? '12' : month}-${moment(
            `${year}-${month === 0 ? '12' : month}`,
            'YYYY-MM',
          ).daysInMonth()}`,
        )
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
    setCurrentPage(1);
  }

  function onYearChange(year) {
    setSearchText('');
    setYearSelected(year);
    setCurrentPage(1);
  }

  function onTypeChange(type) {
    setSearchText('');
    setTypeSelected(type);
    setCurrentPage(1);
  }

  function onStatusChange(_status) {
    setSearchText('');
    setStatus(+_status);
    setCurrentPage(1);
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
      <Loading isLoading={isLoading} />
      <span className="text-2xl font-bold text-zinc-700 mb-6 flex justify-between items-center">
        Productos
        {userMeta?.roles?.id === 1 && (
          <Link href="/products/new">
            <a className="bg-red-400 rounded-full text-white p-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </a>
          </Link>
        )}
      </span>
      <div className="w-full flex-col sm:flex-row flex justify-between items-center">
        <div className="mb-6 sm:mb-0 relative w-full sm:w-fit h-fit shadow-lg shadow-zinc-400/10 rounded-full">
          <input
            className="rounded-full bg-white b text-zinc-400 w-full sm:w-60 py-3 pl-6 pr-12 outline-none text-xs"
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
        <div className="flex gap-2 w-full sm:w-fit">
          <Select label="Estado" value={status} onChange={(s) => onStatusChange(s)} className="flex-1">
            {PRODUCT_STATUS.map((p, index) => (
              <option key={index} value={index}>
                {p}
              </option>
            ))}
          </Select>
          <Select label="Tipo" value={typeSelected} onChange={(type) => onTypeChange(+type)} className="flex-1">
            <option value={0}>Todos</option>
            {productTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.type}
              </option>
            ))}
          </Select>
          <Select label="Año" value={yearSelected} onChange={(year) => onYearChange(+year)} className="flex-1">
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
          <Select label="Mes" value={monthSelected} onChange={(mo) => onMonthChange(+mo)} className="flex-1">
            <option value={0}>Todos</option>
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <ProductsTable products={products} />
      <div className="flex mt-4 justify-end flex-wrap">
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
