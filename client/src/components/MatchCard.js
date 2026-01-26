import React, { useState } from "react";
import API from "../api";

export default function MatchCard({ event }) {
  const [amount, setAmount] = useState("");

  const placeBet = async (choice) => {
    try {
      const token = localStorage.getItem("token"); // JWT
      await API.post("/bets/place", { eventId: event._id, amount, choice }, {
        headers: { Authorization: token }
      });
      alert("Pari placé !");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{event.teamA} vs {event.teamB}</h3>
      <p>Cotes : {event.oddsA} / {event.oddsB}</p>
      <input 
        type="number" 
        placeholder="Montant" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
      />
      <button onClick={() => placeBet("A")}>Parier sur {event.teamA}</button>
      <button onClick={() => placeBet("B")}>Parier sur {event.teamB}</button>
    </div>
  );
}
