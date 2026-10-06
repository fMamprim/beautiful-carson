import { Request, Response } from 'express';
import { prisma } from '../index';

export class TableController {
  async create(req: Request, res: Response) {
    const { number } = req.body;
    const table = await prisma.restaurantTable.create({ data: { number: parseInt(number) } });
    return res.json(table);
  }
  async list(req: Request, res: Response) {
    const tables = await prisma.restaurantTable.findMany();
    return res.json(tables);
  }
}