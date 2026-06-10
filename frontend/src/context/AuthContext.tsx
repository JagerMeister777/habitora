import { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('habitora_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('habitora_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('habitora_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
