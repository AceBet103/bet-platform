const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  choice: String,
  amount: Number,
  potentialWin: Number,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("Bet", BetSchema);
