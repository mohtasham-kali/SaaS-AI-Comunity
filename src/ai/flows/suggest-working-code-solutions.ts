'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting working code solutions to user-submitted coding problems.
 *
 * - suggestWorkingCodeSolutions - A function that takes a coding problem as input and returns a suggested code solution.
 * - SuggestWorkingCodeSolutionsInput - The input type for the suggestWorkingCodeSolutions function.
 * - SuggestWorkingCodeSolutionsOutput - The output type for the suggestWorkingCodeSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkingCodeSolutionsInputSchema = z.object({
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
export type SuggestWorkingCodeSolutionsInput = z.infer<
  typeof SuggestWorkingCodeSolutionsInputSchema
>;

const SuggestWorkingCodeSolutionsOutputSchema = z.object({
  suggestedSolution: z
    .string()
    .describe('A suggested code solution to the problem.'),
  explanation: z
    .string()
    .describe('A detailed explanation of the suggested solution.'),
});
export type SuggestWorkingCodeSolutionsOutput = z.infer<
  typeof SuggestWorkingCodeSolutionsOutputSchema
>;

export async function suggestWorkingCodeSolutions(
  input: SuggestWorkingCodeSolutionsInput
): Promise<SuggestWorkingCodeSolutionsOutput> {
  return suggestWorkingCodeSolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkingCodeSolutionsPrompt',
  input: {schema: SuggestWorkingCodeSolutionsInputSchema},
  output: {schema: SuggestWorkingCodeSolutionsOutputSchema},
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

const suggestWorkingCodeSolutionsFlow = ai.defineFlow(
  {
    name: 'suggestWorkingCodeSolutionsFlow',
    inputSchema: SuggestWorkingCodeSolutionsInputSchema,
    outputSchema: SuggestWorkingCodeSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
