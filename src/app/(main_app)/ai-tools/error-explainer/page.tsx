'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Code, Download, Copy, ArrowLeft, Send, Lightbulb, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ErrorExplainerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  const explainError = async () => {
    if (!errorMessage.trim()) {
      toast({
        title: "No Error Message Provided",
        description: "Please provide an error message to explain.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { explainErrors } = await import('@/ai/flows/explain-errors');
      const result = await explainErrors({
        code: code || "// No code provided",
        error: errorMessage,
        language: language,
      });

      const formattedExplanation = `# Error Analysis\n\n## Explanation:\n${result.explanation}\n\n## Suggested Solution:\n${result.suggestedSolution}\n\n---\n*Generated explanation for: "${errorMessage}"*`;

      setExplanation(formattedExplanation);

      toast({
        title: "Error Explained",
        description: "Your error has been analyzed and explained successfully.",
      });
    } catch (error) {
      console.error("Error explaining error:", error);
      toast({
        title: "Explanation Failed",
        description: "An error occurred while analyzing the error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation);
    toast({
      title: "Copied to Clipboard",
      description: "The error explanation has been copied to your clipboard.",
    });
  };

  const downloadExplanation = () => {
    const element = document.createElement("a");
    const file = new Blob([explanation], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `error-explanation.md`;
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
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Error Explainer</h1>
        </div>
        <p className="text-muted-foreground">
          Paste your error message and get a detailed explanation with solutions and prevention tips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Error Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Paste Your Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Error Message or Stack Trace <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Paste your error message, stack trace, or console output here. For example: 'TypeError: Cannot read property 'name' of undefined' or 'ReferenceError: user is not defined'"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Code className="h-4 w-4" />
                Relevant Code (Optional)
              </label>
              <Textarea
                placeholder="Paste the code snippet where the error occurs..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </label>
              <Input
                placeholder="e.g., javascript, typescript, python"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <Button
              onClick={explainError}
              disabled={!errorMessage.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Analyzing Error..." : "Explain Error"}
            </Button>
          </CardContent>
        </Card>

        {/* Explanation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Error Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {explanation ? (
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
                    <Button size="sm" variant="outline" onClick={downloadExplanation}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={explanation}
                  readOnly
                  className="min-h-[500px] font-mono text-sm"
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Error explanation will appear here</p>
                <p className="text-sm">Paste an error message and click &quot;Explain Error&quot; to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
