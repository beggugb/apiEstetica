import { Router } from 'express';
import InformesController from '../controllers/InformesController';

const router = Router();
router.post('/movimientos',InformesController.movimientos)
router.post('/existencias',InformesController.existencias)
router.post('/comisiones',InformesController.comisiones)
router.post('/dcomisiones',InformesController.dcomisiones)
router.post('/balance',InformesController.balance)
export default router;

