const Bet = require("../models/Bet");
const User = require("../models/User");
const Event = require("../models/Event");

exports.placeBet = async (req, res) => {
  try {
    const { eventId, amount, choice } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!event || event.status !== "open") {
      return res.status(400).json({ message: "Event closed or invalid" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const odds = choice === "A" ? event.oddsA : event.oddsB;
    const potentialWin = amount * odds;

    user.balance -= amount;
    await user.save();

    const bet = await Bet.create({
      userId,
      eventId,
      amount,
      choice,
      odds,
      potentialWin
    });

    res.json({ message: "Bet placed successfully", bet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
