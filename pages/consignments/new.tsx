import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ProductsTable from '../../components/ProductsTable';
import Loading from '../../components/ui/Loading';
import TitleNav from '../../components/ui/Title';
import { AVAILABLE, CONSIGNMENT } from '../../utils/constants';
import { supabase } from '../../utils/supabaseClient';
import { Product, ProductType, Retailer } from '@prisma/client';
import { useSelect } from 'react-supabase';
import axios from 'axios';
import { Text } from '@nextui-org/react';

type ExtendedProduct = Product & { product_types: ProductType };
type ConsignmentForm = {
  productId: string;
  retailer: number;
};

export default function NewConsignment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);

  const [{ data: retailers }] = useSelect<Retailer>('retailers');

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm<ConsignmentForm>();

  async function getProductById(id: number) {
    try {
      setIsLoading(true);
      const { data } = await axios.get<ExtendedProduct>(`/api/products/${id}`);
      setProducts([data, ...products]);
      setValue('productId', '');
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  }

  const save = async () => {
    toast.promise(insertBulk(), {
      loading: 'Guardando...',
      success: <b>Se han creado los registros para la consignación</b>,
      error: <b>No se pudo guardar, inténtalo de nuevo</b>,
    });
  };

  const insertBulk = async () => {
    try {
      const { retailer } = getValues();
      const bulk = products.map((p) => ({
        retailer,
        product: p.id,
      }));
      const updateData = products.map(({ id, price, description, type, pandora, created_at }) => ({
        id,
        price,
        description,
        type,
        pandora,
        created_at,
        status: CONSIGNMENT,
      }));
      await supabase.from('consignments').insert(bulk);
      await supabase.from('products').upsert(updateData);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  };

  const addProduct = async ({ productId }: ConsignmentForm) => {
    if (products.find((p) => Number(p.id) === +productId)) {
      return;
    }
    toast.promise(getProductById(+productId), {
      loading: 'Buscando el producto...',
      success: <b>Se encontró un producto.</b>,
      error: <b>Producto no disponible.</b>,
    });
  };

  const onRemove = (id: number) => {
    setProducts(products.filter((p) => Number(p.id) !== id));
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Loading isLoading={isLoading} />
      <TitleNav title="Nueva Consignación" back={() => router.back()} showBack />
      <form onSubmit={handleSubmit(addProduct)} className="flex w-full gap-4">
        <select
          {...register('retailer')}
          className="form-select appearance-none block px-5 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none Sflex-1"
        >
          <option value="0">Selecciona una vendedora</option>
          {(retailers ?? []).map((r) => (
            <option value={Number(r.id)} key={Number(r.id)}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          className="w-full bg-gray-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
          placeholder="507"
          type="number"
          {...register('productId')}
        />
        <input
          className="font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400 cursor-pointer"
          disabled={isLoading || !isValid}
          type="submit"
          value="Agregar Producto"
        />
        <input
          className="font-bold bg-green-400 rounded-lg text-green-700 px-30 py-3 w-full hover:bg-green-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-green-400 cursor-pointer"
          disabled={isLoading || !isValid}
          type="submit"
          value="Guardar Consignación"
          onClick={save}
        />
      </form>
      <ProductsTable products={products} onRemove={onRemove} />
      <Text size={'$xs'} b className="ml-2">
        Cantidad de Productos: {products.length}
      </Text>
    </div>
  );
}
