// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "********HIDDEN********",
  authDomain: "********HIDDEN********",
  projectId: "rxradar",
  storageBucket: "rxradar.appspot.com",
  messagingSenderId: "********HIDDEN********",
  appId: "1:290779208390:web:f0898a529b6b22dda0d5c7",
  measurementId: "G-ZFCZQJ37KK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
