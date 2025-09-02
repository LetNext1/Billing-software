import React, { useState, useEffect } from "react";
import Sale from "../components/Sale";
import { BarChart } from "@mui/x-charts/BarChart";
import Client from "../components/Client";
import Stock from "../components/Stock";
import Document from "../components/Document";

// Chart data
const dataset = [
  { month: "Jan", london: 20, paris: 15, newYork: 30 },
  { month: "Feb", london: 25, paris: 20, newYork: 35 },
  { month: "Mar", london: 30, paris: 25, newYork: 40 },
  { month: "Apr", london: 30, paris: 25, newYork: 40 },
];

// Formatter for chart values
const valueFormatter = (value) => `${value}`;

// Chart settings
const chartSetting = {
  width: 800,
  height: 300,
};

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [clientAction, setClientAction] = useState(null);
  const [stockAction, setStockAction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newClient, setNewClient] = useState({
    shopName: "",
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [clientsList, setClientsList] = useState([]);

  const [newProduct, setNewProduct] = useState({
    productName: "",
    quantity: "",
    price: "",
    markupPrice: "",
    sellingPrice: "",
  });

  const [updateStock, setUpdateStock] = useState({
    _id: "",
    productName: "",
    quantity: "",
    price: "",
    markupPrice: "",
    sellingPrice: "",
  });

  const [productsList, setProductsList] = useState([]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStockInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateStock((prev) => ({ ...prev, [name]: value }));
  };

  // Add new client
  const submitNewClient = async () => {
    try {
      console.log(
        "Submitting new client to:",
        `${API_URL}/api/v1/clients/add`,
        newClient
      );

      const response = await fetch(`${API_URL}/api/v1/clients/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) throw new Error("Failed to add client");

      alert("Client added successfully!");
      setNewClient({
        shopName: "",
        name: "",
        email: "",
        phone: "",
        location: "",
      });
      fetchClients();
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client");
    }
  };

  // Add new product
  const submitNewProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: newProduct.productName,
          quantity: parseInt(newProduct.quantity, 10),
          price: parseFloat(newProduct.price),
          markupPrice: parseFloat(newProduct.markupPrice),
          sellingPrice: parseFloat(newProduct.sellingPrice),
        }),
      });

      if (!response.ok) throw new Error("Failed to add product");

      alert("Product added successfully!");
      setNewProduct({
        productName: "",
        quantity: "",
        price: "",
        markupPrice: "",
        sellingPrice: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  // Update product
  const updateProduct = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/products/edit/${updateStock._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: updateStock.productName,
            quantity: parseInt(updateStock.quantity, 10),
            price: parseFloat(updateStock.price),
            markupPrice: parseFloat(updateStock.markupPrice),
            sellingPrice: parseFloat(updateStock.sellingPrice),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      setUpdateStock({
        _id: "",
        productName: "",
        quantity: "",
        price: "",
        markupPrice: "",
        sellingPrice: "",
      });
      setIsEditing(false);
      setStockAction("stock list");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${API_URL}/api/v1/products/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // Start editing a product
  const handleEditProduct = (product) => {
    setUpdateStock({
      _id: product._id,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      markupPrice: product.markupPrice,
      sellingPrice: product.sellingPrice,
    });
    setIsEditing(true);
    setStockAction("edit product");
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/clients/all`);
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClientsList(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/products/all`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProductsList(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (clientAction === "existing") fetchClients();
    if (stockAction === "stock list") fetchProducts();
  }, [clientAction, stockAction]);

  // Render stock UI
  const renderStockContent = () => {
    if (stockAction === "Add product") {
      return (
        <div className="newStock-form">
          <input
            type="text"
            name="productName"
            value={newProduct.productName}
            onChange={handleProductInputChange}
            placeholder="Product Name"
          />
          <input
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleProductInputChange}
            placeholder="Quantity"
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleProductInputChange}
            placeholder="Price"
          />
          <input
            type="number"
            name="markupPrice"
            value={newProduct.markupPrice}
            onChange={handleProductInputChange}
            placeholder="Markup Price"
          />
          <input
            type="number"
            name="sellingPrice"
            value={newProduct.sellingPrice}
            onChange={handleProductInputChange}
            placeholder="Selling Price"
          />
          <button style={{ background: "grey" }} onClick={submitNewProduct}>
            Add Product
          </button>
        </div>
      );
    } else if (stockAction === "edit product" && isEditing) {
      return (
        <div className="editStock-form">
          <input
            type="text"
            name="productName"
            value={updateStock.productName}
            onChange={handleUpdateStockInputChange}
            placeholder="Product Name"
            disabled
          />
          <input
            type="number"
            name="quantity"
            value={updateStock.quantity}
            onChange={handleUpdateStockInputChange}
            placeholder="Quantity"
          />
          <input
            type="number"
            name="price"
            value={updateStock.price}
            onChange={handleUpdateStockInputChange}
            placeholder="Price"
          />
          <input
            type="number"
            name="markupPrice"
            value={updateStock.markupPrice}
            onChange={handleUpdateStockInputChange}
            placeholder="Markup Price"
          />
          <input
            type="number"
            name="sellingPrice"
            value={updateStock.sellingPrice}
            onChange={handleUpdateStockInputChange}
            placeholder="Selling Price"
          />
          <button style={{ background: "grey" }} onClick={updateProduct}>
            Update Product
          </button>
          <button
            style={{ background: "lightcoral" }}
            onClick={() => {
              setIsEditing(false);
              setUpdateStock({
                _id: "",
                productName: "",
                quantity: "",
                price: "",
                markupPrice: "",
                sellingPrice: "",
              });
              setStockAction("stock list");
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else if (stockAction === "stock list") {
      return (
        <table
          border="1"
          style={{
            borderCollapse: "collapse",
            width: "95%",
            margin: "20px",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th>No.</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Markup Price</th>
              <th>Selling Price</th>
              <th>Total (Selling × Qty)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.markupPrice}</td>
                <td>{product.sellingPrice}</td>
                <td>
                  {Number(product.quantity) * Number(product.sellingPrice)}
                </td>
                <td>
                  <div className="actions-btn">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return null;
  };

  // Main content renderer (Client, Stock, Sale, Document)
  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
        return (
          <>
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BarChart
                dataset={dataset}
                xAxis={[{ dataKey: "month" }]}
                series={[
                  { dataKey: "london", label: "London", valueFormatter },
                  { dataKey: "paris", label: "Paris", valueFormatter },
                  { dataKey: "newYork", label: "New York", valueFormatter },
                ]}
                {...chartSetting}
              />
            </div>
            <table border="1" cellpadding="8" cellspacing="0">
              <tr>
                <th>no of items</th>
                <th>monthly sales</th>
                <th>Yearly sales</th>
                <th>Total sales</th>
                <th>Total profits</th>
              </tr>
              <tr>
                <td>10</td>
                <td>19000</td>
                <td>50000</td>
                <td>290</td>
                <td>534390</td>
              </tr>
            </table>
          </>
        );
      case "Client":
        return (
          <>
            <Client
              clientAction={clientAction}
              setClientAction={setClientAction}
              newClient={newClient}
              handleInputChange={handleInputChange}
              submitNewClient={submitNewClient}
              clientsList={clientsList}
            />
          </>
        );

      case "Stock":
        return (
          <>
            <Stock
              setStockAction={setStockAction}
              renderStockContent={renderStockContent}
            />
          </>
        );
      case "Sale":
        return <Sale />;
      case "Document":
        return (
          <>
            <Document />
          </>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <button
          className="client-btn"
          onClick={() => {
            setSelectedSection("Dashboard");
            setClientAction(null);
            setStockAction(null);
          }}
        >
          DashBoard
        </button>
        <button
          className="client-btn"
          onClick={() => {
            setSelectedSection("Client");
            setClientAction(null);
            setStockAction(null);
          }}
        >
          Client
        </button>
        <button
          className="client-btn"
          onClick={() => {
            setSelectedSection("Stock");
            setClientAction(null);
            setStockAction(null);
          }}
        >
          Stock
        </button>
        <button
          className="client-btn"
          onClick={() => {
            setSelectedSection("Sale");
            setClientAction(null);
            setStockAction(null);
          }}
        >
          Sale
        </button>
        <button
          className="client-btn"
          onClick={() => setSelectedSection("Document")}
        >
          Document
        </button>
      </div>
      <div className="dashboard-right">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
