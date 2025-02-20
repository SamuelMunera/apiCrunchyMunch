import express from "express";
import * as crookiesControllers from "../controllers/crookiesControllers.js";
import upload from  "../config/multer.js"

const router = express.Router();
router.get("/getAll", crookiesControllers.getCrookies);
router.post("/create", upload.single("photo"),crookiesControllers.createCrookie)
router.patch("/update/:id", crookiesControllers.editCrookie);    
router.delete("/delete/:id", crookiesControllers.removeCrookie);
//router.get("/getById/:id", getById);


export default router;