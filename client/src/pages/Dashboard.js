import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Notification from "../components/Notification";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [serverMessage, setServerMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance);
        setServerMessage("Profil chargé avec succès");
      } else {
        setServerMessage("Session expirée, reconnecte-toi");
      }
    } catch (err) {
      console.error(err);
      setServerMessage("Erreur serveur");
    }
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/user/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      setTransactions(data);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfile();
  fetchTransactions();
  fetchEvents();
}, []);

const depositMoney = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ amount: Number(depositAmount) })
  });

  const data = await res.json();

  if (res.ok) {
    setBalance(data.balance);
    setDepositAmount("");
    alert("Dépôt réussi !");
  } else {
    alert(data.message);
  }
};

const withdrawMoney = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ amount: Number(withdrawAmount) })
  });

  const data = await res.json();

  if (res.ok) {
    setBalance(data.balance);
    setWithdrawAmount("");
    alert("Retrait réussi !");
  } else {
    alert(data.message);
  }
};

const placeBet = async (eventId, team) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ eventId, team, amount: Number(betAmount) })
  });

  const data = await res.json();

  if (res.ok) {
    setBalance(data.balance);
    setBetAmount("");
    alert("Pari placé avec succès !");
  } else {
    alert(data.message);
  }
};

return (
  <>
    <Notification message={serverMessage} />
    <div>
      <h2>Dashboard</h2>
    {user?.role === "admin" && (
  <button onClick={() => window.location.href = "/admin"}>
    Go to Admin Panel
  </button>
)}
    <p>Welcome {user?.username}</p>
    <p>{serverMessage}</p>

    <h3>Solde: ${balance}</h3>

    <div style={{ marginTop: 20 }}>
      <h4>Ajouter de l'argent</h4>
      <input
        type="number"
        placeholder="Montant"
        value={depositAmount}
        onChange={e => setDepositAmount(e.target.value)}
      />
      <button onClick={depositMoney}>Déposer</button>
    </div>

    <div style={{ marginTop: 20 }}>
      <h4>Retirer de l'argent</h4>
      <input
        type="number"
        placeholder="Montant"
        value={withdrawAmount}
        onChange={e => setWithdrawAmount(e.target.value)}
      />
      <button onClick={withdrawMoney}>Retirer</button>
    </div>

    <br />

    <button
      onClick={() => {
        logout();
        localStorage.clear();
        window.location.href = "/";
      }}
    >
      Logout
    </button>
<h3>Événements disponibles</h3>

<input
  type="number"
  placeholder="Montant du pari"
  value={betAmount}
  onChange={e => setBetAmount(e.target.value)}
/>

{events.map(event => (
  <div key={event._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
    <h4>{event.teamA} vs {event.teamB}</h4>
    <p>Cote A: {event.oddsA} | Cote B: {event.oddsB}</p>

    <button onClick={() => placeBet(event._id, "A")}>Parier sur A</button>
    <button onClick={() => placeBet(event._id, "B")}>Parier sur B</button>
  </div>
))}

    <h3>Historique des transactions</h3>
    <ul>
      {transactions.map((t) => (
        <li key={t._id}>
          {t.type.toUpperCase()} — ${t.amount} — {new Date(t.createdAt).toLocaleString()}
        </li>
      ))}
    </ul>
    </div>
  </>
);
}
