const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/db');
const queueRoutes = require('./routes/queue'); // ייבוא מסלול queue
const authRoutes = require('./routes/auth'); // ייבוא מסלול auth
const adminRoutes = require('./routes/admin'); // ייבוא מסלול admin

const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));

// הגדרת התיקייה 'audio' כתיקייה סטטית
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// התחברות למסד הנתונים
connectDB();

// הגדרת מנוע תבניות
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

// הגדרת קבצים סטטיים
app.use(express.static('public'));

// הגדרת המסלולים
app.use('/', authRoutes);
app.use('/', queueRoutes); // ודא שהמסלול נוסף כאן
app.use('/', adminRoutes);

// הפעלת השרת
const PORT = process.env.PORT || 85;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;
