
export interface User {
  id: string;
  username: string;
  email?: string | null;
  bio?: string | null;
  avatar_url?: string | null; // URL to avatar image
  githubUsername?: string | null; // For GitHub login
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User; // Embedded user object for easy display
  content: string;
  codeSuggestion?: string; // For AI code suggestions
  language?: string; // Language of the code suggestion
  createdAt: string; // ISO date string
  isAI: boolean; // Flag to identify AI-generated comments
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string; // URL to the stored file (e.g., Firebase Storage URL)
  type: string; // MIME type (e.g., 'image/png', 'application/pdf', 'text/javascript')
  size: number; // File size in bytes
  data_ai_hint?: string; // Optional hint for AI image generation
}

export interface Post {
  id: string;
  title: string;
  description: string; // Detailed description of the issue
  codeSnippet?: string; // Optional code snippet related to the issue
  language?: string; // Programming language of the code snippet (e.g., 'javascript', 'python')
  tags?: string[]; // Keywords to categorize the post
  userId: string;
  user: User; // Embedded user object for easy display
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string (optional for questions)
  comments: Comment[];
  files: UploadedFile[];
  upvotes?: number; // Optional for questions
  isResolved?: boolean; // Optional for questions
}

// New interface for questions (matching your database)
// New interface for questions (matching your database)
export interface Question {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  code_snippet?: string | null;
  tags?: string[] | null;
  created_at: string;
  language?: string | null;
  user: UserProfile; // Embedded user object for easy display
}

// New interface for answers (matching your database)
export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  code?: string | null;
  created_at: string;
  user: UserProfile; // Embedded user object for easy display
}

// New interface for AI requests (matching your database)
export interface AIRequest {
  id: string;
  user_id?: string | null;
  request_type?: string | null;
  input_text?: string | null;
  result?: string | null;
  created_at: string;
}

export type Plan = "free" | "Standard" | "Community";

export interface ActivityItem {
  id: string;
  type: 'forum_post' | 'forum_comment' | 'ai_tool_bug_fixer' | 'ai_tool_code_generator' | 'ai_tool_error_explainer' | 'login';
  description: string; // e.g., "Posted 'How to center a div?'", "Used Bug Fixer for 'TypeError in Python script'"
  timestamp: string; // ISO date string
  link?: string; // Optional link to the post or tool
}

export interface UserProfile extends User {
  plan: string; // Changed to string to match database
  airesponsestoday: number; // Changed to match database field names
  airesponsesthisweek: number; // Changed to match database field names
  lastlogin: string; // Changed to match database field names
  created_at: string; // Added to match database
  recentActivities?: ActivityItem[];
}

// For mock data purposes
export interface MockData {
  users: UserProfile[];
  posts: Post[];
}
