const express = require('express');
const Appointment = require('../models/Appointment');
const Room = require('../models/Room');
const router = express.Router();

// דף להזנת מספר טלפון
router.get('/appointment', async (req, res) => {
  const defaultRoom = 'Room 1'; // שם החדר ברירת המחדל
  res.render('appointment', { defaultRoom });
});

// הוספת מטופל חדש לחדר
router.post('/appointment', async (req, res) => {
  const { phoneNumber, room } = req.body;

  try {
    const newAppointment = new Appointment({ phoneNumber, room });
    await newAppointment.save();
    res.redirect('/overview'); // לאחר ההוספה, חזרה לעמוד ה-overview
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding appointment');
  }
});

module.exports = router;
