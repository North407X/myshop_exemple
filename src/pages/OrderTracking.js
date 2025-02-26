import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const fetchPaidOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paidOrders = response.data.orders.filter(
        (order) => order.Status.toLowerCase() === "paid"
      );

      if (paidOrders.length === 0) {
        setError("No paid orders available for tracking.");
      } else {
        setOrders(paidOrders);
        setError("");
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError("Failed to load orders.");
    }
  };

  const fetchTrackingDetails = async (selectedId) => {
    if (!selectedId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/order-tracking/${selectedId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.TrackingID) {
        setTrackingData(response.data);
        setError("");
      } else {
        setError("Tracking data not found.");
        setTrackingData(null);
      }
    } catch (err) {
      console.error("Fetch Tracking Error:", err);
      setError("Tracking details not found for this order.");
      setTrackingData(null);
    }
  };

  const uniqueOrders = Array.from(
    new Set(orders.map((order) => order.OrderID))
  ).map((orderId) => orders.find((order) => order.OrderID === orderId));

  return (
    <div style={styles.container}>
      <div className="container my-5 p-4 rounded shadow-lg bg-light" style={styles.card}>
        <h2 className="text-center text-primary fw-bold mb-4">
          <span style={styles.title}>Order Tracking</span>
        </h2>

        {error && <p className="alert alert-danger text-center">{error}</p>}

        <div className="mb-4">
          <label className="fw-bold" style={{ color: "#007bff" }}>
            Select Paid Order:
          </label>
          <select
            className="form-select bg-white text-dark"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              fetchTrackingDetails(e.target.value);
            }}
          >
            <option value="">-- Select Order --</option>
            {uniqueOrders.map((order) => (
              <option key={order.OrderID} value={order.OrderID}>
                Order {order.OrderID} - {new Date(order.OrderDate).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {trackingData && (
          <div className="p-3 mb-4 rounded shadow-sm" style={styles.trackingDetails}>
            <h4 className="text-center text-primary fw-bold">Tracking Information</h4>
            <p className="mb-1" style={{ color: "#007bff" }}>
              <strong>Tracking ID:</strong> {trackingData.TrackingID}
            </p>
            <p className="mb-1" style={{ color: "#007bff" }}>
              <strong>Order ID:</strong> {trackingData.OrderID}
            </p>
            <p className="mb-1" style={{ color: "#007bff" }}>
              <strong>Status:</strong>{" "}
              <span
                className="badge ms-2"
                style={getStatusStyle(trackingData.Status)}
              >
                {trackingData.Status}
              </span>
            </p>
            <p className="mb-1" style={{ color: "#007bff" }}>
              <strong>Updated At:</strong> {new Date(trackingData.UpdatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => ({
  backgroundColor: status.toLowerCase() === "shipped" ? "#28a745" : "#ffc107",
  color: "white",
  padding: "8px 12px",
  borderRadius: "5px",
});

const styles = {
  container: {
    backgroundColor: "#ffffff", // เปลี่ยนเป็นสีขาว
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0",
  },
  card: {
    backgroundColor: "#f8f9fa", // เปลี่ยนเป็นสีเทาอ่อน
    color: "#333",
    maxWidth: "600px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#007bff", // เปลี่ยนเป็นสีน้ำเงิน
    fontSize: "2rem",
    fontWeight: "bold",
  },
  trackingDetails: {
    backgroundColor: "#e9ecef", // เปลี่ยนเป็นสีเทาอ่อน
    borderRadius: "10px",
    padding: "15px",
    color: "#333",
  },
};

export default OrderTracking;