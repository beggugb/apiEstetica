import { Router } from 'express';
import MarcaController from '../controllers/MarcaController';

const router = Router();
router.post('/', MarcaController.registrar);
router.put('/:id', MarcaController.actualizar);
router.get('/:id', MarcaController.item);
router.get('/data/:page/:num', MarcaController.data);
router.post('/search', MarcaController.buscar);
router.get('/lista/items',MarcaController.lista);
router.delete('/:id',MarcaController.borrar)
export default router;
