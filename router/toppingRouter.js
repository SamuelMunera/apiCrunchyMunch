import express from "express";
import { createTopping, deleteTopping, getToppingById,getAllToppings } from "../controllers/toppingControllers.js";

const router = express.Router();

router.get("/getAll", getAllToppings); // Obtener todos los toppings
router.post("/create", createTopping);       // Crear topping
router.delete("/:id", deleteTopping);  // Eliminar topping por ID
router.get('/:id', getToppingById);
export default router;
