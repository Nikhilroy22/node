const os = require('os');

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name in nets) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address; // যেমন 192.168.0.105
      }
    }
  }
  return '127.0.0.1';
}

const osName = os.type();      // যেমন: 'Windows_NT' বা 'Linux' বা 'Darwin'
const ip = getLocalIP();
const port = process.env.PORT || 3000;

console.log("OS Name:", osName);
console.log("Local IP:", ip);
console.log("Web Port:", port);
console.log(`Server URL: http://${ip}:${port}`);