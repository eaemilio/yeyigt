import React from 'react';
import { Trash2 } from 'react-feather';
import { formatDate } from '../utils/helpers';
import { AVAILABLE, PRODUCT_STATUS } from '../utils/constants';

function ProductsTable({ products, removable, onRemove }) {
  return (
    <div className="flex flex-col mt-2">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden sm:rounded-lg">
            <div className="flex items-center justify-center">
              <div className="container">
                <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg sm:shadow-zinc-100/10 my-5">
                  <thead className="sm:bg-white border-b border-b-zinc-100">
                    {products.map((product) => (
                      <tr
                        key={product.id}
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
                        {removable && (
                          <th className="p-4 sm:px-6 sm:py-4 text-left text-sm font-light sm:text-xs sm:font-medium text-gray-500 sm:uppercase sm:tracking-wider" />
                        )}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="flex-1 sm:flex-none">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="rounded-r-xl bg-white overflow-hidden flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                      >
                        <td className="bg-white p-4 text-sm text-zinc-800">{product.id}</td>
                        <td className="bg-white p-4 text-sm text-zinc-800">{product.product_types?.type ?? ''}</td>
                        <td className="h-20 sm:h-fit bg-white p-4 text-sm text-zinc-800">{product.description}</td>
                        <td className="bg-white p-4 text-sm text-zinc-800">Q{product.price.toFixed(2)}</td>
                        <td className="bg-white p-4 text-sm text-zinc-800 text-ellipsis overflow-hidden break-all">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="bg-white p-4 text-sm text-zinc-800">
                          <span
                            className={`px-2 inline-flex text-xs leading-0 sm:leading-5 font-semibold rounded-full ${
                              product.status === AVAILABLE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {PRODUCT_STATUS[product.status]}
                          </span>
                        </td>
                        {removable && (
                          <td className="px-10">
                            <button type="button" onClick={() => onRemove(product)}>
                              <Trash2 color="red" size={18} />
                            </button>
                          </td>
                        )}
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
  );
}

export default ProductsTable;
