const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  oddsA: { type: Number, default: 1.0 },
  oddsB: { type: Number, default: 1.0 },
  totalA: { type: Number, default: 0 },
  totalB: { type: Number, default: 0 },
  status: { type: String, default: "open" }, // open | closed
  winner: { type: String, default: null },   // A | B
  oddsHistory: [
    {
      oddsA: Number,
      oddsB: Number,
      date: Date
    }
  ]
});

module.exports = mongoose.model("Event", eventSchema);
