import express from "express";
import * as userController from "../controllers/userController.js";




const router = express.Router();
router.get("/getAll", userController.getUser);
router.post("/create", userController.createUsers);
router.patch("/update/:id", userController.editUser);    
router.delete("/delete/:id", userController.removeUser);
//router.get("/getById/:id", getById);


export default router;