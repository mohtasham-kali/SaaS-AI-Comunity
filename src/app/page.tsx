
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import LogoIcon from "@/components/icons/logo-icon";

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/forum'); // Redirect to the forum page if logged in
    }
  }, [currentUser, loading, router]);

  if (loading || (!loading && currentUser)) {
    // Show a loader or nothing while redirecting or if user is logged in (to avoid flash of landing page)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Content for unauthenticated users
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl text-center py-12 md:py-16">
          <div className="mb-10 md:mb-12">
           <LogoIcon width={180} height={45} /> {/* Slightly adjusted size for balance */}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            AI-Powered Code Assistance
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-10">
            Join a community of developers. Get help with coding issues, debug errors, and share your knowledge with AI-driven insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-3 shadow-lg hover:shadow-primary/40 transition-all duration-200 transform hover:scale-105">
              <Link href="/login">
                <ArrowRight className="mr-2 h-5 w-5" /> Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3 shadow-lg hover:shadow-accent/40 transition-all duration-200 transform hover:scale-105">
              <Link href="/signup">
                <UserPlus className="mr-2 h-5 w-5" /> Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="w-full border-t border-border py-6 text-center text-muted-foreground px-4 sm:px-6 lg:px-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} CodeAssist. All rights reserved.</p>
      </footer>
    </div>
  );
}
