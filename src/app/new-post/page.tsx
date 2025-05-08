
'use client'; 

import { PostForm } from "@/components/posts/post-form";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This page needs to be within the (main_app) group to get the sidebar layout.
// For now, it functions as a standalone page with its own auth check.
// To integrate with the sidebar, move this file to src/app/(main_app)/new-post/page.tsx

export default function NewPostPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/new-post');
    }
  }, [currentUser, loading, router]);

  // Set document title dynamically
  useEffect(() => {
    document.title = 'New Post - CodeAssist';
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="w-full max-w-3xl">
          <Card>
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
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-12 text-center flex justify-center">
         <div className="w-full max-w-md">
            <Card className="p-8">
                <CardTitle className="text-2xl mb-4">Authentication Required</CardTitle>
                <CardDescription className="mb-6">
                    You need to be logged in to create a new post.
                </CardDescription>
                <Button asChild>
                    <Link href="/login?redirect=/new-post">Login</Link>
                </Button>
            </Card>
        </div>
      </div>
    );
  }
  
  return (
    // This container might be redundant if the page is moved into (main_app) layout
    // which already has padding.
    <div className="container mx-auto py-2 md:py-4 lg:py-6"> {/* Reduced top padding */}
      <PostForm currentUser={currentUser} />
    </div>
  );
}

