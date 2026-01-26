import React, { useEffect, useState } from "react";
import API from "../api";
import MatchCard from "../components/MatchCard";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Pari Sportif</h1>
      {events.map(event => (
        <MatchCard key={event._id} event={event} />
      ))}
    </div>
  );
}
