
const socket = io();

// Function to add a new ticket to the queue
function addTicket() {
  const ticket = document.getElementById('new-ticket').value;
  if (ticket) {
    socket.emit('newTicket', { id: Date.now(), name: ticket });
    document.getElementById('new-ticket').value = '';
  }
}

// Update the queue list
socket.on('updateQueue', (queue) => {
  const queueList = document.getElementById('queue-list');
  queueList.innerHTML = '';
  queue.forEach((ticket) => {
    const li = document.createElement('li');
    li.textContent = ticket.name;
    li.setAttribute('data-id', ticket.id);
    li.onclick = () => moveTicket(ticket.id);
    queueList.appendChild(li);
  });
});

// Move ticket to a room
function moveTicket(ticketId) {
  const room = prompt('Enter room name:');
  if (room) {
    socket.emit('moveTicket', { ticketId, room });
  }
}

// Update the room list
socket.on('updateRoom', ({ room, tickets }) => {
  let roomDiv = document.getElementById(`room-${room}`);
  if (!roomDiv) {
    roomDiv = document.createElement('div');
    roomDiv.id = `room-${room}`;
    roomDiv.innerHTML = `<h3>${room}</h3><ul></ul>`;
    document.getElementById('room-list').appendChild(roomDiv);
  }

  const roomList = roomDiv.querySelector('ul');
  roomList.innerHTML = '';
  tickets.forEach((ticket) => {
    const li = document.createElement('li');
    li.textContent = ticket.name;
    roomList.appendChild(li);
  });
});
