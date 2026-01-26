import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchWithAuth("http://localhost:5000/api/user/profile")
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <p>Balance: ${profile.balance}</p>
    </div>
  );
}
