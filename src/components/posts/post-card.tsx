import Link from 'next/link';
import type { Post } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl font-semibold mb-2">
          <Link href={`/posts/${post.id}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.user.image || undefined} alt={post.user.name || 'User avatar'} data-ai-hint="author avatar"/>
            <AvatarFallback className="text-xs">{getInitials(post.user.name)}</AvatarFallback>
          </Avatar>
          <span>{post.user.name}</span>
          <span>&bull;</span>
          <span>{formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 flex-grow">
        <CardDescription className="text-sm text-foreground/80 line-clamp-3 mb-4">
          {post.description}
        </CardDescription>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/70 text-secondary-foreground/80 hover:bg-secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-3 border-t border-border flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1.5" /> {post.upvotes}
          </span>
          <span className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5" /> {post.comments.length}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          {post.isResolved && (
            <Badge variant="default" className="bg-green-500/80 hover:bg-green-500 text-white text-xs px-2.5 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Resolved
            </Badge>
          )}
           <Button variant="outline" size="sm" asChild className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
            <Link href={`/posts/${post.id}`}>View Post</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
