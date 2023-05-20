import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useFilter, useSelect } from 'react-supabase';
import { MONTHS } from '../utils/constants';
import { getPageCount, getPagination, getYearsRange } from '../utils/helpers';
import Select from './ui/Select';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Collapse, Dropdown, Text } from '@nextui-org/react';
import { Product, Retailer, Sale } from '@prisma/client';
import { Selection } from '@react-types/shared/src/selection';

export default function SalesTable({
  setIsLoading,
  tableTitle,
  retailer,
  yearPreSelected,
  monthPreselected,
}) {
  const [monthSelected, setMonthSelected] = useState(moment().month() + 1);
  const [yearSelected, setYearSelected] = useState(moment().year());
  const [years, setYears] = useState<number[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { isMobile } = useDeviceDetect();

  const filter = useFilter(
    (query) => {
      if (retailer) {
        query.eq('retailer.id', retailer.id);
      }
      const { from, to } = getPagination({ page: currentPage });
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
  const [{ count, data: sales = [], fetching }] = useSelect<
    Sale & { products: Product; retailer: Retailer }
  >('sales', {
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
    if (count !== undefined) {
      setPageCount(getPageCount(count ?? 0));
    }
  }, [count]);

  useEffect(() => {
    const currentYear = moment().year();
    const range = getYearsRange(currentYear);
    setYears(range);
  }, []);

  function onMonthChange(keys: Selection) {
    const month = Object.values(keys)[0];
    setMonthSelected(month);
  }

  function onYearChange(keys: Selection) {
    const year = Object.values(keys)[0];
    setYearSelected(year);
  }

  return (
    <div>
      <div className="w-full flex justify-between items-center">
        <span className="text-xl font-bold text-zinc-700">{tableTitle}</span>
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="text-xs ml-2 mb-1 text-zinc-900">Año</label>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }} color="secondary">
                {years.find((y) => y === Number(yearSelected)) ?? 'Todos'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                color="secondary"
                selectionMode="single"
                selectedKeys={new Set([yearSelected])}
                onSelectionChange={onYearChange}
              >
                {years.map((year) => (
                  <Dropdown.Item key={year}>{year}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex flex-col">
            <label className="text-xs ml-2 mb-1 text-zinc-900">Mes</label>
            <Dropdown>
              <Dropdown.Button flat css={{ tt: 'capitalize' }} color="secondary">
                {Number(monthSelected) ? MONTHS[monthSelected - 1] : 'Todos'}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                disabledKeys={
                  Number(yearSelected) === 0 ? Array.from({ length: 12 }, (_, i) => i) : []
                }
                color="secondary"
                selectionMode="single"
                selectedKeys={new Set([monthSelected])}
                onSelectionChange={onMonthChange}
              >
                {MONTHS.map((month, index) => (
                  <Dropdown.Item key={index + 1}>{month}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-lg">
              <div className="flex items-center justify-center">
                <div className="container">
                  {!isMobile && (
                    <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg sm:shadow-zinc-100/10 my-5">
                      <thead className="sm:bg-white border-b border-b-zinc-100">
                        {(sales ?? []).map((sale) => (
                          <tr
                            key={Number(sale.id)}
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
                        {(sales ?? []).map((sale) => (
                          <tr
                            key={Number(sale.id)}
                            className="rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                          >
                            <td className="bg-white p-4 text-sm text-zinc-800">
                              {Number(sale.products.id)}
                            </td>
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
                              Q{sale.sale_price?.toFixed(2)}
                            </td>
                            <td className="bg-white p-4 text-sm text-zinc-800">{sale.client}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {isMobile && (
                    <Collapse.Group className="my-2">
                      {sales &&
                        sales.map((sale) => (
                          <Collapse
                            key={Number(sale.id)}
                            title={<Text h6>{`#${sale.products.id}`}</Text>}
                            subtitle={sale.products.description}
                          >
                            <div className="px-6">
                              <div className="flex justify-between items-center">
                                <Text weight="bold">Vendedora</Text>
                                <Text>{sale.retailer.name ?? ''}</Text>
                              </div>
                              <div className="flex justify-between items-center">
                                <Text weight="bold">Cliente</Text>
                                <Text>{sale.client}</Text>
                              </div>
                              <div className="flex justify-between items-center">
                                <Text weight="bold">Valor de Producto</Text>
                                <Text>Q{sale.products.price.toFixed(2)}</Text>
                              </div>
                              <div className="flex justify-between items-center">
                                <Text weight="bold">Precio de Venta</Text>
                                <Text>Q{sale.sale_price?.toFixed(2)}</Text>
                              </div>
                            </div>
                          </Collapse>
                        ))}
                    </Collapse.Group>
                  )}
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
