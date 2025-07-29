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

// Rutas protegidas para administradores (colócalas ANTES de la ruta con :id)
router.get('/all-orders', getAllPedidos);
router.patch('/:id/estado', verifyToken, updatePedidoStatus);

// Esta ruta debe estar después porque tiene un parámetro dinámico
router.get('/:id', verifyToken, getPedidoById); 
router.patch('/:id/pago', verifyToken, actualizarComprobantePago);
export default router;