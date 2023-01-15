import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { ErrorMessage } from '../types';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../utils/constants'
import { Product, ProductType } from '@prisma/client';

(BigInt.prototype as unknown as any).toJSON = function() {       
  return this.toString()
}

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<ProductType[] | ProductType | ErrorMessage>) => {
    try {
        switch (req.method) {
            case 'POST':
                const { type } = req.body as ProductType;
                const productType = await prisma.productType.create({ data: { type } });
                res.status(HTTP_CODES.CREATED).json(productType);
                break;
            case 'GET':
                const productTypes = await prisma.productType.findMany();
                res.status(HTTP_CODES.OK).json(productTypes);
                break;
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        console.log('PRODUCT TYPES ERROR - ', error);
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
});