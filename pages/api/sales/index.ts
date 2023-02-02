import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { ErrorMessage } from '../types';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, PAGE_OFFSET } from '../../../utils/constants';
import { Sale } from '@prisma/client';
import { getDateLimits } from '../../../utils/helpers';
import dayjs from 'dayjs';

(BigInt.prototype as unknown as any).toJSON = function () {
  return this.toString();
};

export default async (req: NextApiRequest, res: NextApiResponse<Sale[] | Sale | ErrorMessage>) => {
  try {
    switch (req.method) {
      case 'GET':
        await getAll(req, res as NextApiResponse<{ sales: Sale[]; count: number } | ErrorMessage>);
        break;
      default:
        res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
        break;
    }
  } catch (error) {
    console.log('SALES ERROR - ', error);
    res.status(HTTP_CODES.SERVER_ERROR).json({ error });
  }
};

const getAll = async (
  req: NextApiRequest,
  res: NextApiResponse<{ sales: Sale[]; count: number } | ErrorMessage>,
) => {
  const { date, page } = req.query as {
    date: string | undefined;
    page: string;
  };

  const { lte, gte } = getDateLimits(date);
  console.log({ lte, gte });

  const where = {
    created_at: {
      lte: lte ? dayjs(lte).toISOString() : '',
      gte: gte ? dayjs(gte).toISOString() : '',
    },
  };

  const paging = page
    ? {
        skip: (Number(page) - 1) * PAGE_OFFSET,
        take: PAGE_OFFSET,
      }
    : undefined;

  const sales = await prisma.sale.findMany({
    where: { ...where },
    include: {
      products: true,
    },
    orderBy: {
      id: 'desc',
    },
    ...paging,
  });
  const count = await prisma.sale.count({
    where: { ...where },
  });
  res.status(HTTP_CODES.OK).json({
    sales,
    count,
  });
};
