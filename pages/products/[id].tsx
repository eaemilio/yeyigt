import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import useSWR from 'swr';
import { Product, ProductType, Sale, Consignment, Retailer } from '@prisma/client';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AVAILABLE, PRODUCT_STATUS } from '../../utils/constants';
import { Button, Card, Divider, Dropdown, Row, Text } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import { Selection } from '@react-types/shared/src/selection';
import Loading from '../../components/ui/Loading';
import ImagePicker from '../../components/ui/ImagePicker';
import ProductImages from '../../components/products/ProductImages';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const { data: productTypes = [], isLoading: productTypesLoading } =
    useSWR<ProductType[]>('/api/product-types');
  const { data: product, isLoading: productLoading } = useSWR<
    Product & { sales?: Sale & { retailers: Retailer }; consignments?: Consignment[] }
  >(id ? `/api/products/${id}` : null);

  const [description, setDescription] = useState(product?.description ?? '');
  const [type, setType] = useState(product?.type ?? 0);
  const [price, setPrice] = useState(product?.price ?? 0);
  const [pandora, setPandora] = useState(product?.pandora);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      return;
    }
    setDescription(product.description);
    setType(Number(product.type));
    setPandora(product.pandora);
    setPrice(product.price);
  }, [product]);

  function save() {
    toast.promise(saveProduct(), {
      loading: 'Guardando...',
      success: <b>El producto se ha actualizado</b>,
      error: <b>Ocurrió un error, vuelve a intentarlo</b>,
    });
  }

  function isFormValid() {
    return description.trim() !== '' && !isNaN(price) && type > 0;
  }

  const saveProduct = async () => {
    try {
      setIsLoading(true);
      await axios.put(`/api/products/${id}`, {
        type: Number(type),
        description,
        price,
        pandora,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };

  const onTypeChange = (keys: Selection) => {
    setType(Object.values(keys)[0]);
  };

  return (
    <div className="">
      <span className="text-2xl font-bold text-zinc-700 mb-10 flex items-center gap-6">
        <a className="bg-red-400 rounded-full text-white p-4 mr-6" onClick={() => router.back()}>
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </a>
        Editar Producto {id && `#${id}`}
        {product && (
          <span
            className={`px-4 py-1 inline-flex text-xs leading-0 sm:leading-5 font-semibold rounded-full ${
              product.status === AVAILABLE
                ? 'bg-green-300 text-green-900'
                : 'bg-red-300 text-red-900'
            }`}
          >
            {PRODUCT_STATUS[product.status ?? 0]}
          </span>
        )}
      </span>
      {productLoading || productTypesLoading ? (
        <Loading isLoading></Loading>
      ) : (
        <div className="flex lg:flex-row flex-col gap-6 justify-center">
          <div className="flex flex-col gap-6">
            <Card
              css={{
                p: 20,
              }}
            >
              <Card.Header css={{ p: 10, m: 0 }}>
                <Text b size={16}>
                  Datos de Producto
                </Text>
              </Card.Header>
              <Card.Divider></Card.Divider>
              <div className="flex flex-col mt-8">
                <div className="flex w-full gap-3">
                  <div className="flex-1">
                    <label
                      className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide"
                      htmlFor="description"
                    >
                      Descripción
                    </label>
                    <input
                      placeholder="Identifica el accesorio"
                      name="description"
                      className="w-full bg-zinc-200 py-3 px-5 outline-none rounded-lg text-zinc-500 tracking-wide"
                      value={description || ''}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-3 mt-6 flex-wrap-reverse">
                  <div className="flex-3 w-full sm:w-fit">
                    <label
                      className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide"
                      htmlFor="price"
                    >
                      Precio
                    </label>
                    <div className="w-full rounded-lg overflow-hidden flex">
                      <span className="bg-zinc-300 flex justify-center items-center font-bold px-5 text-zinc-500">
                        Q
                      </span>
                      <input
                        placeholder="175.00"
                        className="bg-gray-200 outline-none flex-1 py-3 px-5 text-zinc-500 tracking-wide"
                        value={price || ''}
                        onChange={(e) => setPrice(+e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-1/2">
                    <label
                      className="block my-2 uppercase text-xs font-bold text-zinc-500 tracking-wide flex-1"
                      htmlFor="description"
                    >
                      Tipo
                    </label>
                    <Dropdown>
                      <Dropdown.Button flat css={{ tt: 'capitalize' }} color="secondary">
                        {productTypes.find((p) => Number(p.id) === Number(type))?.type ?? 'Todos'}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Single selection actions"
                        disallowEmptySelection
                        color="secondary"
                        selectionMode="single"
                        selectedKeys={new Set([Number(type)])}
                        onSelectionChange={onTypeChange}
                      >
                        {[{ id: 0, type: 'Todos' }, ...productTypes].map((p, index) => (
                          <Dropdown.Item key={Number(p.id)}>{p.type}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="flex w-full gap-3 mt-6">
                  <div className="form-check">
                    <input
                      className="form-check-input appearance-none h-4 w-4 border border-gray-200 rounded-md bg-white checked:bg-red-400 checked:border-red-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="checkbox"
                      checked={pandora ?? false}
                      onChange={(e) => setPandora(e.target.checked)}
                    />
                    <label
                      className="form-check-label inline-block uppercase text-xs text-zinc-600"
                      htmlFor="flexCheckDefault"
                    >
                      Pandora
                    </label>
                  </div>
                </div>

                <button
                  className="font-bold bg-red-200 rounded-lg text-red-400 px-30 py-3 w-full mt-10 hover:bg-red-100 ease-in-out duration-300 disabled:bg-gray-300 disabled:text-gray-400"
                  onClick={() => save()}
                  disabled={isLoading || !isFormValid()}
                >
                  Guardar
                </button>
              </div>
            </Card>
            {product?.sales && (
              <Card css={{ w: '100%', flex: 1, p: 20, h: 'min-content' }} variant="shadow">
                <Card.Header css={{ p: 10, m: 0 }}>
                  <Text b size={16}>
                    Información de Venta
                  </Text>
                </Card.Header>
                <Card.Divider></Card.Divider>
                <Card.Body>
                  <div className="w-full h-full flex flex-col gap-6">
                    <div className="flex justify-between">
                      <div className="flex gap-4 items-center">
                        <Icon icon="uim:bitcoin" fontSize={24} />
                        <Text>Precio de Venta</Text>
                      </div>
                      <Text b>Q{product.sales.sale_price}</Text>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-4 items-center">
                        <Icon icon="uim:schedule" fontSize={24} />
                        <Text>Fecha de Venta</Text>
                      </div>
                      <Text b>{dayjs(product.sales.created_at).format('DD/MM/YYYY')}</Text>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-4 items-center">
                        <Icon icon="uim:user-arrows" fontSize={24} />
                        <Text>Cliente</Text>
                      </div>
                      <Text b>{product.sales.client}</Text>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-4 items-center">
                        <Icon icon="uim:user-nurse" fontSize={24} />
                        <Text>Vendedor(a)</Text>
                      </div>
                      <Link href={`/retailers/${product.sales.retailers.id}`}>
                        <Text b>{product.sales.retailers.name}</Text>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
          <div className="h-min flex-1">
            <Card
              css={{
                p: 20,
              }}
            >
              <Card.Header css={{ p: 10, m: 0 }}>
                <Text b size={16}>
                  Imágenes de Producto
                </Text>
              </Card.Header>
              <Card.Divider></Card.Divider>
              <ProductImages productId={Number(id)}></ProductImages>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
