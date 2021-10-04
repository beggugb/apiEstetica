import { Router } from 'express';
import ServicioController from '../controllers/ServicioController';

const router = Router();
router.post('/registro/', ServicioController.registrar);
router.put('/:id', ServicioController.actualizar);
router.get('/:id', ServicioController.item);
router.get('/data/:page/:num', ServicioController.data);
router.post('/search', ServicioController.buscar);
router.delete('/:id',ServicioController.borrar);
export default router;

