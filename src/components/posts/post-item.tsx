
'use client';

import type { Post, Comment, UploadedFile, UserProfile, Plan } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/shared/code-block';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ThumbsUp, MessageSquare, CheckCircle2, XCircle, Paperclip, Download, Bot, User, Send, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { addMockComment, getMockUserById } from '@/lib/mock-data';
import { suggestWorkingCodeSolutions, type SuggestWorkingCodeSolutionsInput, type SuggestWorkingCodeSolutionsOutput } from '@/ai/flows/suggest-working-code-solutions';
import NextImage from "next/image"; 
import Link from 'next/link';

interface PostItemProps {
  post: Post;
}

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty.").max(2000, "Comment too long."),
});
type CommentFormValues = z.infer<typeof commentSchema>;

const planAiLimits = {
  free: { daily: 3, weekly: 10 },
  Standard: { daily: 50, weekly: 200 },
  Community: { daily: Infinity, weekly: Infinity },
};

export function PostItem({ post: initialPost }: PostItemProps) {
  const [post, setPost] = useState<Post>(initialPost);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : name.substring(0, 2);
  };

  const handleCommentSubmit = async (values: CommentFormValues) => {
    if (!currentUser) {
      toast({ title: "Not Logged In", description: "Please log in to comment.", variant: "destructive" });
      return;
    }
    const newComment = addMockComment(post.id, { content: values.content, isAI: false }, currentUser.id);
    setPost(prevPost => ({
      ...prevPost,
      comments: [...prevPost.comments, newComment],
    }));
    form.reset();
    toast({ title: "Comment Added", description: "Your comment has been posted." });
  };

  const handleAiSuggestion = async () => {
    if (!currentUser) {
      toast({ title: "Not Logged In", description: "Please log in to use AI features.", variant: "destructive" });
      return;
    }
    
    const limits = planAiLimits[currentUser.plan];
    let toastDescription = "";
    let limitReached = false;

    if (currentUser.plan === 'free' && (currentUser.aiResponsesToday >= limits.daily || currentUser.aiResponsesThisWeek >= limits.weekly)) {
        limitReached = true;
        toastDescription = `Free plan AI response limit reached. Today: ${currentUser.aiResponsesToday}/${limits.daily}, Week: ${currentUser.aiResponsesThisWeek}/${limits.weekly}. Upgrade for more.`;
    } else if (currentUser.plan === 'Standard' && (currentUser.aiResponsesToday >= limits.daily || currentUser.aiResponsesThisWeek >= limits.weekly)) {
        limitReached = true;
        toastDescription = `Standard plan AI response limit reached. Today: ${currentUser.aiResponsesToday}/${limits.daily}, Week: ${currentUser.aiResponsesThisWeek}/${limits.weekly}. Upgrade for more.`;
    }
    
    if (limitReached) {
        toast({ title: "AI Limit Reached", description: toastDescription, variant: "destructive" });
        return;
    }

    setIsAiLoading(true);
    try {
      const input: SuggestWorkingCodeSolutionsInput = {
        codingProblem: post.description,
        codeSnippet: post.codeSnippet,
        // uploadedFiles: fileDataUris.length > 0 ? fileDataUris : undefined, // Not passing files for now
      };
      const aiResponse: SuggestWorkingCodeSolutionsOutput = await suggestWorkingCodeSolutions(input);
      
      const aiUser = getMockUserById('user3') || { id: 'user3', name: 'AI Assistant', image: 'https://picsum.photos/seed/ai/40/40', plan: 'Community', aiResponsesToday:0, aiResponsesThisWeek:0, lastLogin: new Date().toISOString() } as UserProfile;

      const aiComment: Comment = {
        id: `comment-ai-${Date.now()}`,
        postId: post.id,
        userId: aiUser.id,
        user: aiUser,
        content: aiResponse.explanation,
        codeSuggestion: aiResponse.suggestedSolution,
        language: post.language || 'plaintext',
        createdAt: new Date().toISOString(),
        isAI: true,
      };
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, aiComment],
      }));
      
      if (currentUser) { 
        currentUser.aiResponsesToday = (currentUser.aiResponsesToday || 0) + 1;
        currentUser.aiResponsesThisWeek = (currentUser.aiResponsesThisWeek || 0) + 1;
      }

      toast({ title: "AI Suggestion Received", description: "AI has provided a solution." });

    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({ 
        title: "AI Error", 
        description: "Failed to get AI suggestion. Please ensure your internet connection is stable and the AI service is reachable. If the issue persists, the AI service might be temporarily unavailable or there could be a local server configuration problem (e.g., Genkit server not running). Please try again later.", 
        variant: "destructive" 
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const [showAiPromptButton, setShowAiPromptButton] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (post.comments.filter(c => !c.isAI).length === 0) {
        setShowAiPromptButton(true);
      }
    }, 10 * 60 * 1000); 
    return () => clearTimeout(timer);
  }, [post.comments, post.createdAt]);


  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-primary" />;
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-primary" />;
    return <Paperclip className="h-5 w-5 text-primary" />;
  };


  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={post.user.image || undefined} alt={post.user.name || "User Avatar"} data-ai-hint="profile avatar"/>
              <AvatarFallback className="text-lg">{getInitials(post.user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl lg:text-3xl mb-1">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                By <span className="font-medium text-foreground">{post.user.name}</span> &bull; Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="prose prose-sm sm:prose prose-invert max-w-none text-foreground/90 whitespace-pre-line">
            <p>{post.description}</p>
          </div>

          {post.codeSnippet && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Code Snippet:</h3>
              <CodeBlock code={post.codeSnippet} language={post.language} />
            </div>
          )}

          {post.files && post.files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Attached Files:</h3>
              <ul className="space-y-3">
                {post.files.map((file) => (
                  <li key={file.id} className="p-3 border rounded-lg bg-muted/40 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 truncate">
                        {getFileIcon(file.type)}
                        <span className="font-medium truncate" title={file.name}>{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / (1024*1024)).toFixed(2)} MB)</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" download={file.name}>
                          <Download className="h-4 w-4 mr-2" /> Preview/Download
                        </a>
                      </Button>
                    </div>
                    {file.type.startsWith('image/') && (
                      <div className="mt-3 rounded-md overflow-hidden border border-border max-w-md">
                         <NextImage src={file.url} alt={`Preview of ${file.name}`} width={600} height={400} className="object-contain w-full h-auto" data-ai-hint="file preview" />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
              ))}
            </div>
          )}

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center bg-muted/30 p-4 border-t space-y-2 sm:space-y-0">
           <div className="flex space-x-4 text-muted-foreground">
            <Button variant="ghost" size="sm"><ThumbsUp className="h-4 w-4 mr-1" /> {post.upvotes} Upvotes</Button>
            <span className="flex items-center text-sm"><MessageSquare className="h-4 w-4 mr-1" /> {post.comments.length} Comments</span>
          </div>
          <span className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${post.isResolved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {post.isResolved ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
            {post.isResolved ? 'Resolved' : 'Open'}
          </span>
        </CardFooter>
      </Card>
      
      {showAiPromptButton && !post.comments.some(c => c.isAI) && (
         <Card className="bg-primary/10 border-primary/30 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-primary"><Bot className="h-6 w-6 mr-2" /> AI Assistance Available</CardTitle>
                <CardDescription className="text-primary/80">
                    No human responses yet after 10 minutes. Would you like an AI-generated suggestion?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAiSuggestion} disabled={isAiLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    {isAiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isAiLoading ? "Generating..." : "Get AI Suggestion"}
                </Button>
            </CardContent>
        </Card>
      )}
      {!post.comments.some(c => c.isAI) && !showAiPromptButton && (
        <div className="text-center py-4">
          <Button variant="outline" onClick={handleAiSuggestion} disabled={isAiLoading}>
            {isAiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             <Bot className="h-4 w-4 mr-2" /> {isAiLoading ? "AI Thinking..." : "Ask AI for Help"}
          </Button>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b pb-2">
          {post.comments.length} Comment{post.comments.length === 1 ? '' : 's'}
        </h3>
        {post.comments.length === 0 && <p className="text-muted-foreground">No comments yet. Be the first to respond or ask AI for help!</p>}
        {post.comments.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment) => (
          <Card key={comment.id} className={`overflow-hidden shadow-md ${comment.isAI ? 'bg-card border-primary/50' : 'bg-card'}`}>
            <CardHeader className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border">
                   <AvatarImage src={comment.user.image || undefined} alt={comment.user.name || "User Avatar"} data-ai-hint="abstract user"/>
                  <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {comment.user.name} {comment.isAI && <Badge variant="outline" className="ml-2 border-primary/70 text-primary bg-primary/10 text-xs px-2 py-0.5"><Bot className="h-3 w-3 mr-1"/>AI Assistant</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="prose prose-sm prose-invert max-w-none text-foreground/90 whitespace-pre-line">
                <p>{comment.content}</p>
              </div>
              {comment.codeSuggestion && (
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-1 text-muted-foreground">Suggested Code ({comment.language || 'plaintext'}):</p>
                  <CodeBlock code={comment.codeSuggestion} language={comment.language} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser && (
        <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-xl">Leave a Comment</CardTitle></CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCommentSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Textarea placeholder="Share your thoughts or solution..." className="min-h-[100px] text-base" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting || isAiLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {(form.formState.isSubmitting || isAiLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="mr-2 h-4 w-4" /> Post Comment
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      )}
      {!currentUser && (
        <Card className="p-6 text-center shadow-lg">
            <p className="text-muted-foreground">
            <Link href={`/login?redirect=/posts/${post.id}`} className="text-primary hover:underline font-semibold">Log in</Link> or <Link href={`/signup?redirect=/posts/${post.id}`} className="text-primary hover:underline font-semibold">Sign up</Link> to leave a comment.
            </p>
        </Card>
      )}
    </div>
  );
}
