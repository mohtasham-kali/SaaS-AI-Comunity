
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx6Y2gaRYTl_5eJAIMtxX96vhW-1Ok1Pw",
  authDomain: "kartzora-1744495566759.firebaseapp.com",
  projectId: "kartzora-1744495566759",
  storageBucket: "kartzora-1744495566759.appspot.com", // Corrected from .firebasestorage.app to .appspot.com based on typical Firebase config
  messagingSenderId: "516940048595",
  appId: "1:516940048595:web:e4f0c6ce969ae6dada4c26",
  measurementId: "G-PVMHRC9CF8"
};

// Initialize Firebase
// To prevent reinitialization on hot reloads, check if an app already exists.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Firestore = getFirestore(app);
let analytics: Analytics | undefined;

// Initialize Firebase Analytics only on the client side
if (typeof window !== 'undefined') {
  if (firebaseConfig.measurementId) { // Check if measurementId is provided
    analytics = getAnalytics(app);
  }
}

export { app, db, analytics };
