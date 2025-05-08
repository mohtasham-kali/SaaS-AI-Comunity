
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
import { useRouter } from 'next/navigation'; 
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MainAppHeader } from '@/components/layout/main-app-header'; 
// ThemeProvider removed from here, it's in RootLayout

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

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

  return (
    // ThemeProvider removed from here
      <SidebarProvider defaultOpen={true} >
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
          <AppSidebarContent />
        </Sidebar>
        <SidebarRail />
        <div className="flex flex-col flex-1 min-h-screen bg-background">
          <MainAppHeader /> 
          <SidebarInset> 
              <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
                  {children}
              </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    // ThemeProvider removed from here
  );
}

