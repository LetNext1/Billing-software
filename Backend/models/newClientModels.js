// backend/models/newClientModels.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
