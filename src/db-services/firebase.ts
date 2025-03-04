import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { environment } from '../config/environment';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_FF,
  authDomain: environment.isProduction 
    ? 'gen-wealth-e6322.firebaseapp.com' 
    : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_FF,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_FF,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_FF,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_FF,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_FF,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL_FF
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Storage
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);