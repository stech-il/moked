const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  phoneNumber: String,
  room: String,
  status: String,
  patientNumber: Number,
  isPrioritized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
