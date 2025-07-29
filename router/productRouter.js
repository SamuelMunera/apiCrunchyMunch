import express from 'express';
import * as productControllers from "../controllers/productControllers.js";
import upload from  "../config/multer.js"

const router = express.Router();

router.get("/getAll", productControllers.getProducts);
router.post("/create",upload.single("photo"), productControllers.createProduct);
router.delete("/delete/:id", productControllers.removeProduct);
router.get("/getById/:id", productControllers.getProductById);
router.patch("/update/:id", productControllers.updatedProduct);
router.get("/:id/toppings", productControllers.getProductToppings);
router.patch("/:id/toppings", productControllers.assignToppingsToProduct);
router.patch("/:id/iceCream", productControllers.assignHeladosToProduct);
router.get("/:id/iceCream", productControllers.getProductIceCream);

export default router;