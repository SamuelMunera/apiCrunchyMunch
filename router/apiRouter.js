import express from 'express';
import cookieRouter from './cookieRouter.js';

const router = express.Router();      
router.use('/cookie', cookieRouter);

export default router; 
