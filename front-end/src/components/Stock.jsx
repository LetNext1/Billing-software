import React from 'react'

const Stock = ({setStockAction,renderStockContent}) => {
  return (
    <div>
      <div className="clients-button">
              <button
                className="clnt-dels-btn"
                onClick={() => setStockAction("Add product")}
              >
                Add Product
              </button>
              <button
                className="clnt-dels-btn"
                onClick={() => setStockAction("stock list")}
              >
                View Stock
              </button>
            </div>
            <div className="client-content">{renderStockContent()}</div>
    </div>
  )
}

export default Stock
