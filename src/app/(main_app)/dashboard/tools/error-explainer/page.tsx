
'use client';

import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileUploadButton } from '@/components/shared/file-upload-button';
import { CodeBlock } from '@/components/shared/code-block';
import type { UploadedFile, Plan } from '@/types';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { debugCode, type DebugCodeInput, type DebugCodeOutput } from '@/ai/flows/debug-code';
import { Loader2, XCircle, Paperclip, Image as ImageIconLucide, SearchX, FileText } from 'lucide-react';
import NextImage from 'next/image';

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const planAiLimits = {
  free: { daily: 3, weekly: 10 },
  Standard: { daily: 50, weekly: 200 },
  Community: { daily: Infinity, weekly: Infinity },
};

export default function ErrorExplainerPage() {
  const [errorDescription, setErrorDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('');
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<UploadedFile[]>([]);
  
  const [aiResponse, setAiResponse] = useState<DebugCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const fileUploadLimitsByPlan = {
    free: { maxFiles: 3, maxSizeMB: 5 },
    Standard: { maxFiles: 10, maxSizeMB: 20 },
    Community: { maxFiles: 20, maxSizeMB: 100 },
  };
  const currentFileUploadLimits = fileUploadLimitsByPlan[currentUser?.plan || 'free'];

  const handleFilesSelectedForPreview = (newFilePreviews: UploadedFile[]) => {
     setFilePreviews(prev => {
        const combined = [...prev, ...newFilePreviews];
        if (combined.length > currentFileUploadLimits.maxFiles) {
            toast({
                title: "File Limit Exceeded",
                description: `You can upload a maximum of ${currentFileUploadLimits.maxFiles} files. ${combined.length - currentFileUploadLimits.maxFiles} files were not added.`,
                variant: "destructive",
            });
            return combined.slice(0, currentFileUploadLimits.maxFiles);
        }
        return combined;
    });
  };

  const handleRawFilesSelected = (newRawFiles: File[]) => {
    setRawFiles(prev => {
        const combined = [...prev, ...newRawFiles];
         if (combined.length > currentFileUploadLimits.maxFiles) {
            return combined.slice(0, currentFileUploadLimits.maxFiles);
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
    return <Paperclip className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
  };

  const handleExplainError = async () => {
    if (!errorDescription.trim()) {
      toast({ title: "Error Description Required", description: "Please describe the error or problem.", variant: "destructive" });
      return;
    }
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    
    const limits = planAiLimits[currentUser.plan];
    let toastDescription = "";
    let limitReached = false;

    if (currentUser.plan === 'free' && (currentUser.aiResponsesToday >= limits.daily || currentUser.aiResponsesThisWeek >= limits.weekly)) {
        limitReached = true;
        toastDescription = `Free plan AI response limit reached. Today: ${currentUser.aiResponsesToday}/${limits.daily}, Week: ${currentUser.aiResponsesThisWeek}/${limits.weekly}. Upgrade for more.`;
    } else if (currentUser.plan === 'Standard' && (currentUser.aiResponsesToday >= limits.daily || currentUser.aiResponsesThisWeek >= limits.weekly)) {
        limitReached = true;
        toastDescription = `Standard plan AI response limit reached. Today: ${currentUser.aiResponsesToday}/${limits.daily}, Week: ${currentUser.aiResponsesThisWeek}/${limits.weekly}. Upgrade for more.`;
    }

    if (limitReached) {
      toast({ title: "AI Limit Reached", description: toastDescription, variant: "destructive" });
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
        problemDescription: errorDescription,
        codeSnippet: codeSnippet.trim() ? codeSnippet : undefined,
        language: codeSnippet.trim() && language.trim() ? language : undefined,
        uploadedFiles: uploadedFileDataUris.length > 0 ? uploadedFileDataUris : undefined,
      };

      const response = await debugCode(input);
      setAiResponse(response);
      
      currentUser.aiResponsesToday = (currentUser.aiResponsesToday || 0) + 1;
      currentUser.aiResponsesThisWeek = (currentUser.aiResponsesThisWeek || 0) + 1;
      toast({ title: "Analysis Complete!", description: "AI has provided an explanation and suggestions." });

    } catch (err)
       {
      console.error("Error explanation tool error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get explanation: ${errorMessage}. Please check your connection and ensure the AI service is available (Genkit server might need to be running).`);
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
            <SearchX className="mr-3 h-8 w-8 text-primary" />
            AI Error Explainer & Solution Provider
          </CardTitle>
          <CardDescription>
            Describe the error message or problem you're facing. Upload screenshots or log files for more accurate AI analysis and solution suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="error-description" className="block text-sm font-medium text-foreground mb-1">Error Description / Prompt <span className="text-destructive">*</span></label>
            <Textarea
              id="error-description"
              value={errorDescription}
              onChange={(e) => setErrorDescription(e.target.value)}
              placeholder="e.g., I'm getting a 'TypeError: Cannot read property 'map' of undefined' in my React component. Attached is a screenshot."
              className="min-h-[120px] text-base p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="code-snippet" className="block text-sm font-medium text-foreground mb-1">Relevant Code Snippet (Optional)</label>
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
                placeholder="e.g., javascript, python, java"
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
              accept="image/*,text/*,.log,.json,.xml,application/pdf" 
            />
            {filePreviews.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Selected files ({filePreviews.length} / {currentFileUploadLimits.maxFiles}):</p>
                <ul className="list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filePreviews.map(file => (
                    <li key={file.id} className="relative group p-3 border rounded-lg bg-muted/50 shadow-sm flex items-center space-x-3">
                       {file.type.startsWith('image/') ? (
                         <NextImage src={file.url} alt={file.name} width={40} height={40} className="rounded object-cover h-10 w-10 border border-border" data-ai-hint="error image" />
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

          <Button onClick={handleExplainError} disabled={isLoading || !errorDescription.trim()} size="lg" className="w-full text-base py-3">
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Get AI Explanation & Solutions'}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">AI is analyzing the error...</p>
        </div>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <XCircle className="mr-2 h-5 w-5" /> Error Getting Explanation
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
                <h3 className="text-xl font-semibold mb-2">Explanation of Error:</h3>
                <div className="prose prose-sm sm:prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/30">
                    <p className="whitespace-pre-line">{aiResponse.explanation}</p>
                </div>
              </div>
            )}
            {aiResponse.suggestions && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Suggested Solutions:</h3>
                 <div className="prose prose-sm sm:prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/30">
                    <p className="whitespace-pre-line">{aiResponse.suggestions}</p>
                </div>
              </div>
            )}
            {aiResponse.debuggedCode && aiResponse.debuggedCode.toLowerCase() !== 'n/a' && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Relevant Code Snippet (if applicable):</h3>
                <CodeBlock code={aiResponse.debuggedCode} language={language || 'plaintext'} />
              </div>
            )}
             {aiResponse.debuggedCode && aiResponse.debuggedCode.toLowerCase() === 'n/a' && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Relevant Code Snippet:</h3>
                <p className="text-muted-foreground italic p-4 border rounded-md bg-muted/30">Not applicable or no specific code changes were relevant for the provided details.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
