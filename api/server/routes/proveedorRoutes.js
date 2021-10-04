import { Router } from 'express';
import ProveedorController from '../controllers/ProveedorController';

const router = Router();
router.post('/registro/', ProveedorController.registrar);
router.put('/:id', ProveedorController.actualizar);
router.get('/:id', ProveedorController.item);
router.get('/data/:page/:num', ProveedorController.data);
router.post('/search', ProveedorController.buscar)
export default router;
