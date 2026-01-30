import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [bets, setBets] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const eventsData = await apiFetch("/api/events");
      const betsData = await apiFetch("/api/bets");
      const usersData = await apiFetch("/api/users");

      setEvents(eventsData);
      setBets(betsData);
      setUsers(usersData);
    } catch {
      setMessage("Erreur lors du chargement");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeEvent = async (eventId, winner) => {
    try {
      const data = await apiFetch(`/api/events/${eventId}/resolve`, {
        method: "POST",
        body: JSON.stringify({ winner })
      });

      setMessage(data.message);
      fetchData();
    } catch {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Dashboard</h2>
      {message && <p>{message}</p>}

      <h3>⚽ Événements</h3>
      <ul>
        {events.map(e => (
          <li key={e._id}>
            {e.teamA} vs {e.teamB} — {e.status}
            <br />
            <button onClick={() => closeEvent(e._id, "A")}>Winner A</button>
            <button onClick={() => closeEvent(e._id, "B")}>Winner B</button>
          </li>
        ))}
      </ul>

      <h3>💵 Paris</h3>
      <ul>
        {bets.map(b => (
          <li key={b._id}>
            {b.userId?.username} → {b.eventId?.teamA} vs {b.eventId?.teamB} | {b.choice} | {b.amount}$
          </li>
        ))}
      </ul>

      <h3>👤 Utilisateurs</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.username} — {u.balance}$</li>
        ))}
      </ul>
    </div>
  );
}
