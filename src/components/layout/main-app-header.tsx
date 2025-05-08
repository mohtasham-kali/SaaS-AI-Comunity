'use client';

import Link from 'next/link';
import LogoIcon from '@/components/icons/logo-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed
import { useAuth } from '@/components/auth/auth-provider';
import { Skeleton } from '../ui/skeleton';

const getInitials = (name?: string | null) => {
    if (!name) return 'UA';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase() : name.substring(0, 2).toUpperCase();
};


export function MainAppHeader() {
  const { theme, setTheme } = useTheme();
  const { currentUser, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <Link href="/forum" className="flex items-center gap-2" aria-label="Go to CodeAssist Forum">
        <LogoIcon width={120} height={30} />
      </Link>
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
        ) : currentUser ? (
            <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || 'User avatar'} data-ai-hint="user avatar" />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
        ) : (
            <Skeleton className="h-8 w-8 rounded-full" /> // Placeholder if not logged in, though layout implies logged in state
        )}
      </div>
    </header>
  );
}
