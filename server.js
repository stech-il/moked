const https = require('https'); // שים לב לשינוי מ-http ל-https
const app = require('./app');
const fs = require('fs');
const socketIo = require('socket.io'); // שימוש ב-Socket.IO

const options = {
  key: fs.readFileSync('public/server.key'),
  cert: fs.readFileSync('public/server.crt')
};

// יצירת שרת HTTPS
const server = https.createServer(options, app);
const io = socketIo(server); // חיבור ה-Socket.IO לשרת ה-HTTPS

let queue = []; // אחסון התורים בזיכרון
let rooms = {}; // אחסון החדרים והתורים שלהם בזיכרון

// הפעלת השרת HTTPS
server.listen(444, () => {
  console.log('HTTPS Server running on port 444');
});

// חיבור ל-Socket.IO
io.on('connection', (socket) => {
  const userRoom = socket.handshake.query.room;

  if (!rooms[userRoom]) {
    rooms[userRoom] = [];
  }

  // שליחת התור הנוכחי ללקוח המחובר
  socket.emit('updateQueue', queue);
  socket.emit('updateRoom', { room: userRoom, tickets: rooms[userRoom] });

  // קבלת תור חדש
  socket.on('newTicket', (ticket) => {
    queue.push(ticket);
    io.emit('updateQueue', queue); // עדכון כל הלקוחות עם התור החדש
  });

  // העברת תור לחדר
  socket.on('moveTicket', (data) => {
    const { ticketId, room } = data;
    const ticketIndex = queue.findIndex((ticket) => ticket.id === ticketId);

    if (ticketIndex !== -1) {
      if (!rooms[room]) {
        rooms[room] = [];
      }

      // ווידוא שאין תור אחר בתהליך בחדר הזה
      if (rooms[room].some(ticket => ticket.status === 'in-process')) {
        socket.emit('error', 'יש כבר תור בתהליך בחדר הזה.');
        return;
      }

      const ticket = queue[ticketIndex];
      ticket.status = 'in-process';
      rooms[room].push(ticket);
      queue.splice(ticketIndex, 1); // הסרת התור מהרשימה הכללית
      io.emit('updateQueue', queue);
      io.emit('updateRoom', { room, tickets: rooms[room] });
    }
  });

  // טיפול בניתוק המשתמש
  socket.on('disconnect', () => {
    console.log('משתמש התנתק');
  });
});
