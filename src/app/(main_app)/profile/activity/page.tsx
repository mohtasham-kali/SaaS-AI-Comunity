
'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ActivityItem } from '@/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Activity, FilePenLine, MessageSquareText, Wrench, Wand2, SearchX, LogIn, ExternalLink, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'forum_post': return <FilePenLine className="h-5 w-5 text-primary flex-shrink-0" />;
    case 'forum_comment': return <MessageSquareText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    case 'ai_tool_bug_fixer': return <Wrench className="h-5 w-5 text-orange-500 flex-shrink-0" />;
    case 'ai_tool_code_generator': return <Wand2 className="h-5 w-5 text-purple-500 flex-shrink-0" />;
    case 'ai_tool_error_explainer': return <SearchX className="h-5 w-5 text-red-500 flex-shrink-0" />;
    case 'login': return <LogIn className="h-5 w-5 text-green-500 flex-shrink-0" />;
    default: return <Activity className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  }
};

export default function ActivityLogPage() {
  const { currentUser, loading } = useAuth();

  const allActivities = currentUser?.recentActivities
    ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || [];

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <ListChecks className="mr-3 h-8 w-8 text-primary" />
            My Activity Log
          </CardTitle>
          <CardDescription className="text-lg">
            A complete history of your interactions on CodeAssist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allActivities.length > 0 ? (
            <ul className="space-y-4">
              {allActivities.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow-sm">
                  <div className="flex items-center space-x-4">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-base font-medium text-foreground">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {activity.link && (
                    <Button variant="outline" size="sm" asChild className="text-primary hover:text-primary border-primary/30 hover:bg-primary/10">
                      <Link href={activity.link}>
                        View Details <ExternalLink className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center bg-muted/20 rounded-lg">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Activity Yet</h3>
              <p className="mt-2 text-muted-foreground">
                Start exploring the forum or use our AI tools, and your activities will appear here.
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
