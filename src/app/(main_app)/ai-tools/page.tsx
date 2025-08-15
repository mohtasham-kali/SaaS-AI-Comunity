'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { Bot, Code, Bug, Image, Type, AlertTriangle, Zap, Play } from "lucide-react";

const aiTools = [
  {
    id: 'image-to-code',
    title: 'Image to Code',
    description: 'Convert UI designs and screenshots into working code',
    icon: Image,
    href: '/ai-tools/image-to-code',
    color: 'text-blue-500',
    status: 'available'
  },
  {
    id: 'text-to-code',
    title: 'Text to Code',
    description: 'Generate code from natural language descriptions',
    icon: Type,
    href: '/ai-tools/text-to-code',
    color: 'text-green-500',
    status: 'available'
  },
  {
    id: 'error-explainer',
    title: 'Error Explainer',
    description: 'Get detailed explanations of error messages',
    icon: AlertTriangle,
    href: '/ai-tools/error-explainer',
    color: 'text-red-500',
    status: 'available'
  },
  {
    id: 'bug-fixer',
    title: 'Bug Fixer',
    description: 'Automatically identify and fix code errors',
    icon: Bug,
    href: '/ai-tools/bug-fixer',
    color: 'text-purple-500',
    status: 'available'
  }
];

export default function AIToolsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleToolClick = (tool: any) => {
    router.push(tool.href);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Developer Tools</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Select from our powerful AI tools to enhance your development workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleToolClick(tool)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <tool.icon className={`h-6 w-6 ${tool.color}`} />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <Button className="w-full">
                Start Using
                <Play className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
