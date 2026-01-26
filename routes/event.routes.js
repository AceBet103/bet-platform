const express = require("express");
const router = express.Router();
const { getEvents, closeEvent } = require("../controllers/event.controller");
const User = require("../models/user");

// Ajouter un utilisateur test
router.get("/add-user-test", async (req, res) => {
  try {
    const user = new User({
      username: "Christopher",
      balance: 100
    });
    await user.save(); // ça crée automatiquement la collection 'users' si elle n'existe pas
    res.json({ message: "Utilisateur test créé !", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les événements ouverts
router.get("/", getEvents);

// Clôturer un événement
router.post("/close", closeEvent);

// 🔹 Route temporaire pour créer un utilisateur test
router.get("/add-user-test", async (req, res) => {
  try {
    const user = new User({ username: "Christopher", balance: 100 });
    await user.save();
    res.json({ message: "Utilisateur test créé", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Route test pour ajouter un match
router.get("/add-test-browser", async (req, res) => {
  try {
    const Event = require("../models/event");

    const newEvent = new Event({
      sport: "Football",
      teamA: "Team Alpha",
      teamB: "Team Beta",
      oddsA: 1.8,
      oddsB: 2.0,
    });

    await newEvent.save();
    res.json({ message: "Match de test ajouté !", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Toujours laisser ceci à la fin
module.exports = router;
