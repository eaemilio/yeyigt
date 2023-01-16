import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { ErrorMessage } from '../types';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { Product } from '@prisma/client';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../../utils/constants';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default withApiAuth(
  async (req: NextApiRequest, res: NextApiResponse<Product | ErrorMessage>) => {
    try {
      const id = +(req.query.id ?? 0);
      switch (req.method) {
        case 'GET':
          const product = await prisma.product.findUnique({
            where: { id },
            include: {
              sales: {
                include: {
                  retailers: true,
                },
              },
              consignments: true,
            },
          });
          if (product) {
            return res.status(200).json(product);
          }
          res.status(404).json(NOT_FOUND_ERROR);
          break;
        case 'PUT':
          const { description, pandora, price, status, type } = req.body as Product;
          const productUpdate = await prisma.product.update({
            where: { id },
            data: { description, pandora, price, status, type },
          });
          res.status(200).json(productUpdate);
          break;
        case 'DELETE':
          const deleted = await prisma.product.update({
            where: { id },
            data: { active: false },
          });
          res.status(200).json(deleted);
        default:
          res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
          break;
      }
    } catch (error) {
      console.log('error single product', error);
      if ((error as any).code === 'P2025') {
        res.status(HTTP_CODES.NOT_FOUND).json({ error });
      } else {
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
      }
    }
  },
);
