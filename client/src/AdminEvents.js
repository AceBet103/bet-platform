import { useEffect, useState } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(setEvents);
  }, []);

  const resolve = async (id, winner) => {
    await fetch(`http://localhost:5000/api/events/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner })
    });

    alert("Match résolu");
  };

  return (
    <div>
      <h2>Admin Matches</h2>
      {events.map(e => (
        <div key={e._id}>
          {e.teamA} vs {e.teamB}
          <button onClick={() => resolve(e._id, "A")}>Gagnant A</button>
          <button onClick={() => resolve(e._id, "B")}>Gagnant B</button>
        </div>
      ))}
    </div>
  );
}
