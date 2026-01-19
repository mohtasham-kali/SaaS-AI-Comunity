'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'
import type { UserProfile, Plan } from '@/types'

interface SupabaseAuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any | null }>
  updateUserPlan: (newPlan: Plan) => Promise<{ error: any | null }>
  resetPassword: (email: string) => Promise<{ error: any | null }>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          username: data.username,
          email: data.email,
          bio: data.bio,
          avatar_url: data.avatar_url,
          plan: data.plan,
          airesponsestoday: data.airesponsestoday,
          airesponsesthisweek: data.airesponsesthisweek,
          lastlogin: data.lastlogin,
          created_at: data.created_at,
          recentActivities: [],
        }
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [supabase])

  const ensureProfile = useCallback(async (user: User) => {
    try {
      // Check if profile exists first to avoid unnecessary upserts
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking for existing profile:", fetchError);
      }

      if (!existingProfile) {
        let baseUsername = user.user_metadata?.name || user.email?.split('@')[0] || "new_user";
        let finalUsername = baseUsername;

        // Check if username exists
        let { data: userCheck } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", finalUsername)
          .maybeSingle();

        let attempt = 1;
        while (userCheck) {
          finalUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
          const { data } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", finalUsername)
            .maybeSingle();
          userCheck = data;
          attempt++;
          if (attempt > 10) break;
        }

        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: finalUsername,
          email: user.email,
          plan: "free",
          airesponsestoday: 0,
          airesponsesthisweek: 0,
          lastlogin: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: false // We want to update if it exists (though it shouldn't if we just checked, but race conditions happen)
        });

        if (profileError) {
          console.error("Error ensuring profile (upsert):", JSON.stringify(profileError, null, 2));
        }
      } else {
        // Profile exists, just update last login
        await supabase
          .from('profiles')
          .update({ lastlogin: new Date().toISOString() })
          .eq('id', user.id);
      }

      await fetchProfile(user.id);
    } catch (err) {
      console.error("Error ensuring profile (catch):", err);
    }
  }, [supabase, fetchProfile]);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await ensureProfile(session.user)
      }

      setLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          if (window.location.pathname !== '/reset-password') {
            window.location.href = '/reset-password';
          }
          return;
        }

        setSession(session)
        setUser(session?.user ?? null)

        try {
          if (session?.user) {
            await ensureProfile(session.user)
          } else {
            setProfile(null)
          }
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, ensureProfile])






  const signUp = async (email: string, password: string, name: string) => {
    console.log('Starting signup for email:', email)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })

      console.log('Auth signup response:', { data, error })

      if (error) {
        console.error('Auth signup error:', error)
        return { error: error as Error }
      }

      // ✅ Profile will be created in onAuthStateChange
      return { error: null }
    } catch (error) {
      console.error('Signup catch error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error as Error }

      if (user) {
        await supabase
          .from('profiles')
          .update({ lastlogin: new Date().toISOString() })
          .eq('id', user.id)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: { message: 'No user logged in' } as Error }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          bio: updates.bio,
          avatar_url: updates.avatar_url,
        })
        .eq('id', user.id)

      if (error) return { error }

      if (profile) {
        setProfile({ ...profile, ...updates })
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateUserPlan = async (newPlan: Plan) => {
    if (!user) return { error: { message: 'No user logged in' } as Error }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan })
        .eq('id', user.id)

      if (error) return { error }

      if (profile) {
        setProfile({ ...profile, plan: newPlan })
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) return { error: error as Error }
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateUserPlan,
    resetPassword,
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

