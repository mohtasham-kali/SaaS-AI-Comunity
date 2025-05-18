
'use client';

import type { UserProfile, Plan } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getMockUserById, getMockUsers, updateMockUserPlan as mockUpdateUserPlan } from '@/lib/mock-data';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (emailOrId: string, password?: string) => Promise<boolean>; // Changed to accept email or ID
  logout: () => void;
  signup: (name: string, email: string, password?: string) => Promise<boolean>; // Simplified signup
  updateUserPlan: (newPlan: Plan) => Promise<boolean>;
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
    const users = getMockUsers(); // In a real app, this would check a DB
    if (users.some(u => u.email === email)) {
      setLoading(false);
      return false; // User already exists
    }
    
    const newUser: UserProfile = {
      id: `user-${Date.now()}`, // More unique ID for demo
      name,
      email,
      image: `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/200/200`,
      plan: 'free', // New users start on free plan
      aiResponsesToday: 0,
      aiResponsesThisWeek: 0,
      lastLogin: new Date().toISOString(),
      recentActivities: [{id: 'act-signup', type: 'login', description: 'Account created and logged in', timestamp: new Date().toISOString()}]
    };
    // In a real app, you'd save this to your backend.
    // For demo, we are not adding to the static mockUsers array here.
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', newUser.id); // Persist new user for session
    setLoading(false);
    return true;
  };

  const updateUserPlan = async (newPlan: Plan): Promise<boolean> => {
    if (!currentUser) return false;
    setLoading(true);
    // Simulate API call to update plan
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedUser = mockUpdateUserPlan(currentUser.id, newPlan); // This updates the in-memory mock data for demo
    
    if (updatedUser) {
      setCurrentUser(updatedUser); // Update current user state
      localStorage.setItem('currentUser', updatedUser.id); // Re-save to localStorage to reflect plan change
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, updateUserPlan, loading }}>
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
