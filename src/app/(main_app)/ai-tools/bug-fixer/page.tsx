'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bug, Code, Download, Copy, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function BugFixerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fixedCode, setFixedCode] = useState<string>("");
  const [buggyCode, setBuggyCode] = useState<string>("");

  const fixBugs = async () => {
    if (!buggyCode.trim()) {
      toast({
        title: "No Code Provided",
        description: "Please provide the code that needs to be fixed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { debugCode } = await import('@/ai/flows/debug-code');
      const result = await debugCode({
        problemDescription: "Please fix the bugs in the provided code snippet.",
        codeSnippet: buggyCode,
        language: "javascript",
      });

      const formattedFix = `# Bug Analysis & Fix\n\n## Explanation:\n${result.explanation}\n\n## Suggestions:\n${result.suggestions}\n\n## Fixed Code:\n${result.debuggedCode}\n\n---\n*Generated fix for your code*`;

      setFixedCode(formattedFix);

      toast({
        title: "Bugs Fixed",
        description: "Your code has been analyzed and fixed successfully.",
      });
    } catch (error) {
      console.error("Error fixing bugs:", error);
      toast({
        title: "Fix Failed",
        description: "An error occurred while fixing the bugs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fixedCode);
    toast({
      title: "Copied to Clipboard",
      description: "The fixed code has been copied to your clipboard.",
    });
  };

  const downloadFixedCode = () => {
    const element = document.createElement("a");
    const file = new Blob([fixedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `fixed-code.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Tools
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <Bug className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Bug Fixer</h1>
        </div>
        <p className="text-muted-foreground">
          Paste your problematic code and get a fixed version with detailed explanations and improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Paste Your Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Code with Bugs or Issues
              </label>
              <Textarea
                placeholder="Paste your problematic code here. For example: 'function getUser() { console.log(user.name); return user; }' or any code that's causing issues"
                value={buggyCode}
                onChange={(e) => setBuggyCode(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button
              onClick={fixBugs}
              disabled={!buggyCode.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Analyzing & Fixing..." : "Fix Bugs"}
            </Button>
          </CardContent>
        </Card>

        {/* Fixed Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Fixed Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fixedCode ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    Markdown
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadFixedCode}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={fixedCode}
                  readOnly
                  className="min-h-[500px] font-mono text-sm"
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Fixed code will appear here</p>
                <p className="text-sm">Paste your code and click &quot;Fix Bugs&quot; to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
