import { useEffect, useState, useCallback } from "react";
import OddsChart from "../components/OddsChart";

export default function Admin() {
const [teamA, setTeamA] = useState("");
const [teamB, setTeamB] = useState("");
const [events, setEvents] = useState([]);
const [bets, setBets] = useState([]);

const token = localStorage.getItem("token");

const fetchEvents = useCallback(async () => {
  const res = await fetch("http://localhost:5000/api/admin/events", {
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  setEvents(data);
}, [token]);

useEffect(() => {
  fetchEvents();
}, [token, fetchEvents]);
const fetchBets = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user/bets", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  if (res.ok) setBets(data);
};

fetchBets();

  const createEvent = async () => {
    const res = await fetch("http://localhost:5000/api/admin/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ teamA, teamB })
    });

    const data = await res.json();
    alert(data.message);
    setTeamA("");
    setTeamB("");
    fetchEvents();
  };

  const resolveEvent = async (id, winner) => {
    await fetch(`http://localhost:5000/api/admin/event/${id}/resolve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ winner })
    });

    alert("Event closed");
    fetchEvents();
  };

  return (
  <div style={{ padding: 20 }}>
    <h2>Admin Panel</h2>

    <div style={{ marginBottom: 30 }}>
      <h3>Create Event</h3>
      <input
        placeholder="Team A"
        value={teamA}
        onChange={e => setTeamA(e.target.value)}
      />
<input
  placeholder="Team B"
  value={teamB}
  onChange={e => setTeamB(e.target.value)}
/>
<h3>Mes Paris</h3>
<ul>
  {bets.map(b => (
    <li key={b._id}>
      Event: {b.eventId} | Choix: {b.choice} | Mise: ${b.amount} | Résultat: {b.result || "pending"}
    </li>
  ))}
</ul>
<button onClick={createEvent}>Create Event</button>
    </div>

    <h3>All Events</h3>

    {events.length === 0 && <p>No events yet</p>}

    {events.map(e => (
      <div key={e._id} style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        background: e.status === "closed" ? "#f5f5f5" : "white"
      }}>
        <h4>{e.teamA} vs {e.teamB}</h4>
        <p>Status: <b>{e.status}</b></p>
        <p>Odds A: {e.oddsA} | Odds B: {e.oddsB}</p>
        <OddsChart history={e.oddsHistory} />

        {e.status === "open" && (
          <>
            <button onClick={() => resolveEvent(e._id, "A")}>
              Set Winner A
            </button>
            <button onClick={() => resolveEvent(e._id, "B")}>
              Set Winner B
            </button>
          </>
        )}

        {e.status === "closed" && <p>Winner: {e.winner}</p>}
      </div>
    ))}
  </div>
);
}