import express from 'express';
import cookieRouter from './cookieRouter.js';
import crookieRouter from './crookieRouter.js';
import pqrsRouter from './pqrsRouter.js';
import productRouter from './productRouter.js';
import categoryRouter from './categoryRouter.js';
import userRouter from './userRouter.js';
import authRoutes from './authRouter.js';
import superUserRouter from './superUserRouter.js';
import superUserAuthRouter from './superUserAuthRouter.js';
import toppingRouter from './toppingRouter.js'; 
import iceCreamRouter from './iceCreamRouter.js';
import pedidoRouter from './pedidosRouter.js';


const router = express.Router();      
router.use('/cookie', cookieRouter);
router.use('/crookie', crookieRouter);
router.use('/pqrs', pqrsRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/user', userRouter);
router.use("/auth", authRoutes);
router.use('/superUser', superUserRouter); 
router.use('/superUserAuth', superUserAuthRouter);
router.use('/topping', toppingRouter);
router.use('/iceCream', iceCreamRouter); 
router.use('/pedidos', pedidoRouter); 


export default router;   
