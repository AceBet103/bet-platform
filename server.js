require("dotenv").config();

console.log("Server file loaded");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

/* ---------- MODELS ---------- */
const Event = require("./models/event");
const Bet = require("./models/Bet");
const User = require("./models/User");
const Transaction = require("./models/Transaction"); // ✅ UNE SEULE FOIS

/* ---------- ROUTES ---------- */
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

/* ---------- MIDDLEWARE ---------- */
const auth = require("./middleware/auth");
const admin = require("./middleware/admin");

const app = express();

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://bet-platform-pearl.vercel.app"
  ]
}));

app.use(express.json());

/* ---------- ROUTE REGISTRATION ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

/* ---------- DATABASE ---------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/bet-platform")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* ---------- GET OPEN EVENTS ---------- */
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "open" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- USER BET HISTORY ---------- */
app.get("/api/user/:id/bets", async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.params.id });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- USER RANKING ---------- */
app.get("/api/users/ranking", async (req, res) => {
  try {
    const users = await User.find().sort({ balance: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- PLACE BET ---------- */
app.post("/api/bets", async (req, res) => {
  try {
    const { userId, eventId, choice, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.balance < amount)
      return res.status(400).json({ message: "Solde insuffisant" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.totalA ||= 0;
    event.totalB ||= 0;

    if (choice === "A") event.totalA += amount;
    else event.totalB += amount;

    recalcOdds(event);

    const odds = choice === "A" ? event.oddsA : event.oddsB;
    const potentialWin = odds * amount;

    const bet = new Bet({
      userId,
      eventId,
      choice,
      amount,
      potentialWin,
      status: "open"
    });

    user.balance -= amount;

    await bet.save();
    await user.save();
    await event.save();

    // ✅ Transaction BET
    await Transaction.create({
      userId,
      type: "bet",
      amount
    });

    res.json({
      bet,
      balance: user.balance,
      oddsA: event.oddsA,
      oddsB: event.oddsB
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- ODDS ALGORITHM ---------- */
function recalcOdds(event) {
  const total = event.totalA + event.totalB;
  if (total === 0) return;

  const probA = event.totalA / total || 0.01;
  const probB = event.totalB / total || 0.01;
  const margin = 0.05;

  event.oddsA = Number(((1 / probA) * (1 - margin)).toFixed(2));
  event.oddsB = Number(((1 / probB) * (1 - margin)).toFixed(2));

  event.oddsHistory ||= [];
  event.oddsHistory.push({
    oddsA: event.oddsA,
    oddsB: event.oddsB,
    date: new Date()
  });
}

/* ---------- RESOLVE EVENT ---------- */
app.post("/api/events/:id/resolve", auth, admin, async (req, res) => {
  try {
    const { winner } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.winner = winner;
    event.status = "closed";
    await event.save();

    const bets = await Bet.find({ eventId: event._id });

    for (const bet of bets) {
      if (bet.choice === winner) {
        const odds = winner === "A" ? event.oddsA : event.oddsB;
        const win = bet.amount * odds;

        await User.findByIdAndUpdate(bet.userId, {
          $inc: { balance: win }
        });

        // ✅ Transaction WIN
        await Transaction.create({
          userId: bet.userId,
          type: "win",
          amount: win
        });

        bet.result = "win";
        bet.payout = win;
      } else {
        bet.result = "lose";
        bet.payout = 0;
      }

      await bet.save();
    }

    res.json({ message: "Event resolved and winnings paid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- ADMIN TEST ---------- */
app.get("/api/admin", auth, admin, (req, res) => {
  res.json({ message: "Welcome Admin", userId: req.userId });
});
/* ---------- GET ALL OPEN EVENTS ---------- */
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "open" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------- SERVER START ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});
