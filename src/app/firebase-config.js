// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdbN272x0dFCrGlr6ofms28fSjhqlgl8Q",
  authDomain: "rx-radar.firebaseapp.com",
  projectId: "rx-radar",
  storageBucket: "rx-radar.appspot.com",
  messagingSenderId: "803800088421",
  appId: "1:803800088421:web:38ea1c356d422bf1722b8c",
  measurementId: "G-E1SCK3RLTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

