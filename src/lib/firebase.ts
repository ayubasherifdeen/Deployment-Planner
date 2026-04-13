// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDtbiKUcyRYbWs9j7t2F9pcT8hkhXB64Dg",
  authDomain: "deployment-planner-d8804.firebaseapp.com",
  projectId: "deployment-planner-d8804",
  storageBucket: "deployment-planner-d8804.firebasestorage.app",
  messagingSenderId: "489965296329",
  appId: "1:489965296329:web:db4ec0e0d15b2993f24b18",
  measurementId: "G-CRTQ857LP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)

//secondary, so login doesnt affect admin
const secondaryApp  = initializeApp(firebaseConfig, "secondary");
export const secondaryAuth = getAuth(secondaryApp);