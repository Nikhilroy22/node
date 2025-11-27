const admin = require("firebase-admin");


// Environment variable থেকে JSON decode
const serviceAccount = JSON.parse(
  Buffer.from(process.env.SECRET_FIREBASE_KEY, 'base64').toString('utf-8')
);

/*console.log(serviceAccount)cat serviceAccountKey.json | base64 -w 0 */
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