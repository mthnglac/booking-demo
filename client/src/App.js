import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Photographers from "./pages/photographers";
import "./App.scss";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="photographers" element={<Photographers />} />
    </Routes>
  );
}
