// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDa1jib5JJfboOMkhw64Nwl6ia_LfcOoRk",
  authDomain: "node-dc510.firebaseapp.com",
  projectId: "node-dc510",
  storageBucket: "node-dc510.firebasestorage.app",
  messagingSenderId: "917525434182",
  appId: "1:917525434182:web:265054ff20ea2a08409f47",
  measurementId: "G-B6RK58PGN2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    
  });
});