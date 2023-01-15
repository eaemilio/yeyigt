import { Product, ProductType } from '@prisma/client';
import { useEffect, useState } from 'react';
import ProductCard from '../components/dashboard/ProductCard';
import Loading from '../components/ui/Loading';
import { AVAILABLE } from '../utils/constants';
import { getTypeIcon } from '../utils/helpers';
import useSWR from 'swr';

export default function Home() {
    const [activeType, setActiveType] = useState(0);

    const { data: products = [], isLoading: productsLoading } = useSWR<(Product & { product_types: ProductType })[]>(`api/products?status=${AVAILABLE}`);
    const { data: productTypes = [], isLoading: typesLoading } = useSWR<ProductType[]>('api/product-types');

    function getTypeCount(id: number) {
        return products.filter((p) => Number(p.product_types.id) === id).length;
    }

    return (
        <div className="flex flex-col flex-1 h-full w-full">
            <span className="font-bold text-xl text-zinc-700 mb-4">Resumen</span>
            <div className="flex w-full gap-2 relative">
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
