import express from 'express';
import cookieRouter from './cookieRouter.js';
import crookieRouter from './crookieRouter.js';

const router = express.Router();      
router.use('/cookie', cookieRouter);
router.use('/crookie', crookieRouter);
export default router; 
