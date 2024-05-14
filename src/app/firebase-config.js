// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxwmfjF7IGF4z5vxUH1quzK7W9lYjJTzE",
  authDomain: "rxradar.firebaseapp.com",
  projectId: "rxradar",
  storageBucket: "rxradar.appspot.com",
  messagingSenderId: "290779208390",
  appId: "1:290779208390:web:f0898a529b6b22dda0d5c7",
  measurementId: "G-ZFCZQJ37KK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
