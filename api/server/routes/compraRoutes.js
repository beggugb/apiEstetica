import { Router } from 'express';
import CompraController from '../controllers/CompraController';

const router = Router();
router.post('/registro', CompraController.registrar);
router.put('/:id', CompraController.actualizar);
router.get('/:id', CompraController.item);
router.get('/data/:page/:num', CompraController.data);
router.post('/search', CompraController.buscar)
router.put('/update/:id', CompraController.aprobar)
router.delete('/:id',CompraController.borrar)
router.get('/send/item/:id', CompraController.send);
export default router;
