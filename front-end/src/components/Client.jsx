import React from 'react'

const Client = ({
    clientAction,
  setClientAction,
  newClient,
  handleInputChange,
  submitNewClient,
  clientsList,
}) => {
  return (
    <div>
      <div className="clients-button">
        <button
          className="clnt-dels-btn"
          onClick={() => setClientAction("new")}
        >
          New Client
        </button>
        <button
          className="clnt-dels-btn"
          onClick={() => setClientAction("existing")}
        >
          Existing Client
        </button>
      </div>

      <div className="client-content">
        {clientAction === "new" && (
          <div className="newClient-form">
            <input
              type="text"
              name="shopName"
              value={newClient.shopName}
              onChange={handleInputChange}
              placeholder="Shop Name"
            />
            <input
              type="text"
              name="name"
              value={newClient.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={newClient.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={newClient.phone}
              onChange={handleInputChange}
              placeholder="Phone"
            />
            <input
              type="text"
              name="location"
              value={newClient.location}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <button onClick={submitNewClient} style={{ background: "grey" }}>
              Add Client
            </button>
          </div>
        )}

        {clientAction === "existing" && (
          <table
            border="1"
            style={{
              borderCollapse: "collapse",
              width: "95%",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th>No.</th>
                <th>Shop Name</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {clientsList.length > 0 ? (
                clientsList.map((client, index) => (
                  <tr key={client._id}>
                    <td>{index + 1}</td>
                    <td>{client.shopName}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No clients found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Client
