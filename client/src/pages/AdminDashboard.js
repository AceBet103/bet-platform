import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWithAuth("http://localhost:5000/api/admin")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}
