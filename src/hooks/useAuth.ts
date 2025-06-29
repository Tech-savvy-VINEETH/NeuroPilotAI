import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChange, 
  signInWithGoogle, 
  signInWithGoogleRedirect, 
  handleRedirectResult, 
  signOut,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  isDomainAuthorized,
  EmailAuthData,
  sendSignInLink,
  completeSignInWithEmailLink,
  isEmailSignInLink
} from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle redirect result and email link sign-in on app load
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Check if this is an email link sign-in
        if (isEmailSignInLink()) {
          setLoading(true);
          await completeSignInWithEmailLink();
          // Clear the URL to remove the sign-in link parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        // Handle Google redirect result
        const result = await handleRedirectResult();
        if (result?.accessToken) {
          setAccessToken(result.accessToken);
          localStorage.setItem('googleAccessToken', result.accessToken);
        }
      } catch (error: any) {
        console.error('Auth redirect error:', error);
        setAuthError(error.message || 'Authentication failed.');
      } finally {
        setLoading(false);
      }
    };

    handleAuthRedirect();
  }, []);

  // Google Sign-In with Popup
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const authUser = await signInWithGoogle();
      if (authUser?.accessToken) {
        setAccessToken(authUser.accessToken);
        localStorage.setItem('googleAccessToken', authUser.accessToken);
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      setAuthError(error.message);
      setLoading(false);
    }
  };

  // Google Sign-In with Redirect
  const loginWithGoogleRedirect = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await signInWithGoogleRedirect();
    } catch (error: any) {
      console.error('Google redirect login failed:', error);
      setAuthError(error.message);
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      await signInWithEmail(email, password);
      setLoading(false);
    } catch (error: any) {
      console.error('Email login failed:', error);
      setAuthError(error.message);
      setLoading(false);
    }
  };

  // Email/Password Sign Up
  const signUpWithEmailPassword = async (authData: EmailAuthData) => {
    try {
      setLoading(true);
      setAuthError(null);
      await signUpWithEmail(authData);
      setLoading(false);
    } catch (error: any) {
      console.error('Email signup failed:', error);
      setAuthError(error.message);
      setLoading(false);
    }
  };

  // Send Sign-In Link to Email
  const sendEmailSignInLink = async (email: string) => {
    try {
      setAuthError(null);
      await sendSignInLink(email);
      return true;
    } catch (error: any) {
      console.error('Send email link failed:', error);
      setAuthError(error.message);
      return false;
    }
  };

  // Password Reset
  const sendPasswordReset = async (email: string) => {
    try {
      setAuthError(null);
      await resetPassword(email);
      return true;
    } catch (error: any) {
      console.error('Password reset failed:', error);
      setAuthError(error.message);
      return false;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut();
      setAccessToken(null);
      localStorage.removeItem('googleAccessToken');
      setAuthError(null);
    } catch (error: any) {
      console.error('Logout failed:', error);
      setAuthError(error.message);
    }
  };

  // Clear error
  const clearError = () => {
    setAuthError(null);
  };

  // Get access token from localStorage if available
  useEffect(() => {
    const token = localStorage.getItem('googleAccessToken');
    if (token && user) {
      setAccessToken(token);
    }
  }, [user]);

  return {
    user,
    loading,
    accessToken,
    authError,
    loginWithGoogle,
    loginWithGoogleRedirect,
    loginWithEmail,
    signUpWithEmailPassword,
    sendEmailSignInLink,
    sendPasswordReset,
    logout,
    clearError,
    isAuthenticated: !!user,
    isDomainAuthorized: isDomainAuthorized(),
    isEmailSignInLink: isEmailSignInLink()
  };
}