import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [bets, setBets] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const eventsRes = await fetch(`${API}/api/events`);
      const eventsData = await eventsRes.json();
      setEvents(eventsData);

      const betsRes = await fetch(`${API}/api/bets`);
      const betsData = await betsRes.json();
      setBets(betsData);

      const usersRes = await fetch(`${API}/api/users`);
      const usersData = await usersRes.json();
      setUsers(usersData);

    } catch (err) {
      setMessage("Erreur lors du chargement des données");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeEvent = async (eventId, winner) => {
    try {
      const res = await fetch(`${API}/api/events/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, winner })
      });

      const data = await res.json();
      setMessage(data.message);
      fetchData();
    } catch {
      setMessage("Erreur serveur lors de la clôture");
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
            {e.teamA} vs {e.teamB} — Status: {e.status} — Winner: {e.winner || "?"}
            <br />
            <button onClick={() => closeEvent(e._id, "A")}>Clôturer {e.teamA}</button>
            <button onClick={() => closeEvent(e._id, "B")} style={{ marginLeft: 10 }}>
              Clôturer {e.teamB}
            </button>
          </li>
        ))}
      </ul>

      <h3>💵 Paris</h3>
      <ul>
        {bets.map(b => (
          <li key={b._id}>
            User: {b.userId?.username || b.userId} |
            Match: {b.eventId?.teamA || b.eventId} |
            Choix: {b.choice} |
            Montant: {b.amount}$ |
            Status: {b.status}
          </li>
        ))}
      </ul>

      <h3>👤 Utilisateurs</h3>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.username} — Solde: {u.balance} $
          </li>
        ))}
      </ul>
    </div>
  );
}
