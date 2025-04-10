import express from "express";
import { createHelado, deleteHelado, getIceCreamById,getAllIceCreams } from "../controllers/iceCreamControllers.js";

const router = express.Router();

router.get("/getAll", getAllIceCreams);
router.post("/create", createHelado);
router.delete("/:name", deleteHelado);
router.get('/:id', getIceCreamById); 


export default router;
