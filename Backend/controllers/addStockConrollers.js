// backend/controllers/addStockControllers.js
import Product from "../models/newProductModel.js";

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  const { name } = req.query;

  let query = {};
  if (name) {
    query.productName = { $regex: name, $options: 'i' }; // Case-insensitive search
  }

  try {
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, quantity, price,markupPrice,sellingPrice } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, quantity, price,markupPrice,sellingPrice },
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Failed to update product", error);
    res.status(400).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(400).json({ message: "Failed to delete product", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Search query 'name' is required" });
  }

  try {
    const products = await Product.find({
      productName: { $regex: name, $options: "i" } // Case-insensitive search
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Error searching products", error: error.message });
  }
};
