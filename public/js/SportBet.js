async function kalabd(){
  
  const url = "http://localhost:3000/res";

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();


console.log(jjj);
}
//kalabd();


const BOT_TOKEN = "8279159750:AAF8aHh3P2BdpvUu9P76o34wilwTcTSgzTs";
const CHAT_ID = "-1003225323678";

// পাঠানোর message
const message = "Hello! This is a test message from Node.js devloper";

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("✅ Message sent:", data))
  .catch((err) => console.error("❌ Error:", err));