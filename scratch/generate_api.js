import fs from 'fs';
import path from 'path';

const controllersDir = path.join(process.cwd(), './src/controllers');
const routesDir = path.join(process.cwd(), './src');

const categoryController = `import { Request, Response } from 'express';
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
}`;

const productController = `import { Request, Response } from 'express';
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
}`;

const tableController = `import { Request, Response } from 'express';
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
}`;

const orderController = `import { Request, Response } from 'express';
import { prisma } from '../index';

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
}`;

const routesFile = `import { Router } from 'express';
import { CategoryController } from './controllers/CategoryController';
import { ProductController } from './controllers/ProductController';
import { TableController } from './controllers/TableController';
import { OrderController } from './controllers/OrderController';

const router = Router();
const categoryController = new CategoryController();
const productController = new ProductController();
const tableController = new TableController();
const orderController = new OrderController();

router.post('/categories', categoryController.create);
router.get('/categories', categoryController.list);

router.post('/products', productController.create);
router.get('/products', productController.list);

router.post('/tables', tableController.create);
router.get('/tables', tableController.list);

router.post('/orders/open', orderController.openTable);
router.post('/orders/:orderId/items', orderController.addItems);
router.get('/orders/kitchen', orderController.getKitchenOrders);

export { router };
`;

fs.writeFileSync(path.join(controllersDir, 'CategoryController.ts'), categoryController);
fs.writeFileSync(path.join(controllersDir, 'ProductController.ts'), productController);
fs.writeFileSync(path.join(controllersDir, 'TableController.ts'), tableController);
fs.writeFileSync(path.join(controllersDir, 'OrderController.ts'), orderController);
fs.writeFileSync(path.join(routesDir, 'routes.ts'), routesFile);

console.log('Controllers and routes created.');
