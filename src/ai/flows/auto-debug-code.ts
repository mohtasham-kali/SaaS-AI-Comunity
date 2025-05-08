// src/ai/flows/auto-debug-code.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that automatically analyzes code for potential bugs and solutions.
 *
 * - autoDebugCode - A function that triggers the flow to analyze code and suggest solutions.
 * - AutoDebugCodeInput - The input type for the autoDebugCode function.
 * - AutoDebugCodeOutput - The return type for the autoDebugCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoDebugCodeInputSchema = z.object({
  code: z.string().describe('The code to be analyzed for bugs.'),
  language: z.string().describe('The programming language of the code.'),
});

export type AutoDebugCodeInput = z.infer<typeof AutoDebugCodeInputSchema>;

const AutoDebugCodeOutputSchema = z.object({
  bugAnalysis: z.string().describe('The AI-generated analysis of potential bugs in the code.'),
  suggestedSolutions: z
    .string()
    .describe('The AI-generated suggested solutions to fix the identified bugs.'),
});

export type AutoDebugCodeOutput = z.infer<typeof AutoDebugCodeOutputSchema>;

export async function autoDebugCode(input: AutoDebugCodeInput): Promise<AutoDebugCodeOutput> {
  return autoDebugCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoDebugCodePrompt',
  input: {schema: AutoDebugCodeInputSchema},
  output: {schema: AutoDebugCodeOutputSchema},
  prompt: `You are an AI expert in debugging code. You will analyze the provided code snippet for potential bugs and suggest solutions.

Language: {{{language}}}
Code:
```
{{{code}}}
```

Bug Analysis:
Suggested Solutions:
`,
});

const autoDebugCodeFlow = ai.defineFlow(
  {
    name: 'autoDebugCodeFlow',
    inputSchema: AutoDebugCodeInputSchema,
    outputSchema: AutoDebugCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
