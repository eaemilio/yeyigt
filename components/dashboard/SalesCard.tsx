import { Icon } from '@iconify/react';
import { Sale } from '@prisma/client';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { numberWithCommas } from '../../utils/helpers';

type SalesData = {
  sales: Sale[];
  count: number;
};

type Props = {
  lastMonth: SalesData;
  currentMonth: SalesData;
  count?: boolean;
};

export default function SalesCard({ lastMonth, currentMonth, count = false }: Props) {
  const currentTotal = useMemo(
    () =>
      count
        ? currentMonth.count
        : currentMonth.sales?.reduce((sum, current) => sum + (current.sale_price ?? 0), 0),
    [currentMonth],
  );

  const lastTotal = useMemo(
    () =>
      count
        ? lastMonth.count
        : lastMonth.sales?.reduce((sum, current) => sum + (current.sale_price ?? 0), 0),
    [lastMonth],
  );

  return (
    <div className="shadow-md ease-in-out duration-300 py-6 px-8 rounded-lg flex flex-col justify-between items-start bg-white">
      <p className="text-xs font-bold tracking-wide">
        {count ? 'Productos Vendidos' : 'Ventas este mes'}
      </p>
      <p className="text-4xl font-bold mt-6">
        {count ? '' : 'Q'} {numberWithCommas(currentTotal)}
      </p>
      <p className="flex justify-center items-center mt-6">
        {currentTotal !== 0 && (
          <span
            className={`px-2 inline-flex text-xs gap-1 leading-0 tracking-normal sm:leading-5 font-semibold rounded-full flex justify-center items-center ${
              currentTotal > lastTotal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <Icon
              icon={
                currentTotal > lastTotal
                  ? 'material-symbols:trending-up-rounded'
                  : 'material-symbols:trending-down-rounded'
              }
              fontSize={16}
            />{' '}
            {(((currentTotal - lastTotal) / lastTotal) * 100).toFixed(0)}%
          </span>
        )}
        {currentTotal !== 0 && (
          <span className="ml-1 text-xs tracking-normal">
            vs último mes ({count ? '' : 'Q'}
            {numberWithCommas(lastTotal)})
          </span>
        )}
      </p>
    </div>
  );
}
