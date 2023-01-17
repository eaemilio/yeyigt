import { Product, ProductType, Sale } from '@prisma/client';
import { useEffect, useState } from 'react';
import ProductCard from '../components/dashboard/ProductCard';
import Loading from '../components/ui/Loading';
import { AVAILABLE } from '../utils/constants';
import { getTypeIcon } from '../utils/helpers';
import useSWR from 'swr';
import dayjs from 'dayjs';
import SalesCard from '../components/dashboard/SalesCard';
import { Card } from '@nextui-org/react';
import { useAuthSession } from '../lib/hooks';

export default function Home() {
  const { userMeta } = useAuthSession();
  const [activeType, setActiveType] = useState(0);

  const { data: productsData, isLoading: productsLoading } = useSWR<{
    products: (Product & { product_types: ProductType })[];
    count: number;
  }>(`api/products?status=${AVAILABLE}`);
  const { data: productTypes = [], isLoading: typesLoading } =
    useSWR<ProductType[]>('api/product-types');

  const currentDate = dayjs(`${dayjs().month() + 1}-${dayjs().date()}-${dayjs().year()}`);
  const lastDate = currentDate.add(-1, 'month');

  const { data: currentMonthSales, isLoading: currentSalesLoading } = useSWR<{
    sales: Sale[];
    count: number;
  }>(`api/sales?date=${currentDate.format('MM-DD-YYYY')}`);

  const { data: lastMonthSales, isLoading: lastSalesLoading } = useSWR<{
    sales: Sale[];
    count: number;
  }>(`api/sales?date=${lastDate.format('MM-DD-YYYY')}`);

  function getTypeCount(id: number) {
    return productsData?.products.filter((p) => Number(p.product_types.id) === id).length;
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full container md:max-w-3xl mx-auto">
      <div className="w-full gap-2 relative mt-4 flex h-min-content mb-6">
        <div className="flex-1">
          {lastMonthSales && currentMonthSales && (
            <SalesCard lastMonth={lastMonthSales} currentMonth={currentMonthSales}></SalesCard>
          )}
        </div>
        <div className="flex-1">
          {lastMonthSales && currentMonthSales && (
            <SalesCard
              lastMonth={lastMonthSales}
              currentMonth={currentMonthSales}
              count
            ></SalesCard>
          )}
        </div>
      </div>
      <Card.Divider></Card.Divider>
      <div className="mt-6 grid w-full gap-2 relative grid-cols-1 sm:grid-cols-3">
        <Loading isLoading={productsLoading || typesLoading} className="rounded-2xl" />
        {productTypes.map((t, i) => (
          <ProductCard
            key={i}
            Icon={getTypeIcon(Number(t.id))}
            count={getTypeCount(Number(t.id)) ?? 'Loading...'}
            title={`${t.type}` ?? 'Loading...'}
            onClick={() => setActiveType(Number(t.id))}
            active={activeType === Number(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
