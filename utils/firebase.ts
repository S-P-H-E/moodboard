import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAG1icNye2glYbaPX-liJ2tsEoXCm22W_U",
  authDomain: "moodboard-2fae1.firebaseapp.com",
  projectId: "moodboard-2fae1",
  storageBucket: "moodboard-2fae1.appspot.com",
  messagingSenderId: "527164067027",
  appId: "1:527164067027:web:860a811b4ba391191c1826",
  measurementId: "G-KRN8MV4QEM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };