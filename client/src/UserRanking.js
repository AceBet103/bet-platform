import { useEffect, useState } from "react";

export default function UserRanking() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/ranking")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Ranking error:", err));
  }, []);

  return (
    <div>
      <h3>Classement</h3>
      <ol>
        {users.map(u => (
          <li key={u._id}>
            {u.username || u._id} — {u.balance}$
          </li>
        ))}
      </ol>
    </div>
  );
}
