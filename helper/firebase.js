const admin = require("firebase-admin");
const path = require("path");

// Absolute path to your service account JSON
const serviceAccount = require(path.resolve(__dirname, "nj.json"));

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL optional if using Realtime DB
  // databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});

// Export services
const auth = admin.auth();
const db = admin.firestore();
const messaging = admin.messaging();

module.exports = { admin, auth, db, messaging };