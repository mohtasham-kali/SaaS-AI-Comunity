
'use client';

import { useState, useEffect } from 'react';
import type { Post } from '@/types';
import { getMockPosts } from '@/lib/mock-data';
import { PostCard } from '@/components/posts/post-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { PlusCircle, Search, ListFilter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth/auth-provider'; // To ensure user is loaded for potential filtering/actions

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();


  useEffect(() => {
    if (!authLoading) { // Fetch posts once auth state is resolved
        const fetchedPosts = getMockPosts();
        setPosts(fetchedPosts);
        setIsLoading(false);
    }
  }, [authLoading]);

  const filteredAndSortedPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });

  if (isLoading || authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Skeleton className="h-10 w-full md:w-1/2" />
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-1/2 md:w-32" />
            <Skeleton className="h-10 w-1/2 md:w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">CodeAssist Forum</h1>
            <p className="text-muted-foreground">Ask questions, share solutions, and learn with the community.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/new-post">
            <PlusCircle className="mr-2 h-5 w-5" /> New Post
          </Link>
        </Button>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
        <div className="relative flex-grow w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 h-11 text-base"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 text-base">
            <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="upvotes">Most Upvoted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No posts found matching your criteria.</p>
          {searchTerm && <p className="mt-2">Try adjusting your search or filter.</p>}
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
    <div className="flex items-center space-x-3 mb-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <div className="flex justify-between items-center pt-4 border-t mt-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

