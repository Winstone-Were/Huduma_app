require("dotenv").config();
const firebase = require("firebase/app");
const admin = require('firebase-admin');
const serviceAccount = require("./node-js-auth-49757-firebase-adminsdk-ivd17-9dfd5f9604.json");

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail

} = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDE_9Pt3oJ0-HIJwgUwndnbw8guR7pCAVw",
  authDomain: "node-js-auth-49757.firebaseapp.com",
  projectId: "node-js-auth-49757",
  storageBucket: "node-js-auth-49757.appspot.com",
  messagingSenderId: "265988169371",
  appId: "1:265988169371:web:34195a2a05544bcc93703e",
  measurementId: "G-KR1Z0SSTLT"
};

firebase.initializeApp(firebaseConfig);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  admin,
  db
};