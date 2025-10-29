import React, { createContext, useContext, useEffect, useState } from 'react';
import * as firebaseApp from '../services/firebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

type User = { uid: string; email?: string } | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp.initFirebase() as any);
    const unsub = onAuthStateChanged(auth, (u: any) => {
      if (u) setUser({ uid: u.uid, email: u.email || undefined });
      else setUser(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signUp = async (email: string, password: string) => {
    const auth = getAuth(firebaseApp.initFirebase() as any);
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email: string, password: string) => {
    const auth = getAuth(firebaseApp.initFirebase() as any);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const auth = getAuth(firebaseApp.initFirebase() as any);
    try {
      // Use Firebase web popup sign-in when available (web). Native/mobile builds
      // should use expo-auth-session or native Google sign-in and then pass
      // the token to Firebase; that's outside this quick patch.
      const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (popupErr: any) {
        // Some browsers/environments (or misconfigured OAuth) can reject popups
        // with messages like "The requested action is invalid." or operation-not-supported.
        // Fall back to redirect-based sign-in which will navigate to the Firebase handler.
        // This is more robust for environments where popups are blocked.
        console.warn('Google popup sign-in failed, falling back to redirect:', popupErr);
        await signInWithRedirect(auth, provider);
      }
    } catch (e: any) {
      // Re-throw so callers can show a useful message.
      throw e;
    }
  };

  const signOutUser = async () => {
    const auth = getAuth(firebaseApp.initFirebase() as any);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut: signOutUser }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
