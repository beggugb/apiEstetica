import { Router } from 'express';
import PersonalController from '../controllers/PersonalController';

const router = Router();
router.post('/registro/', PersonalController.registrar);
router.put('/:id', PersonalController.actualizar);
router.get('/:id', PersonalController.item);
router.get('/data/:page/:num', PersonalController.data);
router.post('/search', PersonalController.buscar)
router.get('/lista/items',PersonalController.lista)
export default router;

