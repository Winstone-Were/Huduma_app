// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE_9Pt3oJ0-HIJwgUwndnbw8guR7pCAVw",
  authDomain: "node-js-auth-49757.firebaseapp.com",
  projectId: "node-js-auth-49757",
  storageBucket: "node-js-auth-49757.appspot.com",
  messagingSenderId: "265988169371",
  appId: "1:265988169371:web:34195a2a05544bcc93703e",
  measurementId: "G-KR1Z0SSTLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export default ( {app, auth, signInWithEmailAndPassword});