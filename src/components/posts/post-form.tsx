
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadButton } from "@/components/shared/file-upload-button";
import type { Post, UploadedFile, UserProfile } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addMockPost } from "@/lib/mock-data"; // For mock submission
import { Loader2, XCircle, Paperclip, Image as ImageIconLucide } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "../shared/code-block";
import Image from "next/image";

const postFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters.").max(150, "Title must be less than 150 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(5000),
  codeSnippet: z.string().optional(),
  language: z.string().optional(),
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag) : []),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  currentUser: UserProfile | null; // Pass current user for plan checks
  post?: Post; // For editing mode
}

const popularLanguages = ["javascript", "python", "java", "typescript", "csharp", "cpp", "php", "swift", "go", "ruby", "html", "css", "sql", "bash", "rust", "kotlin", "scala", "perl", "r"];


export function PostForm({ currentUser, post }: PostFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(post?.files || []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      description: post?.description || "",
      codeSnippet: post?.codeSnippet || "",
      language: post?.language || "",
      tags: post?.tags?.join(', ') || "",
    },
  });

  const onSubmit = async (values: PostFormValues) => {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a post.", variant: "destructive" });
      router.push('/login');
      return;
    }
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const newPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'comments' | 'upvotes' | 'isResolved' | 'userId'> & { files: UploadedFile[] } = {
        title: values.title,
        description: values.description,
        codeSnippet: values.codeSnippet,
        language: values.language,
        tags: values.tags,
        files: uploadedFiles,
      };
      
      const createdPost = addMockPost(newPostData, currentUser.id);

      toast({
        title: post ? "Post Updated" : "Post Created Successfully!",
        description: "Your post is now live.",
      });
      router.push(`/posts/${createdPost.id}`);
    } catch (error) {
      console.error("Post submission error:", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesSelected = (newFiles: UploadedFile[]) => {
    const planLimits = currentUser?.plan === 'premium' 
      ? { maxFiles: 10, maxSizeMB: 100 } 
      : { maxFiles: 3, maxSizeMB: 5 };

    const totalFilesAfterAdding = uploadedFiles.length + newFiles.length;
    
    if (totalFilesAfterAdding > planLimits.maxFiles) {
        toast({
            title: "File Limit Exceeded",
            description: `You can upload a maximum of ${planLimits.maxFiles} files. ${newFiles.length - (totalFilesAfterAdding - planLimits.maxFiles)} files were added.`,
            variant: "destructive",
        });
        const filesToAdd = newFiles.slice(0, planLimits.maxFiles - uploadedFiles.length);
        setUploadedFiles(prev => [...prev, ...filesToAdd]);
    } else {
        setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{post ? "Edit Your Post" : "Create a New Post"}</CardTitle>
        <CardDescription>Share your coding challenge with the community and AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., How to fix NullPointerException in Java?" {...field} className="text-base p-3"/>
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive title helps others find and understand your issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Problem Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your problem in detail. What did you try? What was the expected outcome? What actually happened?"
                      className="min-h-[180px] text-base p-3"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Provide as much context as possible. Markdown is supported for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codeSnippet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Code Snippet (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="// Paste relevant code here. Keep it concise."
                      className="min-h-[200px] font-mono text-sm p-3" // Ensure font-mono is applied
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Share the specific code that's causing the issue. Use a minimal reproducible example.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("codeSnippet") && (
                 <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base">Code Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="text-base p-3 h-auto">
                                <SelectValue placeholder="Select language for syntax highlighting" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {popularLanguages.sort().map(lang => (
                                <SelectItem key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</SelectItem>
                            ))}
                            <SelectItem value="other">Other / Plain Text</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Helps with syntax highlighting and allows AI to better understand your code.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
            )}

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., javascript, react, bug, api-error" {...field} className="text-base p-3"/>
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags to categorize your post (e.g., javascript, api, authentication).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-base">Upload Files (Optional)</FormLabel>
              <FileUploadButton onFilesSelected={handleFilesSelected} currentPlan={currentUser?.plan}/>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium">Selected files ({uploadedFiles.length}):</p>
                  <ul className="list-none p-0 space-y-2">
                    {uploadedFiles.map(file => (
                      <li key={file.id} className="flex items-center justify-between text-sm p-3 border rounded-lg bg-muted/50 shadow-sm">
                        <div className="flex items-center gap-2 truncate">
                           {file.type.startsWith('image/') ? (
                             <Image src={file.url} alt={file.name} width={32} height={32} className="mr-2 rounded object-cover h-8 w-8 border border-border" data-ai-hint="thumbnail image"/>
                           ) : (
                            <Paperclip className="h-5 w-5 mr-1 text-muted-foreground flex-shrink-0" />
                           )}
                          <span className="truncate font-medium" title={file.name}>{file.name}</span> 
                          <span className="text-xs text-muted-foreground flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                          <XCircle className="h-5 w-5" />
                           <span className="sr-only">Remove {file.name}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </FormItem>

            <Button type="submit" size="lg" className="w-full text-base py-3" disabled={isLoading || !currentUser}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {post ? "Update Post" : "Submit Post"}
            </Button>
            {!currentUser && <p className="text-sm text-destructive text-center">You must be logged in to submit a post. Please <a href="/login" className="underline">login</a> or <a href="/signup" className="underline">sign up</a>.</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
