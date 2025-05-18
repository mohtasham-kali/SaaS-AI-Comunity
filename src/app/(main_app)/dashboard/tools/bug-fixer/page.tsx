
'use client';

import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileUploadButton } from '@/components/shared/file-upload-button';
import { CodeBlock } from '@/components/shared/code-block';
import type { UploadedFile } from '@/types';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { debugCode, type DebugCodeInput, type DebugCodeOutput } from '@/ai/flows/debug-code';
import { Loader2, XCircle, Paperclip, Image as ImageIconLucide, Wrench, FileText } from 'lucide-react';
import NextImage from 'next/image';

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function BugFixerPage() {
  const [problemDescription, setProblemDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('');
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<UploadedFile[]>([]);
  
  const [aiResponse, setAiResponse] = useState<DebugCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const planLimits = currentUser?.plan === 'premium' 
      ? { maxFiles: 10, maxSizeMB: 10 } // Example: Premium might have higher limits or more file types
      : { maxFiles: 3, maxSizeMB: 5 };

  const handleFilesSelectedForPreview = (newFilePreviews: UploadedFile[]) => {
     setFilePreviews(prev => {
        const combined = [...prev, ...newFilePreviews];
        if (combined.length > planLimits.maxFiles) {
            toast({
                title: "File Limit Exceeded",
                description: `You can upload a maximum of ${planLimits.maxFiles} files. ${combined.length - planLimits.maxFiles} files were not added.`,
                variant: "destructive",
            });
            return combined.slice(0, planLimits.maxFiles);
        }
        return combined;
    });
  };

  const handleRawFilesSelected = (newRawFiles: File[]) => {
    setRawFiles(prev => {
        const combined = [...prev, ...newRawFiles];
         if (combined.length > planLimits.maxFiles) {
            // Toast notification for this is handled by FileUploadButton or handleFilesSelectedForPreview
            return combined.slice(0, planLimits.maxFiles);
        }
        return combined;
    });
  };
  
  const removeFile = (fileIdToRemove: string, fileNameToRemove: string) => {
    setFilePreviews(prev => prev.filter(f => f.id !== fileIdToRemove));
    setRawFiles(prev => prev.filter(f => f.name !== fileNameToRemove));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIconLucide className="h-5 w-5 text-primary flex-shrink-0" />;
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5 text-rose-500 flex-shrink-0" />;
    if (fileType.startsWith('text/')) return <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    // Add more specific icons for code files based on extension if needed
    return <Paperclip className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  };

  const handleDebugCode = async () => {
    if (!problemDescription.trim()) {
      toast({ title: "Problem Description Required", description: "Please describe the bug or issue.", variant: "destructive" });
      return;
    }
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (currentUser.plan === 'free' && (currentUser.aiResponsesToday >= 3 || currentUser.aiResponsesThisWeek >= 10)) {
      toast({ title: "AI Limit Reached", description: `Free plan AI response limit reached. Today: ${currentUser.aiResponsesToday}/3, Week: ${currentUser.aiResponsesThisWeek}/10. Upgrade for more.`, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const uploadedFileDataUris: string[] = [];
      for (const file of rawFiles) {
        const dataUri = await fileToDataUri(file);
        uploadedFileDataUris.push(dataUri);
      }

      const input: DebugCodeInput = {
        problemDescription,
        codeSnippet: codeSnippet.trim() ? codeSnippet : undefined,
        language: codeSnippet.trim() && language.trim() ? language : undefined,
        uploadedFiles: uploadedFileDataUris.length > 0 ? uploadedFileDataUris : undefined,
      };

      const response = await debugCode(input);
      setAiResponse(response);
      
      currentUser.aiResponsesToday = (currentUser.aiResponsesToday || 0) + 1;
      currentUser.aiResponsesThisWeek = (currentUser.aiResponsesThisWeek || 0) + 1;
      // In a real app, this user update should be persisted to the backend.
      toast({ title: "Analysis Complete!", description: "AI has provided suggestions." });

    } catch (err) {
      console.error("Bug fixing error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get suggestions: ${errorMessage}. Please check your connection and ensure the AI service is available (Genkit server might need to be running).`);
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Wrench className="mr-3 h-8 w-8 text-primary" />
            AI Bug Fixer & Solution Suggester
          </CardTitle>
          <CardDescription>
            Describe your coding problem, provide relevant code snippets, and upload files (like error screenshots or logs). AI will help analyze the issue and suggest solutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="problem-description" className="block text-sm font-medium text-foreground mb-1">Problem Description <span className="text-destructive">*</span></label>
            <Textarea
              id="problem-description"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g., My Python script throws a TypeError when processing CSV files. I've attached a screenshot of the error and the script."
              className="min-h-[120px] text-base p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="code-snippet" className="block text-sm font-medium text-foreground mb-1">Code Snippet (Optional)</label>
            <Textarea
              id="code-snippet"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Paste relevant code snippet here..."
              className="min-h-[150px] text-base p-3 font-mono"
            />
          </div>
          
          {codeSnippet.trim() && (
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-foreground mb-1">Language (Optional)</label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., python, javascript, java"
                className="text-base p-3"
              />
            </div>
          )}


          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Upload Files (Optional)</label>
            <FileUploadButton
              onFilesSelected={handleFilesSelectedForPreview}
              onRawFilesSelected={handleRawFilesSelected}
              currentPlan={currentUser?.plan}
              accept="image/*,text/*,.log,.py,.js,.ts,.java,.c,.cpp,.cs,.html,.css,.json,.xml,application/pdf" 
            />
            {filePreviews.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Selected files ({filePreviews.length} / {planLimits.maxFiles}):</p>
                <ul className="list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filePreviews.map(file => (
                    <li key={file.id} className="relative group p-3 border rounded-lg bg-muted/50 shadow-sm flex items-center space-x-3">
                       {file.type.startsWith('image/') ? (
                         <NextImage src={file.url} alt={file.name} width={40} height={40} className="rounded object-cover h-10 w-10 border border-border" data-ai-hint="file thumbnail" />
                       ) : (
                        <div className="flex items-center justify-center h-10 w-10 bg-muted rounded border border-border">
                          {getFileIcon(file.type)}
                        </div>
                       )}
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id, file.name)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100"
                        aria-label={`Remove ${file.name}`}
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button onClick={handleDebugCode} disabled={isLoading || !problemDescription.trim()} size="lg" className="w-full text-base py-3">
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">AI is analyzing your issue...</p>
        </div>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <XCircle className="mr-2 h-5 w-5" /> Error Getting Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/90">{error}</p>
          </CardContent>
        </Card>
      )}

      {aiResponse && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">AI Analysis & Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiResponse.explanation && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Explanation of Errors:</h3>
                <div className="prose prose-sm sm:prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/30">
                    <p className="whitespace-pre-line">{aiResponse.explanation}</p>
                </div>
              </div>
            )}
            {aiResponse.suggestions && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Suggestions for Fixes:</h3>
                 <div className="prose prose-sm sm:prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/30">
                    <p className="whitespace-pre-line">{aiResponse.suggestions}</p>
                </div>
              </div>
            )}
            {aiResponse.debuggedCode && aiResponse.debuggedCode.toLowerCase() !== 'n/a' && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Debugged Code:</h3>
                <CodeBlock code={aiResponse.debuggedCode} language={language || 'plaintext'} />
              </div>
            )}
             {aiResponse.debuggedCode && aiResponse.debuggedCode.toLowerCase() === 'n/a' && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Debugged Code:</h3>
                <p className="text-muted-foreground italic p-4 border rounded-md bg-muted/30">Not applicable or no specific code changes suggested for the provided snippet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

