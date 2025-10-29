import React, { createContext, useContext, useEffect, useState } from 'react';
import * as firebaseApp from '../services/firebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

type User = { uid: string; email?: string } | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
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
    const unsub = onAuthStateChanged(auth, (u) => {
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

  const signOutUser = async () => {
    const auth = getAuth(firebaseApp.initFirebase() as any);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut: signOutUser }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
