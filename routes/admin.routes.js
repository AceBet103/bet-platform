const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* CREATE EVENT */
router.post("/event", auth, admin, async (req, res) => {
  try {
    const { teamA, teamB } = req.body;

    const event = await Event.create({
      teamA,
      teamB,
      oddsA: 1.5,
      oddsB: 1.5
    });

    res.json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET ALL EVENTS */
router.get("/events", auth, admin, async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

/* RESOLVE EVENT */
router.post("/event/:id/resolve", auth, admin, async (req, res) => {
  try {
    const { winner } = req.body; // "A" or "B"

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "closed";
    event.winner = winner;
    await event.save();

    res.json({ message: "Event closed. Now resolve payouts from main server logic." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
