import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-16 md:py-24 bg-card rounded-lg shadow-2xl overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Cover photo removed */}
          
          <div className="relative z-10 p-6 md:p-8">
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
        </div>
      </section>
    </div>
  );
}
