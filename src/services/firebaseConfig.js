import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdzziMOwPGrTugLIvtVNtNZWDZbRzZwoc",
  authDomain: "chat-c3271.firebaseapp.com",
  projectId: "chat-c3271",
  storageBucket: "chat-c3271.appspot.com",
  messagingSenderId: "169626529895",
  appId: "1:169626529895:web:f4dab2cf21a1f6bec364c2",
  measurementId: "G-NBPGMFLX6P",
};

export const app = initializeApp(firebaseConfig);
export const databaseApp = getFirestore(app);
export const auth = getAuth(app);
