'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Code, Download, Copy, ArrowLeft, Send, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ErrorExplainerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock error explanation based on input
    const mockExplanation = `# Error Analysis

## Error Type: ${errorMessage.includes('TypeError') ? 'TypeError' : errorMessage.includes('ReferenceError') ? 'ReferenceError' : 'Runtime Error'}

## What This Error Means:
This error occurs when ${errorMessage.includes('undefined') ? 'you\'re trying to access a variable or property that doesn\'t exist or hasn\'t been defined' : errorMessage.includes('null') ? 'you\'re trying to access a property on a null or undefined value' : 'there\'s an issue with the data type or value you\'re working with'}.

## Common Causes:
- ${errorMessage.includes('undefined') ? 'Variable not declared or initialized' : 'Incorrect data type usage'}
- ${errorMessage.includes('undefined') ? 'Misspelled variable or function name' : 'Null or undefined value passed to function'}
- ${errorMessage.includes('undefined') ? 'Scope issues (variable not accessible)' : 'Missing required parameters'}

## How to Fix It:
1. **Check Variable Declaration**: Make sure all variables are properly declared before use
2. **Verify Scope**: Ensure variables are accessible in the current scope
3. **Add Null Checks**: Use optional chaining (?.) or null checks before accessing properties
4. **Debug Step by Step**: Add console.log statements to trace the issue

## Example Solution:
\`\`\`javascript
// Instead of this (causes error):
console.log(user.name);

// Do this (safe):
if (user && user.name) {
    console.log(user.name);
}

// Or use optional chaining:
console.log(user?.name);
\`\`\`

## Prevention Tips:
- Always initialize variables before use
- Use TypeScript for better type safety
- Implement proper error handling with try-catch blocks
- Test your code with different data scenarios

## Related Errors:
- ReferenceError: Similar to this error but for undeclared variables
- TypeError: Occurs when trying to use a value in an inappropriate way

---
*Generated explanation for: "${errorMessage}"*`;

    setExplanation(mockExplanation);
    setIsLoading(false);
    
    toast({
      title: "Error Explained",
      description: "Your error has been analyzed and explained successfully.",
    });
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
                Error Message or Stack Trace
              </label>
              <Textarea
                placeholder="Paste your error message, stack trace, or console output here. For example: 'TypeError: Cannot read property 'name' of undefined' or 'ReferenceError: user is not defined'"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
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
                <p className="text-sm">Paste an error message and click "Explain Error" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
