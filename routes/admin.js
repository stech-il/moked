const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Room = require('../models/Room');
const News = require('../models/News'); // ייבוא המודל של החדשות
const router = express.Router();

// Middleware לבדוק אם המשתמש מחובר ומנהל
function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.redirect('/login');
  }
}

// דף הפאנל לניהול משתמשים, חדרים וחדשות
router.get('/admin', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({});
    const rooms = await Room.find({});
    const news = await News.find({}); // שליפת כל החדשות מהמסד נתונים
    
    res.render('adminPanel', { 
      user: req.session.user, 
      users, 
      rooms, 
      news // העברת החדשות לתבנית EJS
    });
  } catch (error) {
    console.error('Error loading admin panel:', error);
    res.status(500).send('Error loading admin panel');
  }
});

// הוספת חדר חדש
router.post('/admin/addRoom', isAuthenticated, async (req, res) => {
  const { roomName } = req.body;

  try {
    const existingRoom = await Room.findOne({ name: roomName });
    if (existingRoom) {
      return res.status(400).send('Room already exists');
    }

    const newRoom = new Room({ name: roomName });
    await newRoom.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding room');
  }
});

// הוספת משתמש חדש
router.post('/admin/addUser', isAuthenticated, async (req, res) => {
  try {
    const { username, password, room, isAdmin } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      room,
      isAdmin: isAdmin ? true : false
    });

    await newUser.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// עריכת משתמש קיים
router.get('/admin/editUser/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const rooms = await Room.find({}); // שליפת החדרים ממסד הנתונים
    res.render('editUser', { user, rooms }); // העברת המשתמש והחדרים לתבנית
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/admin/editUser/:id', isAuthenticated, async (req, res) => {
  try {
    const { username, password, room, isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    user.username = username;
    user.room = room;
    user.isAdmin = isAdmin ? true : false;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// מחיקת משתמש
router.post('/admin/deleteUser/:id', isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
