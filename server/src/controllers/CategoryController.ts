import { Request, Response } from 'express';
import { prisma } from '../index';

export class CategoryController {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    return res.json(category);
  }
  async list(req: Request, res: Response) {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  }
}