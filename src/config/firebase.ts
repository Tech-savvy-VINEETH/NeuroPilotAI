import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAghqkz_fQWcVwCmwZk5eb4izyFnGLNw6s",
  authDomain: "neuropilot-ai.firebaseapp.com",
  projectId: "neuropilot-ai",
  storageBucket: "neuropilot-ai.firebasestorage.app",
  messagingSenderId: "678488397840",
  appId: "1:678488397840:web:c2209983470df141741295",
  measurementId: "G-WK95RTNXLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Add required scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

// Configure provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;