import React, { useState } from "react";

export default function Subform() {
  const [organizationId, setOrganizationId] = useState("");
  const [zone, setZone] = useState("");
  const [itemType, setItemType] = useState("");
  const [distance, setDistance] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/calculate-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: organizationId,
          zone: zone,
          itemType: itemType,
          totalDistance: parseFloat(distance),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTotalPrice(data.total_price);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <header
        className="p-3 mb-3 text-center"
        style={{ backgroundColor: "#f0f0f0" }}
      >
        <h1
          style={{
            borderBottom: "2px solid black",
            display: "inline-block",
            paddingBottom: "10px",
          }}
        >
          Viga Foods Pvt. Ltd
        </h1>
        <h2>Estimated Price Calculation</h2>
      </header>
      <div className="container-fluid p-5 border rounded">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="organizationId" className="form-label">
              Organization ID:
            </label>
            <input
              type="text"
              id="organizationId"
              className="form-control bg-light"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="zone" className="form-label">
              Zone:
            </label>
            <input
              type="text"
              id="zone"
              className="form-control bg-light"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="itemType" className="form-label">
              Item Type:
            </label>
            <input
              type="text"
              id="itemType"
              className="form-control bg-light"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="distance" className="form-label">
              Total Distance (in km):
            </label>
            <input
              type="number"
              id="distance"
              className="form-control bg-light"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Calculate Price
          </button>
        </form>
        {totalPrice !== null && (
          <div className="mt-3">
            <h5 className="text-center">Total Price: {totalPrice}</h5>
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}
