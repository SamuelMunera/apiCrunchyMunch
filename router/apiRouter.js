import express from 'express';
import cookieRouter from './cookieRouter.js';
import crookieRouter from './crookieRouter.js';
import pqrsRouter from './pqrsRouter.js';
import productRouter from './productRouter.js';
import categoryRouter from './categoryRouter.js';
import userRouter from './userRouter.js';
import authRoutes from './authRouter.js';

const router = express.Router();      
router.use('/cookie', cookieRouter);
router.use('/crookie', crookieRouter);
router.use('/pqrs', pqrsRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/user', userRouter);
router.use("/auth", authRoutes);

export default router; 
