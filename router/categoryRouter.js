import express from 'express';
import * as categoryControllers from "../controllers/categoryControllers.js";
const router = express.Router();

router.get("/getAll", categoryControllers.getCategory);
router.post("/create", categoryControllers.createCategory);
router.delete("/delete/:id", categoryControllers.removeCategory);
router.patch("/update/:id", categoryControllers.editCategory);

export default router;