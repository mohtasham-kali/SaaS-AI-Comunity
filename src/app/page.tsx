
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Content for unauthenticated users
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 py-12"> {/* Adjusted padding and height */}
      <section className="w-full max-w-3xl py-16 md:py-24 bg-card rounded-lg shadow-2xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">CodeAssist</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl md:mt-7 md:text-2xl max-w-xl lg:max-w-2xl mx-auto">
            Your AI-powered community for solving coding challenges, debugging issues, and sharing knowledge.
          </p>
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg py-3 px-8 shadow-lg hover:shadow-primary/40 transition-shadow">
              <Link href="/login">
                <ArrowRight className="mr-2 h-5 w-5" /> Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg py-3 px-8 shadow-lg hover:shadow-accent/40 transition-shadow">
              <Link href="/signup">
                <UserPlus className="mr-2 h-5 w-5" /> Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
