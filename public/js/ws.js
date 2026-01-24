
const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  console.log("✅ WS Connected");
  ws.send("Hello Server");
};

ws.onerror = (e) => {
  console.error("❌ WS Error", e);
};

ws.onclose = () => {
  console.log("❌ WS Closed");
};

ws.onmessage = (e) => {
  console.log("📩", e.data);
};