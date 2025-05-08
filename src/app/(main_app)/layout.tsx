
'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import AppSidebarContent from '@/components/layout/app-sidebar-content';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LogoIcon from '@/components/icons/logo-icon';


// Helper to get a user-friendly title from the pathname
const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/forum')) return 'CodeAssist Forum';
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/analytics') return 'Analytics';
  if (pathname === '/profile') return 'User Profile';
  if (pathname === '/settings') return 'Settings';
  if (pathname === '/premium-features') return 'Premium Features';
  if (pathname.startsWith('/admin/manage-users')) return 'Manage Users';
  if (pathname.startsWith('/admin/manage-posts')) return 'Manage Posts';
  if (pathname.startsWith('/admin/subscriptions')) return 'Manage Subscriptions';
  if (pathname === '/new-post') return 'Create New Post';
  return 'CodeAssist';
};


export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider defaultOpen={true} >
      <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
        <AppSidebarContent />
      </Sidebar>
      <SidebarRail />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <SidebarTrigger className="md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>
          <Link href="/forum" className="md:hidden">
             <LogoIcon width={100} height={25} />
          </Link>
          <div className="flex-1" /> 
          {/* Add mobile-specific header items here if needed, e.g. profile icon */}
        </header>
        <SidebarInset>
            <main className="flex-1 py-6 px-4 md:px-6 lg:px-8 bg-background">
                {/* Page title for medium screens and up, hidden on mobile where it might be in header */}
                {/* <h1 className="text-2xl font-semibold mb-6 hidden md:block">{pageTitle}</h1> */}
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
