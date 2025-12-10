import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (safe for client-side use)
export const firebaseConfig = {
  apiKey: "AIzaSyDxpbXvFH6UvfE2I6OJ_wNFnA889Zu-NEQ",
  authDomain: "monofia-inventory.firebaseapp.com",
  projectId: "monofia-inventory",
  storageBucket: "monofia-inventory.firebasestorage.app",
  messagingSenderId: "788480597316",
  appId: "1:788480597316:web:776a05277fb4e60806cb11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Set default language (Arabic)
auth.languageCode = 'ar';

export default app;
