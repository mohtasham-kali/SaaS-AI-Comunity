'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Zap, Settings, Code, Bug, Lightbulb } from "lucide-react";

const aiToolsSchema = z.object({
  preferredModel: z.string().min(1, { message: "Please select a preferred AI model." }),
  codeGenerationEnabled: z.boolean(),
  errorExplanationEnabled: z.boolean(),
  bugFixingEnabled: z.boolean(),
  autoSuggestionsEnabled: z.boolean(),
  responseLength: z.string().min(1, { message: "Please select response length preference." }),
  languagePreference: z.string().min(1, { message: "Please select your preferred programming language." }),
});

type AIToolsFormValues = z.infer<typeof aiToolsSchema>;

export function AIToolsSettings() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AIToolsFormValues>({
    resolver: zodResolver(aiToolsSchema),
    defaultValues: {
      preferredModel: "gpt-5",
      codeGenerationEnabled: true,
      errorExplanationEnabled: true,
      bugFixingEnabled: true,
      autoSuggestionsEnabled: true,
      responseLength: "detailed",
      languagePreference: "javascript",
    },
  });

  async function onSubmit(values: AIToolsFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "AI Settings Updated",
      description: "Your AI tool preferences have been saved successfully.",
    });
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Developer Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Code className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium">Code Generator</h4>
                <p className="text-sm text-muted-foreground">Generate code snippets and functions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Bug className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium">Bug Fixer</h4>
                <p className="text-sm text-muted-foreground">Automatically fix code errors</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Settings className="h-5 w-5 text-green-500" />
              <div>
                <h4 className="font-medium">Error Explainer</h4>
                <p className="text-sm text-muted-foreground">Explain error messages in detail</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <div>
                <h4 className="font-medium">Auto Suggestions</h4>
                <p className="text-sm text-muted-foreground">Get intelligent code suggestions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferredModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred AI Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                      </FormControl>
                                              <SelectContent>
                          <SelectItem value="gpt-5">GPT-5 - Latest and most powerful</SelectItem>
                          <SelectItem value="gpt-4">GPT-4 - Most advanced</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo - Fast and efficient</SelectItem>
                          <SelectItem value="claude-3">Claude-3 - Excellent for code</SelectItem>
                          <SelectItem value="gemini-pro">Gemini Pro - Google's latest</SelectItem>
                          <SelectItem value="cursor">Cursor - AI-powered code editor</SelectItem>
                          <SelectItem value="gork">Gork - Specialized for development</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the AI model that best suits your development needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="font-medium">Enable AI Tools</h4>
                
                <FormField
                  control={form.control}
                  name="codeGenerationEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Code Generation</FormLabel>
                        <FormDescription>
                          Allow AI to generate code snippets and functions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="errorExplanationEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Error Explanation</FormLabel>
                        <FormDescription>
                          Get detailed explanations of error messages
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bugFixingEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bug Fixing</FormLabel>
                        <FormDescription>
                          Automatically suggest fixes for code errors
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoSuggestionsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Suggestions</FormLabel>
                        <FormDescription>
                          Receive intelligent code suggestions as you type
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="responseLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select response length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how detailed you want AI responses to be
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languagePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select programming language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set your primary programming language for better suggestions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save AI Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{currentUser?.aiResponsesToday || 0}</div>
              <div className="text-sm text-muted-foreground">AI Responses Today</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{currentUser?.aiResponsesThisWeek || 0}</div>
              <div className="text-sm text-muted-foreground">AI Responses This Week</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{currentUser?.plan || 'free'}</div>
              <div className="text-sm text-muted-foreground">Current Plan</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
