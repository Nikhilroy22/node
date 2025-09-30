/* const socket = io();
            
            socket.on('connect', () => {
                console.log('Client connected to server');
            }); */
            
            const socket = io({
              nn: "kalu"
            });
            console.log(socket);

    function sendMsg() {
        const msg = document.getElementById('msg').value;
        socket.emit('chat message', msg);
    }

    socket.on('chat message', msg => {
        const li = document.createElement('li');
        li.textContent = msg;
        document.getElementById('messages').appendChild(li);
    });
    
    
    socket.on("activeUsers", (users) => {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user;
      userList.appendChild(li);
    });
  });