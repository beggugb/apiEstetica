import { Router } from 'express';
import CategoriaController from '../controllers/CategoriaController';

const router = Router();
router.post('/', CategoriaController.registrar);
router.put('/update/:id', CategoriaController.actualizar);
router.get('/:id', CategoriaController.item);
router.get('/data/:page/:num', CategoriaController.data);
router.post('/search', CategoriaController.buscar)
router.get('/lista/items',CategoriaController.lista)
router.delete('/:id',CategoriaController.borrar)
export default router;
