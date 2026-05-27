// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzZerLU2HZUAPUlqm4DwXjAEFWjhw3Mvo",
  authDomain: "angular-bubble-teas.firebaseapp.com",
  projectId: "angular-bubble-teas",
  storageBucket: "angular-bubble-teas.firebasestorage.app",
  messagingSenderId: "753618566509",
  appId: "1:753618566509:web:383696f0cfa8a4dae36e64",
  measurementId: "G-VYWKJ3Z85P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);