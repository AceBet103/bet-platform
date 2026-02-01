import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [betAmount, setBetAmount] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Erreur fetch events:", err));
  }, []);

  const placeBet = async (eventId, choice) => {
    if (!token) {
      alert("Tu dois être connecté pour parier");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId,
          choice,
          amount: Number(betAmount)
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Pari placé avec succès !");
        setBetAmount("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎮 Événements disponibles</h2>

      <input
        type="number"
        placeholder="Montant du pari"
        value={betAmount}
        onChange={e => setBetAmount(e.target.value)}
        style={{ marginBottom: "15px" }}
      />

      {events.map(event => (
        <div key={event._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <h4>{event.teamA} vs {event.teamB}</h4>
          <p>Cote A: {event.oddsA} | Cote B: {event.oddsB}</p>

          <button onClick={() => placeBet(event._id, "A")}>
            Parier sur {event.teamA}
          </button>

          <button
            onClick={() => placeBet(event._id, "B")}
            style={{ marginLeft: "10px" }}
          >
            Parier sur {event.teamB}
          </button>
        </div>
      ))}
    </div>
  );
}
