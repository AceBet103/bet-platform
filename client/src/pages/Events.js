import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiFetch("/api/events").then(setEvents);
  }, []);

  const placeBet = async (eventId, choice) => {
    await apiFetch("/api/bets", {
      method: "POST",
      body: JSON.stringify({ eventId, choice, amount: 10 })
    });

    alert("Pari placé !");
  };

  return (
    <div>
      <h2>Matchs disponibles</h2>
      {events.map(e => (
        <div key={e._id}>
          {e.teamA} vs {e.teamB}
          <button onClick={() => placeBet(e._id, "A")}>{e.teamA}</button>
          <button onClick={() => placeBet(e._id, "B")}>{e.teamB}</button>
        </div>
      ))}
    </div>
  );
}
