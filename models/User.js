// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  voterId: String,
  voted: { type: Boolean, default: false },
  vote: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
