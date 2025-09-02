import express from "express";
import { newClientAdd, getAllClients } from "../controllers/newClientControllers.js";

const router = express.Router();

router.post("/add", newClientAdd);
router.get("/all", getAllClients);

export default router;
