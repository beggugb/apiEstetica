import { Router } from 'express';
import VentaController from '../controllers/VentaController';
import ArticuloController from '../controllers/ArticuloController';

const router = Router();
router.post('/', VentaController.ventaDirecta);
router.get('/data/:page/:num/:usuario', VentaController.dataUsuario);
/*router.get('/buscar/item/detalle/:codigo',ArticuloController.codigoStock);*/
router.post('/search',ArticuloController.codigoStock);
export default router;
