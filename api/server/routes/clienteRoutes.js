import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';

const router = Router();
router.post('/registro/', ClienteController.registrar);
router.put('/:id', ClienteController.actualizar);
router.get('/:id', ClienteController.item);
router.get('/data/:page/:num', ClienteController.data);
router.post('/search', ClienteController.buscar)
export default router;

