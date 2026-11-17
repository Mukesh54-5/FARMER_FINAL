import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import type { AuthUser, FarmerProfile } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  profile: FarmerProfile | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (payload: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfileState: (profile: FarmerProfile | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const LOCAL_TOKEN_KEY = 'farmer_portal_session_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(LOCAL_TOKEN_KEY));
  const [loading, setLoading] = useState<boolean>(true);

  const syncWithBackend = useCallback(async (authToken: string) => {
    const res = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
      throw new Error('Session invalid');
    }
    const data = await res.json();
    setUser(data.user);
    setProfile(data.profile ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          sessionStorage.removeItem(LOCAL_TOKEN_KEY);
          const res = await fetch('/api/auth/firebase-sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (res.ok && active) {
            const data = await res.json();
            setToken(idToken);
            setUser(data.user);
            setProfile(data.profile ?? null);
          }
        } catch (err) {
          console.error('Firebase auth sync error:', err);
        } finally {
          if (active) setLoading(false);
        }
        return;
      }

      // Check local session token if no Firebase user
      const savedToken = sessionStorage.getItem(LOCAL_TOKEN_KEY);
      if (savedToken) {
        try {
          await syncWithBackend(savedToken);
          if (active) setToken(savedToken);
        } catch {
          sessionStorage.removeItem(LOCAL_TOKEN_KEY);
          if (active) {
            setToken(null);
            setUser(null);
            setProfile(null);
          }
        }
      } else if (active) {
        setToken(null);
        setUser(null);
        setProfile(null);
      }
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [syncWithBackend]);

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleAuthProvider);
    const idToken = await cred.user.getIdToken();
    const res = await fetch('/api/auth/firebase-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Google Sign-In sync failed.');
    }
    const data = await res.json();
    sessionStorage.removeItem(LOCAL_TOKEN_KEY);
    setToken(idToken);
    setUser(data.user);
    setProfile(data.profile ?? null);
  };

  const loginWithEmail = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    sessionStorage.setItem(LOCAL_TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile ?? null);
  };

  const registerWithEmail = async (payload: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }
    sessionStorage.setItem(LOCAL_TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile ?? null);
  };

  const logout = async () => {
    sessionStorage.removeItem(LOCAL_TOKEN_KEY);
    await fetch('/api/logout', { method: 'POST' }).catch(() => {});
    if (auth.currentUser) {
      await signOut(auth).catch(() => {});
    }
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    let activeToken = token;
    if (auth.currentUser) {
      activeToken = await auth.currentUser.getIdToken();
      setToken(activeToken);
    }
    if (!activeToken) return;
    await syncWithBackend(activeToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        refreshProfile,
        setProfileState: setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
