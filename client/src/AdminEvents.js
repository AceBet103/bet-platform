import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function AdminEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/events`)
      .then(res => res.json())
      .then(setEvents)
      .catch(err => console.error("Erreur chargement events:", err));
  }, []);

  return (
    <div>
      <h2>Gestion des événements</h2>
      {events.map(e => (
        <div key={e._id}>
          {e.teamA} vs {e.teamB} — {e.status}
        </div>
      ))}
    </div>
  );
}
