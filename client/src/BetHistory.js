import { useEffect, useState } from "react";

export default function BetHistory({ userId }) {

  const [bets, setBets] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userId}/bets`)
      .then(res => res.json())
      .then(data => setBets(data))
      .catch(err => console.error("History error:", err));
  }, [userId]);

  return (
    <div>
      <h3>Historique des paris</h3>
      <ul>
        {bets.map(b => (
          <li key={b._id}>
            {b.choice} | {b.amount}$ | Gain potentiel: {b.potentialWin.toFixed(2)}$
          </li>
        ))}
      </ul>
    </div>
  );
}
