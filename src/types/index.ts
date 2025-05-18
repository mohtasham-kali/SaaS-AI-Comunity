
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null; // URL to avatar image
  githubUsername?: string | null; // For GitHub login
}

export interface Comment {
  id:string;
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
  updatedAt: string; // ISO date string
  comments: Comment[];
  files: UploadedFile[];
  upvotes: number;
  isResolved: boolean;
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
  plan: Plan;
  aiResponsesToday: number;
  aiResponsesThisWeek: number;
  lastLogin: string; // ISO date string
  recentActivities?: ActivityItem[];
}

// For mock data purposes
export interface MockData {
  users: UserProfile[];
  posts: Post[];
}
