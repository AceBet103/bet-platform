import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Fetch events error:", err));
  }, []);

  const placeBet = async (eventId, choice) => {
    try {
      const res = await fetch(`${API}/api/bets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, choice, amount: 10, userId: "USER_ID_ICI" })
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Bet error:", err);
    }
  };

  return (
    <div>
      <h2>Événements disponibles</h2>
      {events.map(e => (
        <div key={e._id}>
          <h3>{e.teamA} vs {e.teamB}</h3>
          <button onClick={() => placeBet(e._id, "A")}>Parier {e.teamA}</button>
          <button onClick={() => placeBet(e._id, "B")}>Parier {e.teamB}</button>
        </div>
      ))}
    </div>
  );
}
