import express from 'express';
import {
  createPedido,
  getPedidoById,
  actualizarComprobantePago,
  getAllPedidos,
  updatePedidoStatus,
  getUserPedidos
} from '../controllers/pedidosControllers.js';
import { verifyToken, checkRole } from '../middlewares/jwt.js';

const router = express.Router();

// Rutas protegidas con autenticación
router.post('/create', verifyToken, createPedido);
router.get('/mis-pedidos', verifyToken, getUserPedidos);
router.get('/:id', verifyToken, getPedidoById);
router.patch('/:id/pago', verifyToken, actualizarComprobantePago);

// Rutas protegidas para administradores
router.get('/', verifyToken, checkRole(['admin']), getAllPedidos);
router.patch('/:id/estado', verifyToken, checkRole(['admin']), updatePedidoStatus);

export default router;