import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  getAuth
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  accessToken?: string;
}

export interface EmailAuthData {
  email: string;
  password: string;
  displayName?: string;
}

// Simplified error handling
const handleAuthError = (error: AuthError): string => {
  console.error('Firebase Auth Error:', error.code, error.message);
  
  switch (error.code) {
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups or try the redirect method.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized. Please use email authentication.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please use email authentication.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/invalid-action-code':
      return 'The sign-in link is invalid or has expired. Please request a new one.';
    case 'auth/expired-action-code':
      return 'The sign-in link has expired. Please request a new one.';
    default:
      return 'Authentication failed. Please try again.';
  }
};

// Google Sign-In with Popup
export const signInWithGoogle = async (): Promise<AuthUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (!user) {
      throw new Error('No user data received');
    }
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      accessToken
    };
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Google Sign-In with Redirect
export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Handle redirect result
export const handleRedirectResult = async (): Promise<AuthUser | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        accessToken
      };
    }
    return null;
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (authData: EmailAuthData): Promise<AuthUser> => {
  try {
    const { email, password, displayName } = authData;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: displayName || result.user.displayName,
      photoURL: result.user.photoURL
    };
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Send Sign-In Link to Email (Passwordless)
export const sendSignInLink = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error('Email address is required');
    }

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: window.location.origin,
      // This must be true.
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Complete Sign-In with Email Link
export const completeSignInWithEmailLink = async (email?: string): Promise<AuthUser> => {
  try {
    const authInstance = getAuth();
    
    if (!isSignInWithEmailLink(authInstance, window.location.href)) {
      throw new Error('Invalid sign-in link');
    }

    // Get the email if available from localStorage or parameter
    let userEmail = email || window.localStorage.getItem('emailForSignIn');
    
    if (!userEmail) {
      // User opened the link on a different device. Ask for email confirmation.
      userEmail = window.prompt('Please provide your email for confirmation');
      if (!userEmail) {
        throw new Error('Email is required to complete sign-in');
      }
    }

    const result = await signInWithEmailLink(authInstance, userEmail, window.location.href);
    
    // Clear email from storage
    window.localStorage.removeItem('emailForSignIn');
    
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Check if current URL is a sign-in link
export const isEmailSignInLink = (): boolean => {
  const authInstance = getAuth();
  return isSignInWithEmailLink(authInstance, window.location.href);
};

// Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error('Email address is required');
    }
    
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(handleAuthError(error));
  }
};

// Sign Out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Auth State Observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if current domain is authorized
export const isDomainAuthorized = (): boolean => {
  const currentDomain = window.location.hostname;
  const authorizedDomains = [
    'localhost',
    '127.0.0.1',
    'neuropilot-ai.firebaseapp.com',
    'neuropilot-ai.web.app'
  ];
  
  return authorizedDomains.includes(currentDomain);
};