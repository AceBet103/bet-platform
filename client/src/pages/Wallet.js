import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function Wallet() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const loadTx = async () => {
    const data = await apiFetch(`/api/transactions/${user._id}`);
    setTransactions(data);
  };

  useEffect(() => { loadTx(); }, []);

  const deposit = async () => {
    await apiFetch("/api/transactions/deposit", {
      method: "POST",
      body: JSON.stringify({ userId: user._id, amount: Number(amount) })
    });
    loadTx();
  };

  const withdraw = async () => {
    await apiFetch("/api/transactions/withdraw", {
      method: "POST",
      body: JSON.stringify({ userId: user._id, amount: Number(amount) })
    });
    loadTx();
  };

  return (
    <div>
      <h2>💰 Wallet</h2>

      <input
        type="number"
        placeholder="Montant"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={deposit}>Déposer</button>
      <button onClick={withdraw}>Retirer</button>

      <h3>Historique</h3>
      <ul>
        {transactions.map(tx => (
          <li key={tx._id}>
            {tx.type} — {tx.amount}$ — {new Date(tx.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
