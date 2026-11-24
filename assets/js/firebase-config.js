// ---------------------------------------------------------------------------
//  Firebase settings for the Private page (see HOW-TO-UPDATE.md, part 6).
//
//  1. In the Firebase console: Project settings › General › Your apps ›
//     "</>" (Web app) › copy the  firebaseConfig = { … }  object.
//  2. Paste it below in place of  null  (keep the semicolon at the end).
//
//  These values are NOT secret — Firebase is designed for them to be public.
//  Your documents are protected by your password and the security rules
//  in firestore.rules, not by hiding this file.
// ---------------------------------------------------------------------------
window.FIREBASE_CONFIG = null;

// Optional: your own email. When set, the "Create account" form refuses any
// other address (the real lock is turning off sign-ups in Firebase — part 6).
window.PRIVATE_OWNER_EMAIL = "";

// Sign out automatically after this many minutes without activity.
window.PRIVATE_IDLE_MINUTES = 30;
