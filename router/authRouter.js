import express from "express";
import{loginUser, validateToken} from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/jwt.js";
const router = express.Router();

// Ruta para login
router.post("/Login", loginUser);

router.get('/validate-token', verifyToken, validateToken);
export default router;