const { loadDb, DB_PATH, fs, saveDB } = require('./SqlDb');



// Save message
async function saveMessage(from_user, to_user, message, delivered=0) {
  
  const db = await loadDb();
  const stmt = db.prepare("INSERT INTO messages (from_user, to_user, message, delivered) VALUES (?,?,?,?)");
  stmt.run([from_user, to_user, message, delivered]);
  stmt.free();
  saveDB(db); // save to file
}
//get messages
async function getMessages(user1, user2) {
  const db = await loadDb();
  
  const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE (from_user = ? AND to_user = ?)
       OR (from_user = ? AND to_user = ?)
    ORDER BY id ASC
  `);

  stmt.bind([user1, user2, user2, user1]); // ← bind() করতে হবে

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject()); // এখানে কিছু দেবার দরকার নেই
  }

  stmt.free();
  return rows;
}


// Get pending messages
async function getPendingMessages(to_user) {
  const db = await loadDb();
  const stmt = db.prepare("SELECT * FROM messages WHERE to_user=? AND delivered=0");
  stmt.bind([to_user]);

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Mark delivered
async function markDelivered(messageId) {
  const db = await loadDb();
  const stmt = db.prepare("UPDATE messages SET delivered=1 WHERE id=?");
  stmt.run([messageId]);
  stmt.free();
  saveDB(db);
}



module.exports = { saveMessage, getPendingMessages, markDelivered, getMessages};