// backend/models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: String },
  markupPrice:{type:String},
  sellingPrice:{type:String}, 
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
