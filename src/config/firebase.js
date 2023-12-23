// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKOGHmrib8GsuVTP2vwHfgvhCT9ukGmTM",
  authDomain: "shareme-c20ca.firebaseapp.com",
  projectId: "shareme-c20ca",
  storageBucket: "shareme-c20ca.appspot.com",
  messagingSenderId: "803854419205",
  appId: "1:803854419205:web:06ee9b69d51079ed0d236c",
  measurementId: "G-SCVHMSM5CX",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
