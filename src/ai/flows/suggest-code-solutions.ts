// src/ai/flows/suggest-code-solutions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting code snippets or solutions to user-submitted coding problems.
 *
 * - suggestCodeSolutions - A function that takes a coding problem as input and returns a suggested code solution.
 * - SuggestCodeSolutionsInput - The input type for the suggestCodeSolutions function.
 * - SuggestCodeSolutionsOutput - The output type for the suggestCodeSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeSolutionsInputSchema = z.object({
  codingProblem: z
    .string()
    .describe('A detailed description of the coding problem encountered.'),
  codeSnippet: z
    .string()
    .optional()
    .describe('Optional code snippet related to the problem.'),
  uploadedFiles: z
    .array(z.string())
    .optional()
    .describe(
      'Optional array of data URIs representing uploaded files (code files, images, PDFs, Word docs) related to the problem.  Each data URI must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type SuggestCodeSolutionsInput = z.infer<
  typeof SuggestCodeSolutionsInputSchema
>;

const SuggestCodeSolutionsOutputSchema = z.object({
  suggestedSolution: z
    .string()
    .describe('A suggested code solution to the problem.'),
  explanation: z
    .string()
    .describe('A detailed explanation of the suggested solution.'),
});
export type SuggestCodeSolutionsOutput = z.infer<
  typeof SuggestCodeSolutionsOutputSchema
>;

export async function suggestCodeSolutions(
  input: SuggestCodeSolutionsInput
): Promise<SuggestCodeSolutionsOutput> {
  return suggestCodeSolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeSolutionsPrompt',
  input: {schema: SuggestCodeSolutionsInputSchema},
  output: {schema: SuggestCodeSolutionsOutputSchema},
  prompt: `You are an AI expert in debugging and providing code solutions.

You are given a coding problem, and optionally a code snippet and supporting files.
Your task is to provide a working code solution and explain the solution in detail.

Coding Problem: {{{codingProblem}}}

{{#if codeSnippet}}
Code Snippet:
{{codeSnippet}}
{{/if}}

{{#if uploadedFiles}}
Uploaded Files:
{{#each uploadedFiles}}
{{media url=this}}
{{/each}}
{{/if}}
`,
});

const suggestCodeSolutionsFlow = ai.defineFlow(
  {
    name: 'suggestCodeSolutionsFlow',
    inputSchema: SuggestCodeSolutionsInputSchema,
    outputSchema: SuggestCodeSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
