import express from 'express';
import { loginUser } from '../controllers/authControllers.js';
import { loginSuperUserController } from '../controllers/superUserAuthController.js';

const router = express.Router();

// Ruta para login de usuarios normales
router.post('/login', loginUser);

// Ruta para login de super usuarios
router.post('/admin/login', loginSuperUserController);

export default router;