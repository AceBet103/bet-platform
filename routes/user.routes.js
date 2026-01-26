const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");
const Bet = require("../models/Bet");
const Transaction = require("../models/Transaction"); // ✅ UNE SEULE FOIS

/* ---------- GET USER PROFILE ---------- */
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ---------- GET USER BETS ---------- */
router.get("/bets", auth, async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.userId });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ---------- DEPOSIT MONEY ---------- */
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Montant invalide" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { balance: amount } },
      { new: true }
    );

    // ✅ Transaction dépôt
    await Transaction.create({
      userId: req.userId,
      type: "deposit",
      amount
    });

    res.json({ message: "Dépôt réussi", balance: user.balance });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ---------- WITHDRAW MONEY ---------- */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Montant invalide" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    user.balance -= amount;
    await user.save();

    // ✅ Transaction retrait
    await Transaction.create({
      userId: req.userId,
      type: "withdraw",
      amount
    });

    res.json({ message: "Retrait réussi", balance: user.balance });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ---------- TRANSACTION HISTORY ---------- */
router.get("/transactions", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
