import express from "express";
import * as authController from "../controllers/authControllers.js";

const router = express.Router();

// Ruta para login
router.post("/login", authController.loginUser);

export default router;