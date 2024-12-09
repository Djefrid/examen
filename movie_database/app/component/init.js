import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

export default function init() {
  const firebaseConfig = {
    apiKey: "AIzaSyDsp-Ie3OKMslCq3VaZ2EsgSDk1IF_A1MM",
    authDomain: "movie-database-68ab5.firebaseapp.com",
    projectId: "movie-database-68ab5",
    storageBucket: "movie-database-68ab5.firebasestorage.app",
    messagingSenderId: "394434513924",
    appId: "1:394434513924:web:b3097e4cae43e14e663951"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const messaging = getMessaging(app);

  return { auth, db, storage, messaging };
}