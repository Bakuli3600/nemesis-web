import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBl0p3jwF5Ts2vG18tOaWOksNWZC4170Qo",
  authDomain: "nemesis-b6bde.firebaseapp.com",
  projectId: "nemesis-b6bde",
  storageBucket: "nemesis-b6bde.firebasestorage.app",
  messagingSenderId: "792017132358",
  appId: "1:792017132358:web:540fd8ad02aa941921a347",
  measurementId: "G-610GNW7SD6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
