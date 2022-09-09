import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/ui/Loading';
import Select from '../../components/ui/Select';
import { AVAILABLE } from '../../utils/constants';
import { getPageCount, getPagination } from '../../utils/helpers';
import { supabase } from '../../utils/supabaseClient';

export default function Consignments() {
  const [isLoading, setIsLoading] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [retailers, setRetailers] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(0);

  useEffect(() => {
    getRetailers();
  }, []);

  useEffect(() => {
    getConsignments(currentPage, selectedRetailer, retailers);
  }, [currentPage, selectedRetailer, retailers]);

  async function getRetailers() {
    const { data } = await supabase.from('retailers').select('*');
    setRetailers(data);
  }

  const returnProduct = async ({ product, id }) => {
    try {
      setIsLoading(true);
      await supabase.from('products').update({ status: AVAILABLE }).match({ id: product.id });
      await supabase.from('consignments').update({ active: false }).match({ id });
      await getConsignments(currentPage, selectedRetailer, retailers);
    } catch (error) {
      toast.error('Ocurrió un error');
    } finally {
      setIsLoading(false);
    }
  };

  async function getConsignments(page, retailer, _retailers) {
    try {
      setIsLoading(true);
      const retailerFilter = retailer === 0 ? [..._retailers.map((r) => r.id)] : [retailer];
      const { from, to } = getPagination({ page });
      const { data, count } = await supabase
        .from('consignments')
        .select(
          `
                id,
                retailer,
                product (
                    description,
                    id
                ),
                retailers (
                    name,
                    id
                ),
                active
            `,
          { count: 'exact' },
        )
        .in('retailer', retailerFilter)
        .eq('active', true)
        .range(from, to);
      setPageCount(getPageCount(count));
      setConsignments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function onRetailerChange(id) {
    setCurrentPage(1);
    setSelectedRetailer(id);
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <span className="text-2xl font-bold text-zinc-700 mb-6 flex justify-between items-center">
        Mercadería en consignación
        <Link href="/consignments/new">
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
      <div className="flex gap-2 w-full sm:w-fit">
        <Select
          label="Vendedor"
          value={selectedRetailer}
          onChange={(retailer) => onRetailerChange(+retailer)}
          className="flex-1"
        >
          <option value={0}>Todos</option>
          {retailers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col mt-2">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg">
              <div className="flex items-center justify-center">
                <div className="container">
                  <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg sm:shadow-zinc-100/10 my-5">
                    <thead className="sm:bg-white border-b border-b-zinc-100">
                      {consignments.map((consignment) => (
                        <tr
                          key={consignment.id}
                          className="bg-white flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
                        >
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Código de producto
                          </th>
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Producto
                          </th>
                          <th className="h-20 sm:h-fit p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Vendedora
                          </th>
                          <th className="h-20 sm:h-fit p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider" />
                        </tr>
                      ))}
                    </thead>
                    <tbody className="flex-1 sm:flex-none">
                      {consignments.map((consignment) => (
                        <tr
                          key={consignment.id}
                          className="cursor-pointer rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                        >
                          <td className="bg-white p-4 text-sm text-zinc-800">
                            {consignment.product?.id}
                          </td>
                          <td className="bg-white p-4 text-sm text-zinc-800">
                            {consignment.product?.description}
                          </td>
                          <td className="h-20 sm:h-fit bg-white p-4 text-sm text-zinc-800">
                            {consignment.retailers?.name}
                          </td>
                          <td className="h-20 px-10 sm:h-fit bg-white p-4 text-sm text-zinc-800">
                            <button
                              className="font-bold bg-red-200 rounded-lg text-red-400 py-2 w-full hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
                              type="button"
                              onClick={() => returnProduct(consignment)}
                            >
                              Devolver
                            </button>
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
