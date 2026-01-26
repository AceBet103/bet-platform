const Event = require("../models/event");
const Bet = require("../models/bet");
const User = require("../models/user");
const mongoose = require("mongoose");

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "open" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/events/bet
exports.placeBet = async (req, res) => {
  try {
    const { userId, eventId, choice, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.balance < amount) return res.status(400).json({ error: "Solde insuffisant" });

    const event = await Event.findById(eventId);
    if (!event || event.status !== "open") return res.status(400).json({ error: "Événement invalide" });

    const odds = choice === "A" ? event.oddsA : event.oddsB;
    const potentialWin = amount * odds;

    const bet = new Bet({ userId, eventId, choice, amount, potentialWin });
    await bet.save();

    user.balance -= amount;
    await user.save();

    res.json({ message: "Pari placé !", bet, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/events/close
exports.closeEvent = async (req, res) => {
  try {
    const { eventId, winner } = req.body;

    const event = await Event.findById(mongoose.Types.ObjectId(eventId));
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "closed";
    event.winner = winner;
    await event.save();

    const bets = await Bet.find({ eventId: event._id });

    for (let bet of bets) {
      const user = await User.findById(bet.userId);

      if (bet.choice === winner) {
        bet.status = "won";
        user.balance += bet.potentialWin;
      } else {
        bet.status = "lost";
      }

      await bet.save();
      await user.save();
    }

    res.json({ message: "Event closed & bets settled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
