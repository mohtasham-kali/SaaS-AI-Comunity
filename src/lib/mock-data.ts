
import type { UserProfile, Post, Comment, UploadedFile, ActivityItem, Plan } from '@/types';

const mockUsers: UserProfile[] = [
  {
    id: 'user1',
    name: 'Alice Coder',
    email: 'alice@example.com',
    image: 'https://picsum.photos/seed/alice/200/200',
    plan: 'Standard', // Updated plan
    aiResponsesToday: 15, // Example usage for Standard
    aiResponsesThisWeek: 50, // Example usage for Standard
    lastLogin: new Date().toISOString(),
    recentActivities: [
      { id: 'act1', type: 'forum_post', description: "Posted 'NullPointerException in Java Spring Boot App'", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), link: '/posts/post1' },
      { id: 'act2', type: 'ai_tool_bug_fixer', description: "Used Bug Fixer for 'Java Spring Boot NPE'", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), link: '/dashboard/tools/bug-fixer' },
      { id: 'act3', type: 'login', description: "Logged in to the platform", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
      { id: 'act9', type: 'forum_comment', description: "Replied to 'CSS Flexbox centering'", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), link: '/posts/post2' },
    ],
  },
  {
    id: 'user2',
    name: 'Bob Debugger',
    email: 'bob@example.com',
    image: 'https://picsum.photos/seed/bob/200/200',
    plan: 'free', // Stays free
    aiResponsesToday: 1,
    aiResponsesThisWeek: 3,
    lastLogin: new Date().toISOString(),
    recentActivities: [
      { id: 'act4', type: 'forum_comment', description: "Commented on 'NullPointerException in Java'", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), link: '/posts/post1' },
      { id: 'act5', type: 'ai_tool_error_explainer', description: "Used Error Explainer for 'CSS Flexbox issue'", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), link: '/dashboard/tools/error-explainer'},
      { id: 'act6', type: 'login', description: "Logged in successfully", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    ],
  },
  {
    id: 'user3',
    name: 'AI Assistant',
    email: 'ai@example.com',
    image: 'https://picsum.photos/seed/ai/200/200',
    plan: 'Community', // AI can be on Community
    aiResponsesToday: 0, // AI doesn't consume its own limits
    aiResponsesThisWeek: 0,
    lastLogin: new Date().toISOString(),
    recentActivities: [],
  },
  {
    id: 'user4',
    name: 'Mohtasham Siddiqui',
    email: 'mohtasham.siddiqui17@gmail.com',
    image: 'https://picsum.photos/seed/mohtasham/200/200',
    plan: 'Community', // Updated plan
    aiResponsesToday: 10, // Example usage for Community (though unlimited)
    aiResponsesThisWeek: 50, // Example usage for Community (though unlimited)
    lastLogin: new Date().toISOString(),
    recentActivities: [
      { id: 'act7', type: 'login', description: "Logged in", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { id: 'act8', type: 'ai_tool_code_generator', description: "Used Code Generator for 'React login form'", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), link: '/dashboard/tools/code-generator'},
      { id: 'act10', type: 'forum_post', description: "Asked 'How to setup Tailwind CSS with Next.js 14?'", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), link: '#' }, // Placeholder link
    ],
  },
];

const mockFiles: UploadedFile[] = [
    { id: 'file1', name: 'screenshot.png', url: 'https://placehold.co/600x400.png', type: 'image/png', size: 1024 * 500, data_ai_hint: 'screenshot error' },
    { id: 'file2', name: 'error_log.txt', url: '#', type: 'text/plain', size: 1024 * 10, data_ai_hint: 'text document' },
];

const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    userId: 'user2',
    user: mockUsers.find(u => u.id === 'user2')!,
    content: "Have you tried restarting your IDE? Sometimes that helps with caching issues.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isAI: false,
  },
  {
    id: 'comment2',
    postId: 'post1',
    userId: 'user3', // AI User
    user: mockUsers.find(u => u.id === 'user3')!,
    content: "I've analyzed your code snippet. It seems like there's a potential null pointer exception on line 42. Here's a suggested fix:",
    codeSuggestion: "if (variable !== null) {\n  // your code here\n}",
    language: 'javascript',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    isAI: true,
  },
   {
    id: 'comment3',
    postId: 'post2',
    userId: 'user1', 
    user: mockUsers.find(u => u.id === 'user1')!,
    content: "To center with Flexbox, you typically need `justify-content: center;` and `align-items: center;` on the parent. Make sure the parent has a defined height if you're centering vertically within it.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), 
    isAI: false,
  },
];


const mockPosts: Post[] = [
  {
    id: 'post1',
    title: 'NullPointerException in Java Spring Boot App',
    description: "I'm encountering a NullPointerException in my Spring Boot application when trying to access a service. I've attached the relevant controller and service code. The error occurs specifically on line 42 of `MyService.java`. Any ideas what might be causing this? I've been stuck for hours!",
    codeSnippet: `// MyController.java
@RestController
public class MyController {
    @Autowired
    private MyService myService;

    @GetMapping("/data")
    public String getData() {
        return myService.processData(); // Error seems to originate here
    }
}

// MyService.java
@Service
public class MyService {
    public String processData() {
        String data = null;
        // ... some logic ...
        return data.toUpperCase(); // Line 42: Potential NPE if data is null
    }
}`,
    language: 'java',
    tags: ['java', 'spring-boot', 'npe'],
    userId: 'user1',
    user: mockUsers.find(u => u.id === 'user1')!,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    comments: [], // Will be populated below
    files: [mockFiles[0]],
    upvotes: 15,
    isResolved: false,
  },
  {
    id: 'post2',
    title: 'How to center a div using Flexbox?',
    description: "I'm trying to center a div both horizontally and vertically within its parent container using Flexbox. I've tried various combinations of `justify-content` and `align-items`, but it's not working as expected. Here's my current CSS. What am I missing?",
    codeSnippet: `.parent {
  display: flex;
  height: 300px;
  border: 1px solid black;
}

.child {
  width: 100px;
  height: 100px;
  background-color: lightblue;
  /* How to center this? */
}`,
    language: 'css',
    tags: ['css', 'flexbox', 'layout'],
    userId: 'user2',
    user: mockUsers.find(u => u.id === 'user2')!,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    comments: [], // Will be populated below
    files: [],
    upvotes: 25,
    isResolved: true,
  },
];

// Initialize comments for posts correctly
mockPosts.forEach(post => {
    post.comments = mockComments
        .filter(comment => comment.postId === post.id)
        .map(comment => ({
            ...comment,
            user: mockUsers.find(u => u.id === comment.userId)!
        }));
    post.user = mockUsers.find(u => u.id === post.userId)!;
});


export function getMockUsers(): UserProfile[] {
  return JSON.parse(JSON.stringify(mockUsers));
}

export function getMockUserById(id: string): UserProfile | undefined {
  const user = mockUsers.find(user => user.id === id);
  if (user) {
    return JSON.parse(JSON.stringify(user));
  }
  return undefined;
}

export function getMockPosts(): Post[] {
  return JSON.parse(JSON.stringify(mockPosts.map(post => ({
    ...post,
    user: mockUsers.find(u => u.id === post.userId)!,
    comments: post.comments.map(comment => ({
        ...comment,
        user: mockUsers.find(u => u.id === comment.userId)!
    }))
  }))));
}

export function getMockPostById(id: string): Post | undefined {
  const post = mockPosts.find(p => p.id === id);
  if (!post) return undefined;
  return JSON.parse(JSON.stringify({
    ...post,
    user: mockUsers.find(u => u.id === post.userId)!,
    comments: post.comments.map(comment => ({
        ...comment,
        user: mockUsers.find(u => u.id === comment.userId)!
    }))
  }));
}

export function addMockPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'comments' | 'upvotes' | 'isResolved' | 'userId'>, userId: string): Post {
    const user = getMockUserById(userId);
    if (!user) throw new Error("User not found");

    const newPost: Post = {
        ...post,
        id: `post${mockPosts.length + 1 + Date.now()}`, // Make ID more unique
        userId,
        user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        files: post.files || [],
        upvotes: 0,
        isResolved: false,
    };
    mockPosts.unshift(newPost); // Add to the beginning of the array
    return JSON.parse(JSON.stringify(newPost));
}

export function addMockComment(postId: string, comment: Omit<Comment, 'id' | 'postId' | 'createdAt' | 'user'>, userId: string): Comment {
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    const user = mockUsers.find(u => u.id === userId);

    if (postIndex === -1 || !user) throw new Error("Post or User not found");

    const newComment: Comment = {
        ...comment,
        id: `comment${mockPosts[postIndex].comments.length + Date.now()}`, // Make ID more unique
        postId,
        userId,
        user,
        createdAt: new Date().toISOString(),
    };
    mockPosts[postIndex].comments.push(newComment); // Add to the comments array of the specific post
    return JSON.parse(JSON.stringify(newComment));
}

// Function to update a user's plan (mock)
export function updateMockUserPlan(userId: string, newPlan: Plan): UserProfile | undefined {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].plan = newPlan;
    // Optionally reset AI usage counts or adjust based on new plan
    // For simplicity, we'll just update the plan here.
    // Components will re-evaluate limits based on the new plan.
    return JSON.parse(JSON.stringify(mockUsers[userIndex]));
  }
  return undefined;
}
