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

  const token = localStorage.getItem("token");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchProfile();
    fetchEvents();
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance);
      } else {
        setServerMessage("Session expirée");
      }
    } catch {
      setServerMessage("Erreur serveur");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/events`);
      const data = await res.json();
      if (res.ok) setEvents(data);
    } catch {
      console.log("Erreur events");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/${user._id}`);
      const data = await res.json();
      if (res.ok) setTransactions(data);
    } catch {
      console.log("Erreur transactions");
    }
  };

  /* ================= ACTIONS ================= */

  const depositMoney = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/deposit`, {
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
      fetchTransactions();
    } else alert(data.message);
  };

  const withdrawMoney = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/withdraw`, {
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
      fetchTransactions();
    } else alert(data.message);
  };

  const placeBet = async (eventId, team) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ eventId, choice: team, amount: Number(betAmount) })
    });

    const data = await res.json();
    if (res.ok) {
      setBalance(data.balance);
      setBetAmount("");
      fetchTransactions();
    } else alert(data.message);
  };

  /* ================= UI ================= */

  return (
    <>
      <Notification message={serverMessage} />

      <div style={{ padding: 20 }}>
        <h2>Dashboard</h2>

        {user?.role === "admin" && (
          <button onClick={() => (window.location.href = "/admin")}>
            Admin Panel
          </button>
        )}

        <p>Welcome {user?.username}</p>
        <h3>Solde: ${balance}</h3>

        {/* Deposit */}
        <h4>Déposer</h4>
        <input
          type="number"
          value={depositAmount}
          onChange={e => setDepositAmount(e.target.value)}
        />
        <button onClick={depositMoney}>OK</button>

        {/* Withdraw */}
        <h4>Retirer</h4>
        <input
          type="number"
          value={withdrawAmount}
          onChange={e => setWithdrawAmount(e.target.value)}
        />
        <button onClick={withdrawMoney}>OK</button>

        <button
          onClick={() => {
            logout();
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

        {/* EVENTS */}
        <h3>Événements</h3>
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
            <button onClick={() => placeBet(event._id, "A")}>Parier A</button>
            <button onClick={() => placeBet(event._id, "B")}>Parier B</button>
          </div>
        ))}

        {/* TRANSACTIONS */}
        <h3>Historique des Transactions</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Type</th>
              <th>Montant</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id}>
                <td style={{ color: t.type === "win" ? "green" : "red" }}>
                  {t.type}
                </td>
                <td>{t.amount} $</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
