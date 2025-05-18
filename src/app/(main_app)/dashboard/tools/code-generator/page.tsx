
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadButton } from '@/components/shared/file-upload-button';
import { CodeBlock } from '@/components/shared/code-block';
import type { UploadedFile, Plan } from '@/types';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { suggestCodeSolutions, type SuggestCodeSolutionsInput, type SuggestCodeSolutionsOutput } from '@/ai/flows/suggest-code-solutions';
import { Loader2, XCircle, Paperclip, Image as ImageIconLucide, Wand2 } from 'lucide-react';
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

export default function CodeGeneratorPage() {
  const [promptText, setPromptText] = useState('');
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<UploadedFile[]>([]);
  
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
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
    setFilePreviews(prev => [...prev, ...newFilePreviews].slice(0, currentFileUploadLimits.maxFiles));
  };

  const handleRawFilesSelected = (newRawFiles: File[]) => {
    setRawFiles(prev => [...prev, ...newRawFiles].slice(0, currentFileUploadLimits.maxFiles));
    const newPreviews = newRawFiles.map((file, index) => ({
        id: `temp-raw-${Date.now()}-${index}`, 
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
    }));
    setFilePreviews(prev => {
        const currentPreviewNames = new Set(prev.map(f => f.name));
        const trulyNewPreviews = newPreviews.filter(np => !currentPreviewNames.has(np.name));
        return [...prev, ...trulyNewPreviews].slice(0, currentFileUploadLimits.maxFiles);
    });
  };
  
  const removeFile = (fileIdToRemove: string, fileNameToRemove: string) => {
    setFilePreviews(prev => prev.filter(f => f.id !== fileIdToRemove));
    setRawFiles(prev => prev.filter(f => f.name !== fileNameToRemove)); 
  };

  const handleGenerateCode = async () => {
    if (!promptText.trim()) {
      toast({ title: "Prompt Required", description: "Please enter a prompt for code generation.", variant: "destructive" });
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
    setGeneratedCode(null);
    setExplanation(null);

    try {
      const imageAsDataUris: string[] = [];
      for (const file of rawFiles) {
        if (file.type.startsWith('image/')) {
          const dataUri = await fileToDataUri(file);
          imageAsDataUris.push(dataUri);
        }
      }

      const input: SuggestCodeSolutionsInput = {
        codingProblem: promptText,
        uploadedFiles: imageAsDataUris.length > 0 ? imageAsDataUris : undefined,
      };

      const aiResponse = await suggestCodeSolutions(input);
      setGeneratedCode(aiResponse.suggestedSolution);
      setExplanation(aiResponse.explanation);
      
      currentUser.aiResponsesToday = (currentUser.aiResponsesToday || 0) + 1;
      currentUser.aiResponsesThisWeek = (currentUser.aiResponsesThisWeek || 0) + 1;
      toast({ title: "Code Generated!", description: "AI has generated code and an explanation." });

    } catch (err) {
      console.error("Code generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate code: ${errorMessage}. Please check your connection and ensure the AI service is available (Genkit server might need to be running).`);
      toast({ title: "Generation Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Wand2 className="mr-3 h-8 w-8 text-primary" />
            AI Code Generator
          </CardTitle>
          <CardDescription>
            Turn your ideas and reference images into code. Describe what you need, upload any relevant images (e.g., UI mockups), and let AI assist you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="prompt-input" className="block text-sm font-medium text-foreground mb-1">Your Prompt</label>
            <Textarea
              id="prompt-input"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g., Generate a React component for a login form with email and password fields, and a submit button. Style it like this reference image..."
              className="min-h-[120px] text-base p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Reference Images (Optional)</label>
            <FileUploadButton
              onFilesSelected={handleFilesSelectedForPreview}
              onRawFilesSelected={handleRawFilesSelected}
              currentPlan={currentUser?.plan}
              accept="image/*" 
            />
            {filePreviews.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Selected images ({filePreviews.length} / {currentFileUploadLimits.maxFiles}):</p>
                <ul className="list-none p-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filePreviews.map(file => (
                    <li key={file.id} className="relative group p-2 border rounded-lg bg-muted/50 shadow-sm aspect-square flex items-center justify-center">
                      <NextImage src={file.url} alt={file.name} layout="fill" objectFit="contain" className="rounded" data-ai-hint="reference image" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFile(file.id, file.name)}
                        className="absolute top-1 right-1 h-6 w-6 opacity-75 group-hover:opacity-100"
                        aria-label={`Remove ${file.name}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button onClick={handleGenerateCode} disabled={isLoading || !promptText.trim()} size="lg" className="w-full text-base py-3">
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'Generating...' : 'Generate Code'}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">AI is thinking...</p>
        </div>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10 shadow-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <XCircle className="mr-2 h-5 w-5" /> Error Generating Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/90">{error}</p>
          </CardContent>
        </Card>
      )}

      {(generatedCode || explanation) && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Generated Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {explanation && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Explanation:</h3>
                <p className="text-foreground/90 whitespace-pre-line">{explanation}</p>
              </div>
            )}
            {generatedCode && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Generated Code:</h3>
                <CodeBlock code={generatedCode} language="typescript" /> 
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
