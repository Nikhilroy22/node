const { db, messaging } = require('../helper/firebase'); // আগের ফাইল
let tokens = [];

exports.democ = async (req, res) => {
  
  try {
    await db.collection("users").doc("Nikhi90gg90").set({
      name: "Nikhil",
      email: "nikhil@exajmple.com",
      balance: 1000,
      createdAt: Date.now()
    });

    console.log("User inserted successfully!");
  } catch (err) {
    console.error("Error inserting user:", err);
  }
  
  
  res.render('demo');
  
}

exports.savetoken = async (req, res) => {
  const { token } = req.body;
  if (token && !tokens.includes(token)) {
    tokens.push(token);
    console.log('Token saved:', token);
  }
  res.json({ success: true });
}

exports.sendmsg = async (req, res) => {
  const { title, body } = req.body;
  if (tokens.length === 0) return res.status(400).send({ error: 'No tokens available' });

  const messages = tokens.map(token => ({
    token,
    notification: { title, body }
  }));

  try {
    const results = await Promise.all(messages.map(msg => messaging.send(msg)));
    res.send({ success: true, results });
  } catch (err) {
    console.error('Error sending messages:', err);
    res.status(500).send({ success: false, error: err });
  }
}