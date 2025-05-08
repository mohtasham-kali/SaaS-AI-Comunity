
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
import { useAuth } from '@/components/auth/auth-provider'; 

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();


  useEffect(() => {
    if (!authLoading) { 
        const fetchedPosts = getMockPosts();
        setPosts(fetchedPosts);
        setIsLoading(false);
    }
  }, [authLoading]);

  const filteredAndSortedPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Skeleton className="h-10 w-3/4 md:w-1/2" />
          <Skeleton className="h-10 w-full md:w-36" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Skeleton className="h-11 w-full md:flex-grow" />
          <Skeleton className="h-11 w-full md:w-48" />
        </div>
        <div className="grid grid-cols-1 gap-6"> {/* Single column for cards as per image */}
          {[...Array(3)].map((_, i) => ( // Reduced skeleton count for single column
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-border">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">CodeAssist Forum</h1>
            {/* Sub-description removed to match image simplicity */}
        </div>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/new-post">
            <PlusCircle className="mr-2 h-5 w-5" /> New Post
          </Link>
        </Button>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts by title, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 h-11 text-base bg-background md:bg-input border-border" // Ensure input background matches theme
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11 text-base bg-background md:bg-input border-border">
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
        <div className="grid grid-cols-1 gap-6"> {/* Changed to single column */}
          {filteredAndSortedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No posts found.</p>
          {searchTerm && <p className="mt-2 text-base text-muted-foreground">Try adjusting your search or filter.</p>}
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6 space-y-4"> {/* Ensure border is subtle */}
    <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
    <div className="flex items-center space-x-2 mb-3">
      <Skeleton className="h-6 w-6 rounded-full" /> {/* Avatar */}
      <Skeleton className="h-4 w-20" /> {/* Author */}
      <Skeleton className="h-4 w-24" /> {/* Time */}
    </div>
    <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
    <Skeleton className="h-4 w-5/6 mb-3" /> {/* Description line 2 */}
    <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-border mt-4"> {/* Subtle border top */}
        <div className="flex gap-4">
            <Skeleton className="h-5 w-12" /> {/* Upvotes */}
            <Skeleton className="h-5 w-12" /> {/* Comments */}
        </div>
        <Skeleton className="h-9 w-28" /> {/* View Post Button */}
    </div>
  </div>
);
