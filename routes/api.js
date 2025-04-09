// routes/api.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).send("User already exists");
  const user = new User({ username, password, email });
  await user.save();
  res.send("Registered successfully");
});

router.post('/login', async (req, res) => {
  const { username, password, voterId} = req.body;
  const user = await User.findOne({ username, password, voterId });
  if (!user) return res.status(400).send("Invalid credentials");
  res.json(user);
});

router.post('/vote', async (req, res) => {
  const { username, party } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.voted) return res.status(400).send("Already voted or user not found");
  user.voted = true;
  user.vote = party;
  await user.save();
  res.send("Vote cast successfully");
});

router.get('/admin/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
