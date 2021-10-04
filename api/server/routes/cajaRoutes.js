import { Router } from 'express';
import CajaController from '../controllers/CajaController';

const router = Router();

router.post('/', CajaController.add);
router.get('/listadetalle/:page/:num/:id',CajaController.listadetalle)
router.put('/update/:id', CajaController.updates);
router.get('/:id', CajaController.item);
router.get('/items/:id', CajaController.items);

export default router;
