import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Supabase configuration
const supabaseUrl = 'https://kmptgukfmuhzqqiboacy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcHRndWtmbXVoenFxaWJvYWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzY5OTYsImV4cCI6MjA2NzgxMjk5Nn0.wxJZ1TGUxT2zNy7lLEh1XYf8r7xEIZ1xTRibx6K8eDw'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create browser client for client-side operations
export const createSupabaseClient = () => {
  return createBrowserClient(
    'https://kmptgukfmuhzqqiboacy.supabase.co',
    process.env.supabaseAnonKey || supabaseAnonKey
  )
}

// Database types matching your actual Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          plan: string
          airesponsestoday: number
          airesponsesthisweek: number
          lastlogin: string
        }
        Insert: {
          id: string
          username: string
          email?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          plan?: string
          airesponsestoday?: number
          airesponsesthisweek?: number
          lastlogin?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          plan?: string
          airesponsestoday?: number
          airesponsesthisweek?: number
          lastlogin?: string
        }
      }
      questions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          code_snippet: string | null
          tags: string[] | null
          created_at: string
          language: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          code_snippet?: string | null
          tags?: string[] | null
          created_at?: string
          language?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          code_snippet?: string | null
          tags?: string[] | null
          created_at?: string
          language?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          user_id: string
          content: string
          code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          content: string
          code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          content?: string
          code?: string | null
          created_at?: string
        }
      }
      ai_requests: {
        Row: {
          id: string
          user_id: string | null
          request_type: string | null
          input_text: string | null
          result: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          request_type?: string | null
          input_text?: string | null
          result?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          request_type?: string | null
          input_text?: string | null
          result?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
