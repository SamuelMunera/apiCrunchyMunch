import express from 'express';
import cookieRouter from './cookieRouter.js';
import crookieRouter from './crookieRouter.js';
import pqrsRouter from './pqrsRouter.js';

const router = express.Router();      
router.use('/cookie', cookieRouter);
router.use('/crookie', crookieRouter);
router.use('/pqrs', pqrsRouter);
export default router; 
