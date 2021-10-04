import { Router } from 'express';
import ArticuloController from '../controllers/ArticuloController';

const router = Router();
router.post('/', ArticuloController.registrar);
router.get('/data/:page/:num', ArticuloController.data);
router.put('/:id', ArticuloController.actualizar);
router.get('/:id', ArticuloController.item);
router.post('/stock', ArticuloController.stock);
router.post('/search',ArticuloController.buscar);
router.post('/search/items',ArticuloController.buscarItems);
router.post('/registro',ArticuloController.registro);
router.get('/detalle/items/:id',ArticuloController.catalogo);
router.delete('/:id',ArticuloController.borrar);
router.get('/buscar/item/detalle/:codigo',ArticuloController.codigo);
export default router;
