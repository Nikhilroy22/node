console.log('eruda show');

const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');


// 🔔 Notification permission
if (Notification.permission !== "granted") {
  console.log("noti");
  
  Notification.requestPermission();
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('chat message', input.value.trim());
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
  
  // 🔔 Push Notification দেখানো
  if (Notification.permission === "granted") {
    console.log("msgg");
  }
  
});


