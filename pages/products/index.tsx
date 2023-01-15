import moment from 'moment';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import ProductsTable from '../../components/ProductsTable';
import Loading from '../../components/ui/Loading';
import Select from '../../components/ui/Select';
import { useAuthSession } from '../../lib/hooks';
import { getPageCount, getYearsRange } from '../../utils/helpers';
import { supabase } from '../../utils/supabaseClient';
import { PRODUCT_STATUS, MONTHS, PAGE_OFFSET } from '../../utils/constants';
import { Product, ProductType } from '@prisma/client';
import ProductService from './ProductService';
import { Dropdown } from '@nextui-org/react';
import { Selection } from '@react-types/shared/src/selection';

export default function Products() {
  const [monthSelected, setMonthSelected] = useState(0);
  const [yearSelected, setYearSelected] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(0);
  const [typeSelected, setTypeSelected] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const { userMeta } = useAuthSession();

  const { data: productTypes = [], isLoading: typesLoading } =
    useSWR<ProductType[]>('/api/product-types');

  const { data: productsData, isLoading: productsLoading } = useSWR<{
    products: (Product & { product_types: ProductType })[];
    count: number;
  }>(
    {
      url: '/api/products',
      search,
      page: currentPage,
      month: monthSelected,
      year: yearSelected,
      type: typeSelected,
      status,
    },
    ProductService.getProducts,
  );

  const pageCount = getPageCount(productsData?.count ?? 0, PAGE_OFFSET);
  const { products } = productsData ?? { products: [] };

  useEffect(() => {
    const currentYear = moment().year();
    const range = getYearsRange(currentYear);
    setYears([...range]);
  }, []);

  function onMonthChange(keys: Selection) {
    const month = Object.values(keys)[0];
    setSearchText('');
    setMonthSelected(month);
    setCurrentPage(1);
  }

  function onYearChange(keys: Selection) {
    const year = Object.values(keys)[0];
    if (Number(year) === 0) {
      setMonthSelected(0);
    }
    setSearchText('');
    setYearSelected(year);
    setCurrentPage(1);
  }

  function onTypeChange(keys: Selection) {
    setSearchText('');
    setTypeSelected(Object.values(keys)[0]);
    setCurrentPage(1);
  }

  function onStatusChange(keys: Selection) {
    setSearchText('');
    setStatus(Object.values(keys)[0]);
    setCurrentPage(1);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      setSearch(searchText);
    }
  }

  return (
    <>
      <Loading isLoading={productsLoading} />
      <span className="text-2xl font-bold text-zinc-700 mb-6 flex justify-between items-center">
        Productos
        {Number(userMeta?.roles?.id) === 1 && (
          <Link href="/products/new" legacyBehavior>
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
          <div className="flex flex-col">
            <label className="text-xs ml-2 mb-1 text-red-700">Estado</label>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {PRODUCT_STATUS[status]}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([status])}
                onSelectionChange={onStatusChange}
              >
                {PRODUCT_STATUS.map((p, index) => (
                  <Dropdown.Item key={index}>{p}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="flex flex-col">
            <label className="text-xs ml-2 mb-1 text-red-700">Tipo</label>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {productTypes.find((p) => Number(p.id) === Number(typeSelected))?.type ?? 'Todos'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([typeSelected])}
                onSelectionChange={onTypeChange}
              >
                {[{ id: 0, type: 'Todos' }, ...productTypes].map((p, index) => (
                  <Dropdown.Item key={Number(p.id)}>{p.type}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex flex-col">
            <label className="text-xs ml-2 mb-1 text-red-700">Año</label>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {years.find((y) => y === Number(yearSelected)) ?? 'Todos'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([yearSelected])}
                onSelectionChange={onYearChange}
              >
                {[0, ...years].map((year) => (
                  <Dropdown.Item key={year}>{year ? year : 'Todos'}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex flex-col">
            <label className="text-xs ml-2 mb-1 text-red-700">Mes</label>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }}>
                {Number(monthSelected) ? MONTHS[monthSelected - 1] : 'Todos'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                disabledKeys={
                  Number(yearSelected) === 0 ? Array.from({ length: 12 }, (_, i) => i) : []
                }
                selectionMode="single"
                selectedKeys={new Set([monthSelected])}
                onSelectionChange={onMonthChange}
              >
                {(Number(yearSelected) === 0 ? [0] : [0, ...MONTHS]).map((month, index) => (
                  <Dropdown.Item key={index}>{index === 0 ? 'Todos' : month}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <ProductsTable products={products} />
      <div className="flex justify-end text-sm text-zinc-600">
        Total de resultados: {productsData?.count ?? 0}
      </div>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
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
            className={`w-4 h-4 ${
              currentPage === pageCount ? 'stroke-zinc-300' : 'stroke-zinc-700'
            }`}
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
