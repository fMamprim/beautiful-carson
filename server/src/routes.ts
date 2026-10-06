import { Router } from 'express';
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
