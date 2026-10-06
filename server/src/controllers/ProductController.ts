import { Request, Response } from 'express';
import { prisma } from '../index';

export class ProductController {
  async create(req: Request, res: Response) {
    const { name, description, price, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, categoryId }
    });
    return res.json(product);
  }
  async list(req: Request, res: Response) {
    const products = await prisma.product.findMany({ include: { category: true } });
    return res.json(products);
  }
}