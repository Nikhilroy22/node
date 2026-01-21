const { db } = require('../db/nodesqlite');

/* =========================
   SAVE MESSAGE
========================= */
function saveMessage(from_user, to_user, message, delivered = 0) {
  const stmt = db.prepare(`
    INSERT INTO messages (from_user, to_user, message, delivered)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(from_user, to_user, message, delivered);
  return stmt.lastInsertRowid;
}

/* =========================
   GET CHAT HISTORY
========================= */
function getMessages(user1, user2) {
  const stmt = db.prepare(`
    SELECT *
    FROM messages
    WHERE (from_user = ? AND to_user = ?)
       OR (from_user = ? AND to_user = ?)
    ORDER BY id ASC
  `);

  return stmt.all(user1, user2, user2, user1);
}

/* =========================
   GET PENDING (OFFLINE)
========================= */
function getPendingMessages(to_user) {
  const stmt = db.prepare(`
    SELECT *
    FROM messages
    WHERE to_user = ? AND delivered = 0
    ORDER BY id ASC
  `);

  return stmt.all(to_user);
}

/* =========================
   MARK DELIVERED
========================= */
function markDelivered(messageId) {
  const stmt = db.prepare(`
    UPDATE messages SET delivered = 1 WHERE id = ?
  `);
  stmt.run(messageId);
  return true;
}

module.exports = {
  saveMessage,
  getMessages,
  getPendingMessages,
  markDelivered,
};