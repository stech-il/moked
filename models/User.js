const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  room: { type: String },
  isAdmin: { type: Boolean, default: false } // שדה isAdmin
});

const User = mongoose.model('User', userSchema);
module.exports = User;
