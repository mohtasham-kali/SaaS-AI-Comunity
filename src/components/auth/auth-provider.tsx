'use client';

import type { UserProfile, Plan } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getMockUserById, getMockUsers } from '@/lib/mock-data';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (emailOrId: string, password?: string) => Promise<boolean>; // Changed to accept email or ID
  logout: () => void;
  signup: (name: string, email: string, password?: string) => Promise<boolean>; // Simplified signup
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage (very basic persistence for demo)
    const storedUserId = localStorage.getItem('currentUser');
    if (storedUserId) {
      const user = getMockUserById(storedUserId);
      if (user) setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (emailOrId: string, password?: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getMockUsers();
    const user = users.find(u => u.email === emailOrId || u.id === emailOrId);
    
    if (user) {
      // In a real app, you'd verify the password here
      setCurrentUser(user);
      localStorage.setItem('currentUser', user.id);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (name: string, email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getMockUsers();
    if (users.some(u => u.email === email)) {
      setLoading(false);
      return false; // User already exists
    }
    
    const newUser: UserProfile = {
      id: `user${users.length + 1}`,
      name,
      email,
      image: `https://picsum.photos/seed/${name}/200/200`,
      plan: 'free',
      aiResponsesToday: 0,
      aiResponsesThisWeek: 0,
      lastLogin: new Date().toISOString(),
    };
    // In a real app, you'd save this to your backend. Here we just mock it.
    // For this demo, signup doesn't persist to mock-data.ts, only logs in the new user.
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', newUser.id);
    setLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
