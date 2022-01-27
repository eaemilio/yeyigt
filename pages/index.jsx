import { useEffect, useState } from 'react';
import ProductCard from '../components/dashboard/ProductCard';
import Loading from '../components/ui/Loading';
import { AVAILABLE } from '../utils/constants';
import { getTypeIcon } from '../utils/helpers';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
    const [activeType, setActiveType] = useState(0);
    const [productTypes, setProductTypes] = useState([{}, {}, {}, {}, {}, {}]);
    const [products, setProducts] = useState([]);
    const [isLoadingCount, setIsLoadingCount] = useState(true);

    useEffect(() => {
        setIsLoadingCount(true);
        Promise.all([getProductTypes(), getProducts()]).then().finally(setIsLoadingCount(false));
    }, []);

    async function getProductTypes() {
        const { data, error } = await supabase.from('product_types').select('*');
        setProductTypes(data);
    }

    async function getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select(
                `
            id,
            product_types (
                id,
                type
            ),
            description,
            price,
            created_at,
            status
        `,
            )
            .eq('status', AVAILABLE);
        setProducts(data);
    }

    function getTypeCount(id) {
        return products.filter((p) => p.product_types.id === id).length;
    }

    return (
        <div className="flex flex-col flex-1 h-full w-full">
            <span className="font-bold text-xl text-zinc-700 mb-4">Resumen</span>
            <div className="flex w-full gap-2 relative">
                <Loading isLoading={isLoadingCount} className="rounded-2xl" />
                {productTypes.map((t, i) => (
                    <ProductCard
                        key={i}
                        Icon={getTypeIcon(t.id)}
                        count={getTypeCount(t.id) ?? 'Loading...'}
                        title={`${t.type}` ?? 'Loading...'}
                        onClick={() => setActiveType(t.id)}
                        active={activeType === t.id}
                    />
                ))}
            </div>
        </div>
    );
}
