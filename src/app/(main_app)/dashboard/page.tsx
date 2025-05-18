
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Activity, Wrench, TerminalSquare, SearchX, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const aiTools = [
    {
      title: "Bug Fixing Tool",
      description: "Automatically analyze your code, identify bugs, and get suggestions for fixes.",
      icon: <Wrench className="h-8 w-8 mb-3 text-primary" />,
      link: "/dashboard/tools/bug-fixer", // Placeholder link
      cta: "Fix Bugs",
    },
    {
      title: "Prompt/Snippet to Code",
      description: "Convert your ideas or existing code snippets into functional code with AI assistance.",
      icon: <TerminalSquare className="h-8 w-8 mb-3 text-primary" />,
      link: "/dashboard/tools/code-generator", // Placeholder link
      cta: "Generate Code",
    },
    {
      title: "Error Describer & Solution",
      description: "Understand complex error messages and receive clear explanations and potential solutions.",
      icon: <SearchX className="h-8 w-8 mb-3 text-primary" />,
      link: "/dashboard/tools/error-explainer", // Placeholder link
      cta: "Explain Error",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Briefcase className="mr-3 h-8 w-8 text-primary" />
            Dashboard
          </CardTitle>
          <CardDescription className="text-lg">
            Your central hub for activity and AI-powered developer tools.
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
          <div className="p-6 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Activity Feed Coming Soon!</h3>
            <p className="mt-2 text-muted-foreground">
              Your recent posts, comments, and interactions will appear here.
            </p>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-7 w-7 text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
          AI Developer Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <Card key={tool.title} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader className="items-center text-center">
                {tool.icon}
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm text-center">{tool.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={tool.link}>
                    {tool.cta} <ArrowRight className="ml-2 h-4 w-4" />
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
