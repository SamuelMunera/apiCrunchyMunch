import express from "express";
import * as cookiesControllers from "../controllers/cookiesControllers.js";


const router = express.Router();
router.get("/getAll", cookiesControllers.getCookies);
router.post("/create", cookiesControllers.createCookie);
router.patch("/update/:id", cookiesControllers.editCookie);    
router.delete("/delete/:id", cookiesControllers.removeCookie);
//router.get("/getById/:id", getById);


export default router;