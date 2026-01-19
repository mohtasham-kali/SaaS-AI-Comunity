
'use client';

import type { UserProfile, Plan } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSupabaseAuth } from './supabase-auth-provider';

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
  const supabaseAuth = useSupabaseAuth();

  const login = async (emailOrId: string, password?: string): Promise<boolean> => {
    if (!password) return false;
    
    const { error } = await supabaseAuth.signIn(emailOrId, password);
    return !error;
  };

  const logout = async () => {
    await supabaseAuth.signOut();
  };

  const signup = async (name: string, email: string, password?: string): Promise<boolean> => {
    if (!password) return false;
    
    const { error } = await supabaseAuth.signUp(email, password, name);
    return !error;
  };

  const updateUserPlan = async (newPlan: Plan): Promise<boolean> => {
    const { error } = await supabaseAuth.updateUserPlan(newPlan);
    return !error;
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser: supabaseAuth.profile, 
      login, 
      logout, 
      signup, 
      updateUserPlan, 
      loading: supabaseAuth.loading 
    }}>
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
