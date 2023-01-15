import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { ErrorMessage } from '../types';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, PAGE_OFFSET } from '../../../utils/constants';
import { Product } from '@prisma/client';
import * as moment from 'moment';

(BigInt.prototype as unknown as any).toJSON = function () {
  return this.toString();
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Product[] | Product | ErrorMessage>,
) => {
  try {
    switch (req.method) {
      case 'POST':
        await post(req, res as NextApiResponse<Product | ErrorMessage>);
        break;
      case 'GET':
        await getAll(
          req,
          res as NextApiResponse<{ products: Product[]; count: number } | ErrorMessage>,
        );
        break;
      default:
        res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
        break;
    }
  } catch (error) {
    console.log('PRODUCTS ERROR - ', error);
    res.status(HTTP_CODES.SERVER_ERROR).json({ error });
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse<Product | ErrorMessage>) => {
  const { description, pandora, price, status, type } = req.body as Product;
  const user = await prisma.product.create({
    data: { description, pandora, price, status, type },
  });
  res.status(HTTP_CODES.CREATED).json(user);
};

const getAll = async (
  req: NextApiRequest,
  res: NextApiResponse<{ products: Product[]; count: number } | ErrorMessage>,
) => {
  const { status, search, type, lte, gte, page = 1 } = req.query;
  const where = {
    AND: [
      {
        OR: [
          {
            description: {
              contains: search ? `${search}` : undefined,
            },
          },
          {
            id: {
              equals: Number(search) ? Number(search) : undefined,
            },
          },
        ],
      },
      {
        status: {
          equals: status ? Number(status) : undefined,
        },
        type: {
          equals: type ? Number(type) : undefined,
        },
        created_at: {
          lte: lte && new Date(`${lte}`).toISOString(),
          gte: gte && new Date(`${gte}`).toISOString(),
        },
        active: true,
      },
    ],
  };
  const products = await prisma.product.findMany({
    where: {
      ...where,
    },
    include: {
      product_types: true,
    },
    orderBy: {
      id: 'desc',
    },
    skip: (Number(page) - 1) * PAGE_OFFSET,
    take: PAGE_OFFSET,
  });
  const count = await prisma.product.count({
    where: { ...where },
  });
  res.status(HTTP_CODES.OK).json({
    products,
    count,
  });
};
