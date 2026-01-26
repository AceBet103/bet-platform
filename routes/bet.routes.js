const express = require("express");
const router = express.Router();

const Bet = require("../models/bet");
const User = require("../models/user");
const Event = require("../models/event");

function recalcOdds(event) {
  const total = event.totalA + event.totalB;

  let oddsA = total / event.totalA;
  let oddsB = total / event.totalB;

  oddsA *= 0.95;
  oddsB *= 0.95;

  oddsA = Math.max(1.1, Number(oddsA.toFixed(2)));
  oddsB = Math.max(1.1, Number(oddsB.toFixed(2)));

  event.oddsA = oddsA;
  event.oddsB = oddsB;

  event.oddsHistory.push({ oddsA, oddsB });
}

router.post("/", async (req, res) => {
  try {
    const { userId, eventId, choice, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.balance < amount) return res.status(400).json({ message: "Solde insuffisant" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.totalA) event.totalA = 0;
    if (!event.totalB) event.totalB = 0;

    if (choice === "A") event.totalA += amount;
    if (choice === "B") event.totalB += amount;

    recalcOdds(event);

    const odds = choice === "A" ? event.oddsA : event.oddsB;
    const potentialWin = amount * odds;

    const bet = new Bet({
      userId,
      eventId,
      choice,
      amount,
      potentialWin,
      status: "open"
    });

    await bet.save();

    user.balance -= amount;
    await user.save();
    await event.save();

    res.json({
      message: "Pari placé",
      bet,
      balance: user.balance,
      oddsA: event.oddsA,
      oddsB: event.oddsB
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
