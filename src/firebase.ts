import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABBnUrjorPpzd2r3HWXXDkmIESPOVRsew",
  authDomain: "sugar-a35f7.firebaseapp.com",
  projectId: "sugar-a35f7",
  storageBucket: "sugar-a35f7.firebasestorage.app",
  messagingSenderId: "704523033069",
  appId: "1:704523033069:web:76788ed58dea84b7ca6fe4",
  measurementId: "G-BYGLFN9BMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
