const { db, messaging } = require('../helper/firebase'); // আগের ফাইল


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
  const { token, userId } = req.body;   // optional user id

  try {
    if (!token)
      return res.status(400).send({ error: "Token missing" });

    // Token exists কিনা check
    const existing = await db.collection("fcmTokens")
      .where("token", "==", token)
      .get();

    if (!existing.empty) {
      return res.send({ success: true, msg: "Token already exists" });
    }

    // New Token save
    await db.collection("fcmTokens").add({
      token,
      userId: userId || null,
      createdAt: Date.now()
    });

    res.send({ success: true, msg: "Token saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};






exports.sendmsg = async (req, res) => {
  const { title, body } = req.body;

  const snapshot = await db.collection("fcmTokens").get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  if (tokens.length === 0) {
    return res.status(400).send({ error: "No tokens stored" });
  }

  const messages = tokens.map(token => ({
    token,
    notification: { title, body }
  }));

  const results = await Promise.allSettled(
    messages.map((msg) => messaging.send(msg))
  );

  // Auto delete expired tokens
  let deleted = 0;

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const token = tokens[i];

    if (r.status === "rejected") {
      const errorCode = r.reason.errorInfo?.code;

      if (
        errorCode === "messaging/invalid-registration-token" ||
        errorCode === "messaging/registration-token-not-registered"
      ) {
        // Delete from Firestore
        await db.collection("tokens").doc(token).delete();
        deleted++;
        console.log("🗑 Deleted expired token:", token);
      }
    }
  }

  res.send({
    success: true,
    sent: messages.length - deleted,
    deletedExpiredTokens: deleted
  });
};