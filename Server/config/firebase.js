require("dotenv").config();
const {initializeApp} = require("firebase/app")
const admin = require('firebase-admin');
//const serviceAccount = require("./node-js-auth-49757-firebase-adminsdk-ivd17-9dfd5f9604.json");

const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} = require("firebase/auth");

const {getFirestore} = require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyD-cPaG74E7yXIS9__ZB0UtqJoHcLxw8Yc",
  authDomain: "huduma-4bc13.firebaseapp.com",
  projectId: "huduma-4bc13",
  storageBucket: "huduma-4bc13.appspot.com",
  messagingSenderId: "93399060513",
  appId: "1:93399060513:web:ce4298700dff08d5001360"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const FIRESTORE_DB = getFirestore();

module.exports = {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  admin,
  FIRESTORE_DB
};