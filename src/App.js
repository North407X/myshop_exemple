import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import { AuthContext } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [shoppingCart, setShoppingCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        setShoppingCart(storedCart);
    }, []);

    const modifyCart = (newCart) => {
        setShoppingCart(newCart);
        localStorage.setItem("shoppingCart", JSON.stringify(newCart));
    };

    const addItemToCart = (product) => {
        let updatedCart;
        const foundItem = shoppingCart.find(item => item.ProductID === product.ProductID);

        if (foundItem) {
            updatedCart = shoppingCart.map(item =>
                item.ProductID === product.ProductID
                    ? { ...item, Quantity: item.Quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...shoppingCart, { ...product, Quantity: 1 }];
        }

        modifyCart(updatedCart);
    };

    const logoutHandler = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-custom shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-light" to="/">NX-Shop</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navMenu">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><Link className="nav-link text-light" to="/">Home</Link></li>
                            {user ? (
                                <>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/products">Products</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/orders">Orders</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/payment">History</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/cart">Cart ({shoppingCart.reduce((acc, item) => acc + item.Quantity, 0) || 0})</Link></li>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/order-tracking">Track Order</Link></li>
                                    <li className="nav-item">
                                        <button onClick={logoutHandler} className="btn btn-danger btn-sm ms-3">Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item"><Link className="nav-link text-light" to="/login">Login</Link></li>
                                    <li className="nav-item"><Link className="btn btn-light btn-rounded px-4 ms-3" to="/register">Sign Up</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products addItemToCart={addItemToCart} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart shoppingCart={shoppingCart} setShoppingCart={modifyCart} />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
