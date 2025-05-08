
'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger, // Kept for potential future use or very small screens if MainAppHeader is hidden
  SidebarRail,
} from '@/components/ui/sidebar';
import AppSidebarContent from '@/components/layout/app-sidebar-content';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation'; // usePathname removed as pageTitle logic is removed
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MainAppHeader } from '@/components/layout/main-app-header'; // New Header
import { ThemeProvider } from "next-themes"; // Added for theme toggle

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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider defaultOpen={true} >
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
          <AppSidebarContent />
        </Sidebar>
        <SidebarRail />
        <div className="flex flex-col flex-1 min-h-screen bg-background">
          <MainAppHeader /> {/* Sticky header for the main app area */}
          <SidebarInset> {/* Main content area, scrollable below the header */}
              <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
                  {children}
              </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
