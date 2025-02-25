import express from 'express';
import * as pqrsControllers from '../controllers/pqrsControllers.js';
const router = express.Router();

router.get("/getAll", pqrsControllers.getPqrs);
router.post("/create", pqrsControllers.createPqrs);
router.delete("/delete/:id", pqrsControllers.removePqrs);
router.get("/getById/:id", pqrsControllers.getPqrsById);

export default router;