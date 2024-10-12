// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsM7MEhfD_dKcnY9FeNpPz8p_w-VawL1k",
  authDomain: "fratgenda.firebaseapp.com",
  projectId: "fratgenda",
  storageBucket: "fratgenda.appspot.com",
  messagingSenderId: "1054538978271",
  appId: "1:1054538978271:web:0bc42675dee8df925d2a6a",
  measurementId: "G-21VFB6Y7S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);