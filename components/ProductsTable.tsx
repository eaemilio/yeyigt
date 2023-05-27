import React from 'react';
import { Edit, Edit2, Trash2 } from 'react-feather';
import { formatDate } from '../utils/helpers';
import { AVAILABLE, PRODUCT_STATUS } from '../utils/constants';
import Link from 'next/link';
import { Product, ProductType } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Button, Collapse, Text } from '@nextui-org/react';
import TypeIcon from './dashboard/icons/TypeIcon';

type Props = {
  products: (Product & { product_types: ProductType })[];
  onRemove?: (id: number) => void;
};

function ProductsTable({ products, onRemove }: Props) {
  const router = useRouter();
  const { isMobile } = useDeviceDetect();

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden sm:rounded-lg">
            <div className="flex items-center justify-center">
              <div className="w-full">
                {!isMobile && (
                  <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg sm:shadow-zinc-100/10 my-5">
                    <thead className="sm:bg-white border-b border-b-zinc-100">
                      {products.map((product) => (
                        <tr
                          key={Number(product.id)}
                          className="bg-white flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0"
                        >
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Código
                          </th>
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Tipo
                          </th>
                          <th className="h-20 sm:h-fit p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Descripción
                          </th>
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Precio
                          </th>
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Fecha Agregado
                          </th>
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Estado
                          </th>
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      ))}
                    </thead>
                    <tbody className="flex-1 sm:flex-none">
                      {products.map((product) => (
                        <tr
                          key={Number(product.id)}
                          className="rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 hover:bg-zinc-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/products/${Number(product.id)}`);
                          }}
                        >
                          <td className="p-4 text-sm text-zinc-800">{Number(product.id)}</td>
                          <td className="p-4 text-sm text-zinc-800">
                            {product.product_types?.type ?? ''}
                          </td>
                          <td className="h-20 sm:h-fit p-4 text-sm text-zinc-800">
                            {product.description}
                          </td>
                          <td className="p-4 text-sm text-zinc-800">Q{product.price.toFixed(2)}</td>
                          <td className="p-4 text-sm text-zinc-800 text-ellipsis overflow-hidden break-all">
                            {formatDate(product.created_at)}
                          </td>
                          <td className="p-4 text-sm text-zinc-800">
                            <span
                              className={`px-2 inline-flex text-xs leading-0 sm:leading-5 font-semibold rounded-full ${
                                product.status === AVAILABLE
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {PRODUCT_STATUS[product.status ?? 0]}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-zinc-800 text-ellipsis overflow-hidden break-all flex gap-2">
                            <Link href={`/products/${product.id}`} className="text-zinc-800">
                              <Edit size={18} />
                            </Link>
                            {onRemove && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemove(Number(product.id));
                                }}
                              >
                                <Trash2 color="red" size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Mobile Table */}
                {isMobile && (
                  <Collapse.Group className="my-2">
                    {products.map((product) => (
                      <Collapse
                        key={Number(product.id)}
                        title={<Text h6>{`#${product.id}`}</Text>}
                        subtitle={product.description}
                        contentLeft={<TypeIcon id={Number(product.product_types.id)}></TypeIcon>}
                      >
                        <div className="px-6">
                          <div className="flex justify-between items-center">
                            <Text weight="bold">Estado</Text>
                            <span
                              className={`px-2 inline-flex text-xs leading-0 sm:leading-5 font-semibold rounded-full ${
                                product.status === AVAILABLE
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {PRODUCT_STATUS[product.status ?? 0]}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Text weight="bold">Tipo</Text>
                            <Text>{product.product_types?.type ?? ''}</Text>
                          </div>
                          <div className="flex justify-between items-center">
                            <Text weight="bold">Precio</Text>
                            <Text>Q.{product.price}</Text>
                          </div>
                          <div className="flex justify-between items-center">
                            <Text weight="bold">Fecha de Creación</Text>
                            <Text>{formatDate(product.created_at)}</Text>
                          </div>
                          <div className="flex gap-1 flex-col mt-4">
                            <Link href={`/products/${product.id}`} className="flex w-full">
                              <Button className="flex-1">Editar</Button>
                            </Link>
                            {onRemove && (
                              <Button
                                color="error"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemove(Number(product.id));
                                }}
                              >
                                Eliminar
                              </Button>
                            )}
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
  );
}

export default ProductsTable;
