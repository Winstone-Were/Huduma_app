
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

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
export const FIRESTORE_DB = getFirestore(app);
export const STORAGE = getStorage(app);
export const AUTH = getAuth(app);
export default {app, auth};