import { signUp, login, logout, protectedRoutes } from "../controllers/userController.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/protected", verifyToken, protectedRoutes);

export default router;
