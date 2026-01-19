import { createSupabaseClient } from './supabase'
import { UserProfile, Question, Answer, AIRequest } from '@/types'
import type { Database } from './supabase'

type Tables = Database['public']['Tables']
type Profile = Tables['profiles']['Row']
type QuestionRow = Tables['questions']['Row']
type AnswerRow = Tables['answers']['Row']
type AIRequestRow = Tables['ai_requests']['Row']

const supabase = createSupabaseClient()

// Profile functions
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return null

    return {
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
      recentActivities: [] // Will be fetched separately
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    return !error
  } catch (error) {
    console.error('Error updating profile:', error)
    return false
  }
}

// Questions functions
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const supabase = createSupabaseClient() // Fresh client with current session
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        profiles!questions_user_id_fkey (
          id,
          username,
          email,
          bio,
          avatar_url,
          plan,
          airesponsestoday,
          airesponsesthisweek,
          lastlogin,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map(question => {
      const profile = question.profiles;
      return {
        id: question.id,
        user_id: question.user_id,
        title: question.title,
        description: question.description,
        code_snippet: question.code_snippet,
        tags: question.tags,
        created_at: question.created_at,
        language: question.language,
        user: {
          id: profile?.id || question.user_id || 'unknown',
          username: profile?.username || 'Deleted User',
          email: profile?.email || '',
          bio: profile?.bio || '',
          avatar_url: profile?.avatar_url || '',
          plan: profile?.plan || 'free',
          airesponsestoday: profile?.airesponsestoday || 0,
          airesponsesthisweek: profile?.airesponsesthisweek || 0,
          lastlogin: profile?.lastlogin || new Date().toISOString(),
          created_at: profile?.created_at || new Date().toISOString(),
          recentActivities: []
        }
      };
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return []
  }
}

export const getQuestion = async (questionId: string): Promise<Question | null> => {
  try {
    const supabase = createSupabaseClient() // Fresh client with current session
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        profiles!questions_user_id_fkey (
          id,
          username,
          email,
          bio,
          avatar_url,
          plan,
          airesponsestoday,
          airesponsesthisweek,
          lastlogin,
          created_at
        )
      `)
      .eq('id', questionId)
      .single()

    if (error || !data) return null

    const profile = data.profiles;
    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      description: data.description,
      code_snippet: data.code_snippet,
      tags: data.tags,
      created_at: data.created_at,
      language: data.language,
      user: {
        id: profile?.id || data.user_id || 'unknown',
        username: profile?.username || 'Deleted User',
        email: profile?.email || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        plan: profile?.plan || 'free',
        airesponsestoday: profile?.airesponsestoday || 0,
        airesponsesthisweek: profile?.airesponsesthisweek || 0,
        lastlogin: profile?.lastlogin || new Date().toISOString(),
        created_at: profile?.created_at || new Date().toISOString(),
        recentActivities: []
      }
    }
  } catch (error) {
    console.error('Error fetching question:', error)
    return null
  }
}

export const createQuestion = async (question: Omit<Question, 'id' | 'created_at' | 'user' | 'user_id'>, userId: string): Promise<Question | null> => {
  try {
    const supabase = createSupabaseClient() // Fresh client with current session
    const { data, error } = await supabase
      .from('questions')
      .insert({
        user_id: userId,
        title: question.title,
        description: question.description,
        code_snippet: question.code_snippet,
        tags: question.tags,
        language: question.language
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Supabase insert error:', error);
      return null;
    }

    // Fetch the created question with user data
    return await getQuestion(data.id)
  } catch (error) {
    console.error('Error creating question:', error)
    return null
  }
}

export const updateQuestion = async (questionId: string, updates: Partial<QuestionRow>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', questionId)

    return !error
  } catch (error) {
    console.error('Error updating question:', error)
    return false
  }
}

export const deleteQuestion = async (questionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId)

    return !error
  } catch (error) {
    console.error('Error deleting question:', error)
    return false
  }
}

// Answers functions
export const getAnswers = async (questionId: string): Promise<Answer[]> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select(`
        *,
        profiles!answers_user_id_fkey (
          id,
          username,
          email,
          bio,
          avatar_url,
          plan,
          airesponsestoday,
          airesponsesthisweek,
          lastlogin,
          created_at
        )
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })

    if (error || !data) return []

    return data.map(answer => {
      const profile = answer.profiles;
      return {
        id: answer.id,
        question_id: answer.question_id,
        user_id: answer.user_id,
        content: answer.content,
        code: answer.code,
        created_at: answer.created_at,
        user: {
          id: profile?.id || answer.user_id || 'unknown',
          username: profile?.username || 'Deleted User',
          email: profile?.email || '',
          bio: profile?.bio || '',
          avatar_url: profile?.avatar_url || '',
          plan: profile?.plan || 'free',
          airesponsestoday: profile?.airesponsestoday || 0,
          airesponsesthisweek: profile?.airesponsesthisweek || 0,
          lastlogin: profile?.lastlogin || new Date().toISOString(),
          created_at: profile?.created_at || new Date().toISOString(),
          recentActivities: []
        }
      };
    })
  } catch (error) {
    console.error('Error fetching answers:', error)
    return []
  }
}

export const createAnswer = async (answer: Omit<Answer, 'id' | 'created_at' | 'user'>, userId: string): Promise<Answer | null> => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: answer.question_id,
        user_id: userId,
        content: answer.content,
        code: answer.code
      })
      .select()
      .single()

    if (error || !data) return null

    // Fetch the created answer with user data
    const { data: answerWithUser, error: userError } = await supabase
      .from('answers')
      .select(`
        *,
        profiles!answers_user_id_fkey (
          id,
          username,
          email,
          bio,
          avatar_url,
          plan,
          airesponsestoday,
          airesponsesthisweek,
          lastlogin,
          created_at
        )
      `)
      .eq('id', data.id)
      .single()

    if (userError || !answerWithUser) return null

    const profile = answerWithUser.profiles;
    return {
      id: answerWithUser.id,
      question_id: answerWithUser.question_id,
      user_id: answerWithUser.user_id,
      content: answerWithUser.content,
      code: answerWithUser.code,
      created_at: answerWithUser.created_at,
      user: {
        id: profile?.id || answerWithUser.user_id || 'unknown',
        username: profile?.username || 'Deleted User',
        email: profile?.email || '',
        bio: profile?.bio || '',
        avatar_url: profile?.avatar_url || '',
        plan: profile?.plan || 'free',
        airesponsestoday: profile?.airesponsestoday || 0,
        airesponsesthisweek: profile?.airesponsesthisweek || 0,
        lastlogin: profile?.lastlogin || new Date().toISOString(),
        created_at: profile?.created_at || new Date().toISOString(),
        recentActivities: []
      }
    }
  } catch (error) {
    console.error('Error creating answer:', error)
    return null
  }
}

// AI Requests functions
export const createAIRequest = async (request: Omit<AIRequest, 'id' | 'created_at'>, userId?: string): Promise<AIRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_requests')
      .insert({
        user_id: userId,
        request_type: request.request_type,
        input_text: request.input_text,
        result: request.result
      })
      .select()
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      user_id: data.user_id,
      request_type: data.request_type,
      input_text: data.input_text,
      result: data.result,
      created_at: data.created_at
    }
  } catch (error) {
    console.error('Error creating AI request:', error)
    return null
  }
}

export const getAIRequests = async (userId: string, limit: number = 10): Promise<AIRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map(request => ({
      id: request.id,
      user_id: request.user_id,
      request_type: request.request_type,
      input_text: request.input_text,
      result: request.result,
      created_at: request.created_at
    }))
  } catch (error) {
    console.error('Error fetching AI requests:', error)
    return []
  }
}