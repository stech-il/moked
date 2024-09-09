const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// התחבר ל-MongoDB
mongoose.connect('mongodb://localhost:27017/queueManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');

  // צור סיסמה מוצפנת
  const hashedPassword = await bcrypt.hash('adminpassword', 10);

  // צור משתמש חדש
  const adminUser = new User({
    username: 'admin',
    password: hashedPassword,
    room: 'admin_room',
  });

  // שמור את המשתמש החדש ב-Database
  await adminUser.save();
  console.log('Admin user created');

  // סגור את החיבור ל-MongoDB
  mongoose.connection.close();
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});
