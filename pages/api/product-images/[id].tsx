import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { ErrorMessage } from '../types';
import { ProductImage } from '@prisma/client';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../../utils/constants';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default async (req: NextApiRequest, res: NextApiResponse<ProductImage | ErrorMessage>) => {
  try {
    const id = +(req.query.id ?? 0);
    switch (req.method) {
      case 'DELETE':
        const deleted = await prisma.productImage.delete({
          where: { id },
        });
        res.status(200).json(deleted);
      default:
        res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
        break;
    }
  } catch (error) {
    console.log('error product image', error);
    if ((error as any).code === 'P2025') {
      res.status(HTTP_CODES.NOT_FOUND).json({ error });
    } else {
      res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
  }
};
