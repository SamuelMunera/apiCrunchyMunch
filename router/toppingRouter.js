import express from "express";
import { createTopping, deleteTopping, getToppingById } from "../controllers/toppingControllers.js";

const router = express.Router();

router.post("/create", createTopping);       // Crear topping
router.delete("/:id", deleteTopping);  // Eliminar topping por ID
router.get('/:id', getToppingById);
export default router;
