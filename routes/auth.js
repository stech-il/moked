const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// דף ההתחברות
router.get('/login', async (req, res) => {
  try {
    const usersCount = await User.countDocuments({});
    if (usersCount === 0) {
      return res.redirect('/admin/setup'); // מפנה ליצירת משתמש מנהל אם אין משתמשים
    }
    res.render('login', { errorMessage: null }); // מציג את עמוד ההתחברות ללא הודעת שגיאה
  } catch (err) {
    console.error('Error loading login page:', err);
    res.status(500).send('Error loading login page');
  }
});

// טיפול בהתחברות
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // שומר את פרטי המשתמש בסשן
        req.session.user = { username: user.username, room: user.room, isAdmin: user.isAdmin };

        // מפנה לממשק הניהול אם המשתמש הוא מנהל
        if (user.isAdmin) {
          return res.redirect('/admin');
        } else {
          // מפנה לדף החדר של המשתמש אם הוא לא מנהל
          return res.redirect('/room');
        }
      } else {
        // אם הסיסמה לא נכונה, מציג הודעת שגיאה בעמוד ההתחברות
        res.render('login', { errorMessage: 'שם משתמש או סיסמה לא נכונים' });
      }
    } else {
      // אם שם המשתמש לא קיים, מציג הודעת שגיאה בעמוד ההתחברות
      res.render('login', { errorMessage: 'שם משתמש או סיסמה לא נכונים' });
    }
  } catch (err) {
    console.error('Error processing login:', err);
    res.status(500).send('Error processing login');
  }
});

// טיפול בהתנתקות
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    // מפנה לדף ההתחברות לאחר ההתנתקות
    res.redirect('/login');
  });
});

module.exports = router;
