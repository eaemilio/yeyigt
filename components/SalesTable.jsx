import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useFilter, useSelect } from 'react-supabase';
import { MONTHS } from '../utils/constants';
import { getPageCount, getPagination, getYearsRange } from '../utils/helpers';
import Select from './ui/Select';

export default function SalesTable({
  setIsLoading,
  tableTitle,
  retailer,
  yearPreSelected,
  monthPreselected,
}) {
  const [monthSelected, setMonthSelected] = useState(moment().month() + 1);
  const [yearSelected, setYearSelected] = useState(moment().year());
  const [years, setYears] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const filter = useFilter(
    (query) => {
      if (retailer) {
        query.eq('retailer.id', retailer.id);
      }
      const { from, to } = getPagination({ currentPage });
      query
        .gte('created_at', `${yearSelected}-${monthSelected}-01`)
        .lte(
          'created_at',
          `${yearSelected}-${monthSelected}-${moment(
            `${yearSelected}-${monthSelected}`,
            'YYYY-MM',
          ).daysInMonth()}T23:59:59.9999Z`,
        )
        .range(from, to);
      return query;
    },
    [retailer, yearSelected, monthSelected, currentPage],
  );
  const [{ count, data: sales = [], fetching }] = useSelect('sales', {
    columns: `
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
      retailer!inner(*)
    `,
    filter,
    options: {
      count: 'exact',
      head: false,
    },
    pause: false,
  });

  useEffect(() => {
    setIsLoading(fetching);
  }, [fetching]);

  useEffect(() => {
    if (yearPreSelected) {
      setYearSelected(yearPreSelected);
    }
  }, [yearPreSelected]);
  useEffect(() => {
    if (monthPreselected) {
      setMonthSelected(monthPreselected);
    }
  }, [monthPreselected]);

  useEffect(() => {
    setPageCount(getPageCount(count));
  }, [count]);

  useEffect(() => {
    const currentYear = moment().year();
    const range = getYearsRange(currentYear);
    setYears(range);
  }, []);

  useEffect(() => {
    // getSales(monthSelected, yearSelected, currentPage, retailer?.id);
  }, [currentPage, monthSelected, yearSelected, retailer]);

  function onMonthChange(month) {
    setMonthSelected(month);
  }

  function onYearChange(year) {
    setYearSelected(year);
  }

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <span className="text-xl font-bold text-zinc-700">{tableTitle}</span>
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
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-col">
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
                          <td className="bg-white p-4 text-sm text-zinc-800">{sale.products.id}</td>
                          <td className="h-20 sm:h-fit bg-white p-4 text-sm text-zinc-800">
                            {sale.products.description}
                          </td>
                          <td className="bg-white p-4 text-sm text-zinc-800">
                            {sale.retailer?.name}
                          </td>
                          <td className="bg-white p-4 text-sm text-zinc-800 text-ellipsis overflow-hidden break-all">
                            Q{sale.products.price.toFixed(2)}
                          </td>
                          <td className="bg-white p-4 text-sm text-zinc-800">
                            Q{sale.sale_price.toFixed(2)}
                          </td>
                          <td className="bg-white p-4 text-sm text-zinc-800">{sale.client}</td>
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
          type="button"
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
            type="button"
          >
            {n}
          </button>
        ))}
        <button
          className="ml-4 cursor-pointer rounded-full w-6 h-6 text-xs flex justify-center items-center"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
          type="button"
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
    </div>
  );
}
