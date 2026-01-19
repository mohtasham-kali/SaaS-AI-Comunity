
import { PostItem } from "@/components/posts/post-item";
import { getQuestion } from "@/lib/supabase-database";
import type { Post } from "@/types";
import type { Metadata, ResolvingMetadata } from 'next';
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: { id: string };
};

// This page needs to be within the (main_app) group to get the sidebar layout.
// For now, it functions as a standalone page.
// To integrate with the sidebar, move this file to src/app/(main_app)/posts/[id]/page.tsx

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const question = await getQuestion(params.id);
  if (!question) {
    return {
      title: 'Post Not Found - CodeAssist',
    };
  }
  return {
    title: `${question.title} - CodeAssist`,
    description: question.description?.substring(0, 160) || '',
  };
}

export default async function PostPage({ params }: Props) {
  const question = await getQuestion(params.id);

  if (!question) {
    return (
      <div className="container mx-auto py-12 text-center flex justify-center">
        <div className="w-full max-w-lg">
          <Card className="p-8 shadow-lg">
            <CardHeader className="flex flex-col items-center">
              <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
              <CardTitle className="text-3xl font-bold text-destructive">Post Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Sorry, we couldn&apos;t find the post you were looking for. It might have been removed or the link is incorrect.
              </p>
              <Button asChild>
                <Link href="/forum">Go to Forum</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Map Question to Post for compatibility with PostItem
  const post: Post = {
    id: question.id,
    title: question.title,
    description: question.description || '',
    codeSnippet: question.code_snippet || undefined,
    language: question.language || undefined,
    tags: question.tags || [],
    userId: question.user_id,
    user: question.user,
    createdAt: question.created_at,
    comments: [], // TODO: Fetch answers
    files: [],
    upvotes: 0,
    isResolved: false,
  };

  return (
    // This container might be redundant if the page is moved into (main_app) layout.
    <div className="container mx-auto py-6 md:py-8"> {/* Reduced top padding */}
      <PostItem post={post} />
    </div>
  );
}

