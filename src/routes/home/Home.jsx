import React from "react";
import "./Home.css";
export default function Home() {
  return (
    <div>
      <header>
        <div className="navbar ">
          <h2>Product</h2>
        </div>
        <div className="nav-search ">
          <div className="search">
            <input placeholder="Search Product.." className="search-input" />
            <div className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
        </div>

        <div className="panel ">
          <div className="first border">
            <p>All Categories</p>
          </div>
          <div className="second border">
            <p>Text-Book</p>
          </div>
          <div className="third border">
            <p>Literature</p>
          </div>
          <div className="fourth border">
            <p>Geography</p>
          </div>
        </div>
      </header>

      <div className="product-section">
        <div className="box1 box">
          <div className="box-content">
            <h2>className-10 Science Book</h2>
            <div
              className="box-img"
              style={{ backgroundImage: "url('/box1.jpg')" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
