import { PostCard } from "@/components/posts/post-card";
import { Button } from "@/components/ui/button";
import { getMockPosts } from "@/lib/mock-data";
import type { Post } from "@/types";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  // In a real app, you'd fetch posts from your backend/Firebase
  const posts: Post[] = getMockPosts();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-card rounded-lg shadow-md">
        <div className="container mx-auto">
          <Image 
            src="https://picsum.photos/seed/codehero/1200/400" 
            alt="Developers collaborating" 
            width={1200} 
            height={400} 
            className="w-full h-auto max-h-60 object-cover rounded-t-lg"
            data-ai-hint="team collaboration"
          />
          <div className="p-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Welcome to <span className="text-primary">CodeAssist</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              Your AI-powered community for solving coding challenges, debugging issues, and sharing knowledge.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link href="/new-post">
                  <PlusCircle className="mr-2 h-5 w-5" /> Ask a Question
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold tracking-tight mb-6 text-foreground border-b pb-2">
          Latest Posts
        </h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-xl text-muted-foreground">No posts yet. Be the first to ask a question!</p>
            <Button asChild className="mt-4">
              <Link href="/new-post">Create New Post</Link>
            </Button>
          </div>
        )}
      </section>

      <section id="faq" className="py-12 bg-card rounded-lg shadow-md mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8 text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-xl font-medium text-primary">What is CodeAssist?</h3>
              <p className="text-muted-foreground mt-2">CodeAssist is a platform where developers can post coding issues and get help from both the community and an advanced AI system. If no human replies within 10 minutes, our AI steps in to provide solutions.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-primary">What AI models do you use?</h3>
              <p className="text-muted-foreground mt-2">Free users get access to OpenAI GPT-4 and Google Gemini Pro. Premium users get access to additional models like Claude, Amazon CodeWhisperer, and Blackbox AI, along with priority support.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-primary">How do file uploads work?</h3>
              <p className="text-muted-foreground mt-2">Free users can upload up to 3 files (max 5MB each) per post. Premium users can upload up to 10 files (max 100MB each) and benefit from AI analysis of uploaded files.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
