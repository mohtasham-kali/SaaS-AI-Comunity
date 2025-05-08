import Link from 'next/link';
import type { Post } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : name.substring(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out bg-card flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.image || undefined} alt={post.user.name || 'User avatar'} data-ai-hint="abstract profile" />
            <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{post.user.name}</p>
            <p className="text-xs text-muted-foreground">
              Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <CardTitle className="text-lg">
          <Link href={`/posts/${post.id}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm line-clamp-3 h-[3.75rem] overflow-hidden">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
        <div className="flex space-x-4">
          <span className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" /> {post.upvotes}
          </span>
          <span className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" /> {post.comments.length}
          </span>
        </div>
        <span className={`flex items-center text-xs font-semibold ${post.isResolved ? 'text-green-500' : 'text-yellow-500'}`}>
          {post.isResolved ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
          {post.isResolved ? 'Resolved' : 'Open'}
        </span>
      </CardFooter>
    </Card>
  );
}
