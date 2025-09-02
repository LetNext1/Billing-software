import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import newClientRoutes from "./routes/newClientRoutes.js";
import newProductRoutes from "./routes/newProductRoutes.js";

dotenv.config();
connectDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS with credentials
app.use(
  cors({
     origin: [
      "https://e-billing-software.netlify.app", 
      "http://localhost:5173",                  
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/clients", newClientRoutes);
app.use("/api/v1/products", newProductRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
