import { Router } from 'express';
import FilesController from '../controllers/FilesController';

const router = Router();
router.put('/articulo/item/:id', FilesController.articulos);
router.put('/proveedor/item/:id', FilesController.proveedores);
router.put('/cliente/item/:id', FilesController.clientes);
router.put('/servicio/item/:id', FilesController.servicios);
router.put('/persona/item/:id', FilesController.personas);
export default router;

