const { loadDb, DB_PATH, fs, saveDB } = require('./SqlDb');



// Save message
async function saveMessage(from_user, to_user, message, delivered=0) {
  
  const db = await loadDb();
  const stmt = db.prepare("INSERT INTO messages (from_user, to_user, message, delivered) VALUES (?,?,?,?)");
  stmt.run([from_user, to_user, message, delivered]);
  stmt.free();
  saveDB(db); // save to file
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



module.exports = { saveMessage, getPendingMessages, markDelivered};