import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { ErrorMessage } from '../types';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../utils/constants';
import { Product, ProductImage, ProductType } from '@prisma/client';

(BigInt.prototype as unknown as any).toJSON = function () {
  return this.toString();
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ProductImage[] | ProductImage | ErrorMessage>,
) => {
  const { method, query } = req;
  try {
    switch (method) {
      case 'POST':
        const { image_url, product_id } = req.body as ProductImage;
        const newProductImage = await prisma.productImage.create({
          data: { image_url, product_id },
        });
        res.status(HTTP_CODES.CREATED).json(newProductImage);
        break;
      case 'GET':
        const productImages = await prisma.productImage.findMany({
          where: {
            product_id: Number(query.productId),
          },
        });
        res.status(HTTP_CODES.OK).json(productImages);
        break;
      default:
        res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
        break;
    }
  } catch (error) {
    console.log('PRODUCT IMAGES ERROR - ', error);
    res.status(HTTP_CODES.SERVER_ERROR).json({ error });
  }
};
