import { PostItem } from "@/components/posts/post-item";
import { getMockPostById } from "@/lib/mock-data";
import type { Post } from "@/types";
import type { Metadata, ResolvingMetadata } from 'next';
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = getMockPostById(params.id);
  if (!post) {
    return {
      title: 'Post Not Found - CodeAssist',
    };
  }
  return {
    title: `${post.title} - CodeAssist`,
    description: post.description.substring(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const post: Post | undefined = getMockPostById(params.id);

  if (!post) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Card className="max-w-lg mx-auto p-8 shadow-lg">
            <CardHeader className="flex flex-col items-center">
                <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
                <CardTitle className="text-3xl font-bold text-destructive">Post Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-muted-foreground mb-6">
                    Sorry, we couldn&apos;t find the post you were looking for. It might have been removed or the link is incorrect.
                </p>
                <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PostItem post={post} />
    </div>
  );
}
