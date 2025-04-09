import express from "express";
import * as superUserControllers from "../controllers/superUserControllers.js";




const router = express.Router();
router.get("/getAll", superUserControllers.getSuperUser);
router.post("/create", superUserControllers.createSuperUsers);
router.patch("/update/:id", superUserControllers.editSuperUser);    
router.delete("/delete/:id", superUserControllers.removeSuperUser);
//router.get("/getById/:id", getById);


export default router;