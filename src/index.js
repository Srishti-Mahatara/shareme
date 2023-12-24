import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Start from "./routes/start/Start";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom/";
import Mobile from "./routes/mobile/Mobile";
import "./config/firebase";
import Register from "./routes/register/Register";
import Home from "./routes/home/Home";
import Product from "./routes/product/Product";
import UserPage from "./routes/user/User";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <React.StrictMode>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/mobile" element={<Mobile />} />
          <Route path="/register/:mobile" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
    <ToastContainer className={"topOn"} position="bottom-left" />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
