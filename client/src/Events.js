import { useEffect, useState } from "react";
import UserRanking from "./UserRanking";
import BetHistory from "./BetHistory";

export default function Events() {
  const [events, setEvents] = useState([]);
  const userId = "6961a8e157a36e1fcbc63046"; // temporaire pour test

  useEffect(() => {
    fetch("https://bet-platform.onrender.com/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Fetch events error:", err));
  }, []);

  const placeBet = async (eventId, choice) => {
    try {
      const res = await fetch("https://bet-platform.onrender.com/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, eventId, choice, amount: 10 })
      });

      const data = await res.json();
      alert(data.message || "Bet placed!");
    } catch (err) {
      console.error("Bet error:", err);
      alert("Error placing bet");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Events</h2>

      {events.length === 0 && <p>Loading events...</p>}

      {events.map(event => (
        <div
          key={event._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h3>{event.teamA} vs {event.teamB}</h3>
          <p>Odds A: {event.oddsA}</p>
          <p>Odds B: {event.oddsB}</p>

          <button onClick={() => placeBet(event._id, "A")}>
            Bet on {event.teamA}
          </button>

          <button
            onClick={() => placeBet(event._id, "B")}
            style={{ marginLeft: "10px" }}
          >
            Bet on {event.teamB}
          </button>
        </div>
      ))}
    </div>
  );
}
