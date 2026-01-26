import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ balance }) {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "10px", color: "#fff" }}>Home</Link>
      <Link to="/profile" style={{ marginRight: "10px", color: "#fff" }}>Profile</Link>
      <span style={{ float: "right" }}>Balance: ${balance}</span>
    </nav>
  );
}
