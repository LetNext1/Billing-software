
import express from "express";
import {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/addStockConrollers.js"; 

const router = express.Router();

router.post("/add", addProduct);
router.get("/all", getAllProducts);
router.put("/edit/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/search", searchProducts);

export default router;
