import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="container text-center text-white">
          <h1 className="hero-title">ยินดีต้อนรับสู่ NXShop</h1>
          <p className="hero-subtitle">แหล่งรวมสินค้าคุณภาพในราคาสุดพิเศษ</p>
        </div>
      </div>
      <div className="card-container">
        <Link to="/products" className="card-link">
          <div className="card">
            <h3>🛍️ สินค้าของเรา</h3>
            <p>เลือกซื้อสินค้าหลากหลายแบบที่คุณต้องการ</p>
          </div>
        </Link>
        <Link to="/orders" className="card-link">
          <div className="card">
            <h3>📦 ออเดอร์ของฉัน</h3>
            <p>ตรวจสอบประวัติการสั่งซื้อและออเดอร์ที่ยังไม่ได้รับ</p>
          </div>
        </Link>
        <Link to="/cart" className="card-link">
          <div className="card">
            <h3>🛒 ตะกร้าสินค้า</h3>
            <p>ดูสินค้าที่คุณเลือกไว้ในตะกร้า</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
