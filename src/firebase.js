import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; // Import FCM

const firebaseConfig = {
  apiKey: "AIzaSyCH-kg_hkl-Vub0M88d99cQJqdM6fhPyrw",
  authDomain: "w-safety-9a817.firebaseapp.com",
  projectId: "w-safety-9a817",
  storageBucket: "w-safety-9a817.appspot.com",
  messagingSenderId: "340578299857",
  appId: "1:340578299857:web:26a355ffa020d62b007af0",
  measurementId: "G-6VJ2816VX5",
  databaseURL: "https://w-safety-9a817-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);

export { auth, database, db };
