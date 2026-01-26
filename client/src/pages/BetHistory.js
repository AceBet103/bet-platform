import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

export default function BetHistory() {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    fetchWithAuth("http://localhost:5000/api/user/bets")
      .then(res => res.json())
      .then(data => setBets(data));
  }, []);

  return (
    <div>
      <h2>Bet History</h2>
      {bets.map(bet => (
        <div key={bet._id}>
          Event: {bet.eventId} | Choice: {bet.choice} | Amount: ${bet.amount} | Result: {bet.result}
        </div>
      ))}
    </div>
  );
}
