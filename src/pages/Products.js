import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../AuthContext"; // Import AuthContext

const Products = () => {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Unauthorized access. Please login.");
      return;
    }

    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data.products))
      .catch(() => setError("Failed to load products."));
  }, [token]);

  const handleQuantityChange = (productID, value) => {
    setQuantity((prev) => ({ ...prev, [productID]: value }));
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      setError("You must be logged in to add items to the cart.");
      return;
    }

    const selectedQuantity = quantity[product.ProductID] || 1;
    const cartData = {
      ProductID: product.ProductID,
      Quantity: selectedQuantity,
    };

    try {
      if (!token) {
        setError("Unauthorized request.");
        return;
      }

      console.log("Sending to Cart API:", cartData);
      console.log("Token:", `Bearer ${token}`); 

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        cartData,
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      if (response.data.status === "success") {
        setSuccess("Item added to cart!");
        setTimeout(() => navigate("/cart"), 1000);
      } else {
        setError("Failed to add item to cart.");
      }
    } catch (err) {
      console.error(
        "Add to Cart Error:",
        err.response ? err.response.data : err
      );
      setError("Error adding item to cart.");
    }

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div className="container my-5 p-4 rounded shadow-lg" style={styles.card}>
        <h2 className="text-center fw-bold mb-4" style={styles.title}>
          Our Products
        </h2>

        {success && <p className="alert alert-success text-center">{success}</p>}
        {error && <p className="alert alert-danger text-center">{error}</p>}

        <div className="row">
          {products.map((p) => (
            <div key={p.ProductID} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm p-3 border-0" style={styles.productCard}>
                <div className="card-body text-center">
                  <h5 className="fw-bold" style={styles.productName}>{p.ProductName}</h5>
                  <p className="text-muted">{p.Description}</p>
                  <p className="fw-bold text-danger fs-5" style={styles.price}>{parseFloat(p.Price).toLocaleString()} บาท</p>

                  <div className="mb-3">
                    <label className="form-label" style={styles.label}>Quantity:</label>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity[p.ProductID] || 1}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(p.ProductID, parseInt(e.target.value))
                      }
                    />
                  </div>

                  <button
                    className="btn w-100"
                    style={styles.button}
                    onClick={() => handleAddToCart(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa", // White background
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0",
    overflow: "auto", // Enable full page scrolling
  },
  card: {
    backgroundColor: "#ffffff", // White card background
    color: "#000", // Black text
    maxWidth: "1000px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#007bff", // Blue title
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  productCard: {
    backgroundColor: "#ffffff", // White product card
    borderRadius: "10px",
    padding: "15px",
    color: "#000",
  },
  productName: {
    color: "#007bff", // Blue product name
  },
  price: {
    color: "#dc3545", // Red price text
  },
  label: {
    color: "#000", // Black label text
  },
  button: {
    backgroundColor: "#28a745", // Green button for Add to Cart
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }
};

export default Products;
