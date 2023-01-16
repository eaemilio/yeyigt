import { Product, ProductType } from '@prisma/client';
import axios from 'axios';
import moment from 'moment';
import { ALL } from '../utils/constants';

export interface ProductParams {
  search?: string;
  page?: number;
  month?: number;
  year?: number;
  type?: number;
  status?: number;
}

export const getProducts = async ({
  search,
  page = 1,
  month,
  year,
  type,
  status,
}: ProductParams): Promise<{
  products: (Product & { product_types: ProductType })[];
  count: number;
}> => {
  const m = Number(month);

  const gte = year !== undefined && m !== undefined && `${year}-${m === 0 ? '01' : m}-01`;
  const lte =
    year !== undefined &&
    m !== undefined &&
    `${year}-${m === 0 ? '12' : m}-${moment(
      `${year}-${m === 0 ? '12' : m}`,
      'YYYY-MM',
    ).daysInMonth()}`;

  const result = await axios.get<{
    products: (Product & { product_types: ProductType })[];
    count: number;
  }>('/api/products', {
    params: {
      search: search?.trim().length ? search : undefined,
      page,
      lte: Number(year) === 0 ? undefined : lte,
      gte: Number(year) === 0 ? undefined : gte,
      type: Number(type) === 0 ? undefined : type,
      status: Number(status) === ALL ? undefined : status,
    },
  });
  const { products, count } = result.data;
  return {
    products,
    count,
  };
};
