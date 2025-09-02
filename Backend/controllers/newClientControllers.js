// backend/controllers/newClientControllers.js
import Client from "../models/newClientModels.js";

export const newClientAdd = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ message: "✅ Client added successfully", client });
  } catch (error) {
    res.status(500).json({ message: "❌ Error adding client", error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching clients", error: error.message });
  }
};
