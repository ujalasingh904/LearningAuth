// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-f928b.firebaseapp.com",
  projectId: "mern-auth-f928b",
  storageBucket: "mern-auth-f928b.appspot.com",
  messagingSenderId: "389707837636",
  appId: "1:389707837636:web:792257180ad1363c1cd991"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);