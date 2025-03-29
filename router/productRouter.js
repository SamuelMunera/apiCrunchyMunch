import express from 'express';
import * as productControllers from "../controllers/productControllers.js";
import upload from  "../config/multer.js"

const router = express.Router();

router.get("/getAll", productControllers.getProducts);
router.post("/create",upload.single("photo"), productControllers.createProduct);
router.delete("/delete/:id", productControllers.removeProduct);
router.get("/getById/:id", productControllers.getProductById);
router.patch("/update/:id", productControllers.updatedProduct);

export default router;