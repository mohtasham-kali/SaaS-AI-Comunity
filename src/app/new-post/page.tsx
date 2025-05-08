'use client'; // Required for using hooks like useAuth

import { PostForm } from "@/components/posts/post-form";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// No metadata export from client component

export default function NewPostPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/new-post');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by the redirect,
    // but as a fallback or if redirect is slow:
    return (
      <div className="container mx-auto py-12 text-center">
        <Card className="max-w-md mx-auto p-8">
            <CardTitle className="text-2xl mb-4">Authentication Required</CardTitle>
            <CardDescription className="mb-6">
                You need to be logged in to create a new post.
            </CardDescription>
            <Button asChild>
                <Link href="/login?redirect=/new-post">Login</Link>
            </Button>
        </Card>
      </div>
    );
  }
  
  // Metadata can be set dynamically using document.title if needed, or use a server component wrapper for static metadata.
  if (typeof window !== "undefined") {
    document.title = 'New Post - CodeAssist';
  }


  return (
    <div className="container mx-auto py-8">
      <PostForm currentUser={currentUser} />
    </div>
  );
}
