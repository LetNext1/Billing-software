import React, { useState, useRef } from "react";


const Sale = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");

  const billRef = useRef();

  // Fetch products
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/v1/products/search?name=${term}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // Add product
  const addProductToBill = (product) => {
    const exists = selectedProducts.find((p) => p._id === product._id);
    if (exists) return;

    setSelectedProducts([
      ...selectedProducts,
      {
        ...product,
        unit: "",
        qty: 1,
        total: Number(product.price),
      },
    ]);
    setSearchTerm("");
    setSearchResults([]);
  };

  // Update product fields
  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;

    if (field === "qty") {
      const qty = Number(value);
      const price = Number(updatedProducts[index].price);
      updatedProducts[index].total = qty * price;
    }

    setSelectedProducts(updatedProducts);
  };

  // Grand total
  const grandTotal = selectedProducts.reduce(
    (sum, product) => sum + Number(product.total),
    0
  );

  // Generate PDF using browser's print functionality
  const generatePDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Format date
    const formattedDate = billDate ? new Date(billDate).toLocaleDateString("en-GB") : "N/A";
    
    // Create the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - ${billNo || 'Draft'}</title>
          <style>
            @media print {
              @page {
                margin: 0.5in;
                size: A4;
              }
              body { 
                font-family: Arial, sans-serif; 
                font-size: 12px; 
                color: #000; 
                background: white;
                margin: 0;
                padding: 20px;
                -webkit-print-color-adjust: exact;
              }
            }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              color: #000; 
              background: white;
              margin: 0;
              padding: 20px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h2 {
              margin: 0 0 10px 0;
              font-size: 24px;
              font-weight: bold;
            }
            .header p {
              margin: 5px 0;
              font-size: 14px;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              font-size: 12px;
            }
            hr {
              border: none;
              border-top: 2px solid #000;
              margin: 15px 0;
            }
            .customer-info {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .info-item {
              flex: 1;
              margin-right: 20px;
            }
            .info-item:last-child {
              margin-right: 0;
            }
            .info-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .info-value {
              border-bottom: 1px solid #000;
              display: inline-block;
              min-width: 150px;
              padding: 2px 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .grand-total {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: right;
            }
            .signature-line {
              border-top: 1px solid #000;
              display: inline-block;
              padding-top: 5px;
              min-width: 200px;
              text-align: center;
              margin-top: 60px;
            }
            .no-print {
              display: none;
            }
            @media screen {
              .no-print {
                display: block;
                text-align: center;
                margin: 20px 0;
              }
              .no-print button {
                padding: 10px 20px;
                margin: 5px;
                font-size: 14px;
                cursor: pointer;
              }
              .print-btn {
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
              }
              .close-btn {
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Rajan Store</h2>
            <p>Gobichettipalayam, Erode, TamilNadu-638476</p>
            <div class="header-info">
              <span>Ph: +91 794736782</span>
              <span>GST No: 634297363IN</span>
            </div>
            <hr>
          </div>

          <div class="customer-info">
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Customer Name:</span>
                <span class="info-value">${customerName || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Customer Number:</span>
                <span class="info-value">${customerNumber || 'N/A'}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Bill No:</span>
                <span class="info-value">${billNo || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item Name</th>
                <th>Units</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedProducts.length > 0 ? selectedProducts.map((product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.productName || 'N/A'}</td>
                  <td>${product.unit || 'N/A'}</td>
                  <td>${product.qty || 'N/A'}</td>
                  <td>₹${product.price || '0'}</td>
                  <td>₹${product.total ? product.total.toFixed(2) : '0.00'}</td>
                </tr>
              `).join('') : '<tr><td colspan="6">No items added</td></tr>'}
              ${selectedProducts.length > 0 && grandTotal > 0 ? `
                <tr class="grand-total">
                  <td colspan="5">Grand Total</td>
                  <td>₹${grandTotal.toFixed(2)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <div class="footer">
            <p>Thank you for your business!</p>
            <div class="signature-line">
              Authorized Signature
            </div>
          </div>

          <div class="no-print">
            <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Focus and print
    printWindow.focus();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Test function to check if data is being captured
  const testDataCapture = () => {
    console.log('Customer Name:', customerName);
    console.log('Customer Number:', customerNumber);
    console.log('Bill No:', billNo);
    console.log('Bill Date:', billDate);
    console.log('Selected Products:', selectedProducts);
    console.log('Grand Total:', grandTotal);
    
    alert(`Data captured:
Customer: ${customerName || 'Not set'}
Bill No: ${billNo || 'Not set'}
Products: ${selectedProducts.length} items
Total: ₹${grandTotal.toFixed(2)}`);
  };

  return (
    <div className="sale-section">
      {/* Visible UI */}
      <div ref={billRef} style={{ padding: "20px", background: "#fff", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", margin: "10px 0", fontSize: "24px" }}>Rajan Store</h2>
        <p style={{ textAlign: "center", margin: "5px 0", fontSize: "14px" }}>
          Gobichettipalayam, Erode, TamilNadu-638476
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", fontSize: "12px" }}>
          <p>Ph: +91 794736782</p>
          <p>GST No: 634297363IN</p>
        </div>
        <hr style={{ margin: "15px 0" }} />

        <div className="cus-field" style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ 
              padding: "8px", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              fontSize: "12px",
              flex: 1
            }}
          />
          <input
            type="text"
            placeholder="Customer Number"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            style={{ 
              padding: "8px", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              fontSize: "12px",
              flex: 1
            }}
          />
        </div>

        <div className="inputs-div" style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <input
            type="number"
            placeholder="Bill No"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            style={{ 
              padding: "8px", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              fontSize: "12px",
              flex: 1
            }}
          />
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            style={{ 
              padding: "8px", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              fontSize: "12px",
              flex: 1
            }}
          />
        </div>

        <div className="items-container">
          <input
            type="text"
            placeholder="Search product"
            value={searchTerm}
            onChange={(e) => {
              const term = e.target.value;
              setSearchTerm(term);
              handleSearch(term);
            }}
            style={{ 
              width: "80%", 
              padding: "8px", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              fontSize: "12px",
              marginBottom: "10px"
            }}
          />

          {searchResults.length > 0 && (
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              border: "1px solid #ccc", 
              borderRadius: "4px",
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "white",
              marginBottom: "10px"
            }}>
              {searchResults.map((product) => (
                <li
                  key={product._id}
                  onClick={() => addProductToBill(product)}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    fontSize: "12px",
                    backgroundColor: "white"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                >
                  {product.productName} - ₹{product.price}
                </li>
              ))}
            </ul>
          )}

          <table
            border="1"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "20px",
              fontSize: "12px"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "8px", textAlign: "center" }}>S.No</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Item Name</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Units</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Qty</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Rate</th>
                <th style={{ padding: "8px", textAlign: "center" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={product._id}>
                  <td style={{ padding: "6px", textAlign: "center" }}>{index + 1}</td>
                  <td style={{ padding: "6px", textAlign: "center" }}>{product.productName}</td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    <select
                      value={product.unit}
                      onChange={(e) =>
                        handleInputChange(index, "unit", e.target.value)
                      }
                      style={{ 
                        padding: "4px", 
                        border: "1px solid #ccc", 
                        fontSize: "11px",
                        width: "100%"
                      }}
                    >
                      <option value="">Select</option>
                      <option value="kg">Kg</option>
                      <option value="lit">Litre</option>
                      <option value="piece">Piece</option>
                      <option value="pack">Pack</option>
                    </select>
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    <input
                      type="number"
                      value={product.qty}
                      onChange={(e) =>
                        handleInputChange(index, "qty", e.target.value)
                      }
                      style={{ 
                        padding: "4px", 
                        border: "1px solid #ccc", 
                        fontSize: "11px",
                        width: "60px",
                        textAlign: "center"
                      }}
                    />
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>₹{product.price}</td>
                  <td style={{ padding: "6px", textAlign: "center" }}>₹{product.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display Grand Total */}
        {grandTotal > 0 && (
          <div style={{ textAlign: "right", marginTop: "20px", fontSize: "16px", fontWeight: "bold" }}>
            Grand Total: ₹{grandTotal.toFixed(2)}
          </div>
        )}
      </div>

      <div style={{  marginTop: "20px" }}>
        <button 
          onClick={testDataCapture}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
            // marginRight: "1px"
          }}
        >
          Test Data Capture
        </button>
        
        <button 
          onClick={generatePDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Generate Bill (Print/PDF)
        </button>
      </div>
    </div>
  );
};

export default Sale;