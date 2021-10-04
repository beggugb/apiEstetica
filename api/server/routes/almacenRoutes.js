import { Router } from 'express';
import AlmacenController from '../controllers/AlmacenController';

const router = Router();
router.post('/search',AlmacenController.stock);
router.post('/search/items',AlmacenController.buscarItems);
router.get('/lista/items',AlmacenController.lista);
export default router;
