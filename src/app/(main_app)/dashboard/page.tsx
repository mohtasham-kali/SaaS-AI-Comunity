
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Activity, ArrowRight, FilePenLine, MessageSquareText, LogIn, ChevronRight, ExternalLink, Star, Trophy, Award, Target } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import type { ActivityItem } from "@/types";
import { formatDistanceToNowStrict } from 'date-fns';

const getContributionStats = (activities: ActivityItem[] = []) => {
  const forumPosts = activities.filter(a => a.type === 'forum_post').length;
  const forumComments = activities.filter(a => a.type === 'forum_comment').length;
  const aiToolUsage = activities.filter(a => a.type.includes('ai_tool')).length;
  
  const totalPoints = forumPosts * 50 + forumComments * 25 + aiToolUsage * 10;
  
  return [
    {
      title: "Forum Posts",
      description: "Your published posts and questions in the community.",
      icon: <FilePenLine className="h-8 w-8 mb-3 text-primary" />,
      points: forumPosts * 50,
      count: forumPosts,
      link: "/forum",
      cta: "View Posts",
    },
    {
      title: "Helpful Comments",
      description: "Your responses and solutions to other developers.",
      icon: <MessageSquareText className="h-8 w-8 mb-3 text-blue-500" />,
      points: forumComments * 25,
      count: forumComments,
      link: "/forum",
      cta: "View Comments",
    },
    {
      title: "AI Tool Usage",
      description: "Your usage of AI-powered development tools.",
      icon: <Star className="h-8 w-8 mb-3 text-yellow-500" />,
      points: aiToolUsage * 10,
      count: aiToolUsage,
      link: "/ai-tools",
      cta: "Use AI Tools",
    },
  ];
};

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'forum_post': return <FilePenLine className="h-5 w-5 text-primary flex-shrink-0" />;
    case 'forum_comment': return <MessageSquareText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    case 'ai_tool_bug_fixer': return <Trophy className="h-5 w-5 text-orange-500 flex-shrink-0" />;
    case 'ai_tool_code_generator': return <Star className="h-5 w-5 text-purple-500 flex-shrink-0" />;
    case 'ai_tool_error_explainer': return <Award className="h-5 w-5 text-red-500 flex-shrink-0" />;
    case 'login': return <LogIn className="h-5 w-5 text-green-500 flex-shrink-0" />;
    default: return <Activity className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  }
};

export default function DashboardPage() {
  const { currentUser } = useAuth();

  const recentActivities = currentUser?.recentActivities
    ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5) || [];

  const userContributions = getContributionStats(currentUser?.recentActivities || []);

  return (
    <div className="container mx-auto py-8 space-y-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            Dashboard
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome back, {currentUser?.name || 'Developer'}! Your central hub for activity and AI-powered tools.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Activity className="mr-3 h-6 w-6 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground truncate max-w-md" title={activity.description}>{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {activity.link && (
                    <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                      <Link href={activity.link}>
                        View <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <h3 className="text-xl font-semibold">No Recent Activity</h3>
              <p className="mt-2 text-muted-foreground">
                Your recent posts, comments, and interactions will appear here once you start using the platform.
              </p>
            </div>
          )}
        </CardContent>
         {currentUser && currentUser.recentActivities && currentUser.recentActivities.length > 0 && (
            <CardFooter className="border-t pt-4">
                <Button variant="link" asChild className="text-primary hover:text-primary/80 p-0 h-auto">
                    <Link href="/profile/activity">
                        View All Activity <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        )}
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Target className="mr-3 h-7 w-7 text-primary" />
          Community Contributions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userContributions.map((contribution) => (
            <Card key={contribution.title} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="items-center text-center">
                {contribution.icon}
                <CardTitle className="text-xl">{contribution.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm text-center mb-4">{contribution.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{contribution.points} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquareText className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{contribution.count} {contribution.title.toLowerCase().includes('posts') ? 'posts' : contribution.title.toLowerCase().includes('comments') ? 'comments' : 'uses'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={contribution.link}>
                    {contribution.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
