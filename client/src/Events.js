import { useEffect, useState } from "react";
import UserRanking from "./UserRanking";
import BetHistory from "./BetHistory";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [balance, setBalance] = useState(0);

  const userId = "6961a8e157a36e1fcbc63046";

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Fetch events error:", err));
  }, []);

  const placeBet = async (eventId, choice) => {
    try {
      const res = await fetch("http://localhost:5000/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          choice,
          amount: 10
        })
      });

      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Place bet error:", err);
    }
  };

  return (
    <div>
      <h2>Événements</h2>
      <p>Solde: {balance}$</p>

      {events.map(e => (
        <div key={e._id} style={{ marginBottom: 15 }}>
          {e.teamA} vs {e.teamB}
          <br />
          Cotes: {e.oddsA} / {e.oddsB}
          <br />
          <button onClick={() => placeBet(e._id, "A")}>Parier A</button>
          <button onClick={() => placeBet(e._id, "B")} style={{ marginLeft: 10 }}>
            Parier B
          </button>
        </div>
      ))}

      <hr />

      <UserRanking />
      <BetHistory userId={userId} />
    </div>
  );
}
