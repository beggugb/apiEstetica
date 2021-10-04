import { Router } from 'express';
import VentaController from '../controllers/VentaController';

const router = Router();
router.get('/data/:page/:num', VentaController.data);
router.post('/registro', VentaController.registrar);
router.put('/:id', VentaController.actualizar);
router.put('/update/:id', VentaController.update);
router.get('/:id', VentaController.item);
router.post('/search', VentaController.buscar)
router.delete('/:id',VentaController.borrar)
router.get('/send/item/:id', VentaController.send);
export default router;
