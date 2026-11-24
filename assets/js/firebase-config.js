// Firebase settings for the Private page (see HOW-TO-UPDATE.md, part 6).
// These values are NOT secret — Firebase is designed for them to be public.
// Your documents are protected by your password and the rules in firestore.rules.
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCjoKRPFIqmrRo1wacDqYKDHE6GVwMxaQI",
  authDomain: "moinul-private.firebaseapp.com",
  projectId: "moinul-private",
  storageBucket: "moinul-private.firebasestorage.app",
  messagingSenderId: "1090971099865",
  appId: "1:1090971099865:web:b0b4bd21f4d53c0e9dd4c8"
};

// The only email allowed to create an account (change it if you sign up with another one).
window.PRIVATE_OWNER_EMAIL = "moinulshdu@gmail.com";

// Sign out automatically after this many minutes without activity.
window.PRIVATE_IDLE_MINUTES = 30;
