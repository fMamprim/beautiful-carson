import { Request, Response } from 'express';
import { prisma, io } from '../index';

export class OrderController {
  async openTable(req: Request, res: Response) {
    const { tableId } = req.body;
    // Verifica se a mesa já está ocupada
    const table = await prisma.restaurantTable.findUnique({ where: { id: tableId } });
    if (table?.status === 'OCCUPIED') {
      return res.status(400).json({ error: 'Mesa já ocupada' });
    }
    
    // Atualiza status da mesa
    await prisma.restaurantTable.update({
      where: { id: tableId },
      data: { status: 'OCCUPIED' }
    });

    const order = await prisma.order.create({
      data: { tableId }
    });
    return res.json(order);
  }

  async addItems(req: Request, res: Response) {
    const { orderId } = req.params;
    const { items } = req.body; // array of { productId, quantity, notes }
    
    const createdItems = await prisma.orderItem.createMany({
      data: items.map((item: any) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes
      }))
    });

    // Avisa a cozinha
    io.emit('new_order', createdItems);

    return res.json(createdItems);
  }

  async getKitchenOrders(req: Request, res: Response) {
    const items = await prisma.orderItem.findMany({
      where: { status: { in: ['PENDING', 'PREPARING'] } },
      include: {
        product: true,
        order: {
          include: { table: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    return res.json(items);
  }
}