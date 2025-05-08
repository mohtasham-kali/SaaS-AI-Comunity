
'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, CalendarDays, Activity, ShieldCheck, Zap, Edit3, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // MainAppLayout handles auth check, so local redirect is no longer needed here.
  // useEffect(() => {
  //   if (!loading && !currentUser) {
  //     router.push('/login?redirect=/profile');
  //   }
  // }, [currentUser, loading, router]);

  useEffect(() => {
    if (currentUser?.name) {
      document.title = `${currentUser.name} - CodeAssist Profile`;
    } else if (!loading) {
      document.title = 'User Profile - CodeAssist';
    }
  }, [currentUser, loading]);

  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  // Loading state is handled by MainAppLayout, but we can keep a skeleton for content loading if needed.
  // However, since MainAppLayout waits for currentUser, this specific skeleton might not be shown often.
  if (loading || !currentUser) { // This check ensures currentUser is available, though MainAppLayout should guarantee it.
    return (
        <div className="w-full max-w-2xl mx-auto"> {/* Added mx-auto to center skeleton within layout's padding */}
            <Card className="shadow-xl">
            <CardHeader className="items-center text-center p-8 bg-muted/30">
                <Skeleton className="h-24 w-24 rounded-full mb-4 border-4 border-primary" />
                <Skeleton className="h-8 w-56 mb-2" />
                <Skeleton className="h-6 w-72" />
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-4 border rounded-lg bg-background">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <div className="w-full">
                                <Skeleton className="h-4 w-1/3 mb-1.5" />
                                <Skeleton className="h-5 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
                <Card className="bg-background">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <Skeleton className="h-4 w-1/2 mb-1.5" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-1/2 mb-1.5" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                    </CardContent>
                </Card>
                <Skeleton className="h-12 w-full mt-6" />
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Skeleton className="h-10 w-full sm:w-32" />
                    <Skeleton className="h-10 w-full sm:w-32" />
                </div>
            </CardContent>
            </Card>
        </div>
    );
  }
  
  // Removed outer container div as MainAppLayout provides padding.
  // The Card component is now the top-level element for the page content.
  return (
      <Card className="max-w-2xl mx-auto shadow-2xl overflow-hidden">
        <CardHeader className="items-center text-center p-8 bg-gradient-to-br from-muted/50 to-muted/20">
          <Avatar className="h-28 w-28 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || 'User avatar'} data-ai-hint="modern avatar" />
            <AvatarFallback className="text-4xl font-semibold">{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{currentUser.name}</CardTitle>
          {currentUser.email && <CardDescription className="text-lg text-muted-foreground flex items-center"><Mail className="h-5 w-5 mr-2 text-primary"/>{currentUser.email}</CardDescription>}
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <Badge variant={currentUser.plan === 'premium' ? 'default' : 'secondary'} className={`capitalize text-base px-3 py-1 ${currentUser.plan === 'premium' ? 'bg-primary text-primary-foreground' : ''}`}>
                  {currentUser.plan}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
              <CalendarDays className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="text-base font-medium">{format(new Date(currentUser.lastLogin), "MMMM d, yyyy 'at' h:mm a")}</p>
              </div>
            </div>
          </div>
          
          <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Activity className="h-6 w-6 mr-2 text-primary" />Usage Statistics (Mock)</CardTitle>
              <CardDescription>Your AI interaction limits for the current plan.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="p-4 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground mb-1">AI Responses Today:</p>
                    <p className="font-semibold text-2xl">{currentUser.aiResponsesToday} / <span className="text-base">{currentUser.plan === 'free' ? 3 : 'Unlimited'}</span></p>
                </div>
                <div className="p-4 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground mb-1">AI Responses This Week:</p>
                    <p className="font-semibold text-2xl">{currentUser.aiResponsesThisWeek} / <span className="text-base">{currentUser.plan === 'free' ? 10 : 'Unlimited'}</span></p>
                </div>
            </CardContent>
          </Card>

          {currentUser.plan === 'free' && (
            <Button size="lg" className="w-full bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-primary-foreground shadow-lg text-base py-6" asChild>
              <Link href="/premium-features"> 
                <Zap className="mr-2 h-5 w-5" /> Upgrade to Premium
              </Link>
            </Button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
            <Button variant="outline" className="w-full sm:w-auto text-base py-3" onClick={() => { toast({title: "Feature Coming Soon!", description: "Editing profiles, changing passwords, and managing notifications will be available shortly."}) }}><Edit3 className="mr-2 h-4 w-4"/>Edit Profile</Button>
            <Button variant="destructive" className="w-full sm:w-auto text-base py-3" onClick={() => { logout(); router.push('/'); }}><LogOutIcon className="mr-2 h-4 w-4"/>Log Out</Button>
          </div>
        </CardContent>
      </Card>
  );
}

