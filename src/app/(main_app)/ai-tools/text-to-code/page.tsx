'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Type, Code, Download, Copy, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function TextToCodePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "No Description Provided",
        description: "Please provide a description of what you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Call AI flow
    try {
      const { generateCodeFromText } = await import('@/ai/flows/generate-code-from-text');
      const result = await generateCodeFromText({
        prompt: prompt,
        model: 'gemini-flash', // Default to flash, or could add a selector here
      });

      setGeneratedCode(result.code);

      toast({
        title: "Code Generated",
        description: `Your code has been generated successfully using ${result.modelUsed || 'AI'}.`,
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating the code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied to Clipboard",
      description: "The generated code has been copied to your clipboard.",
    });
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `generated-code.html`;
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
          <Type className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">Text to Code</h1>
        </div>
        <p className="text-muted-foreground">
          Describe what you want to build and get the corresponding code generated automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prompt Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Describe Your Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What do you want to build?
              </label>
              <Textarea
                placeholder="Describe the layout, functionality, or specific features you want to generate. For example: 'Create a responsive landing page with a hero section, features grid, and contact form' or 'Build a simple calculator with addition, subtraction, multiplication, and division'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <Button
              onClick={generateCode}
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Generating Code..." : "Generate Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedCode ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    HTML/CSS
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadCode}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedCode}
                  readOnly
                  className="min-h-[500px] font-mono text-sm"
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Generated code will appear here</p>
                <p className="text-sm">Add a description and click &quot;Generate Code&quot; to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
