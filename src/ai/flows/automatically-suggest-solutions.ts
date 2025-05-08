// src/ai/flows/automatically-suggest-solutions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that automatically suggests solutions to coding problems.
 *
 * - automaticallySuggestSolutions - A function that triggers the flow to provide solutions.
 * - AutomaticallySuggestSolutionsInput - The input type for the automaticallySuggestSolutions function.
 * - AutomaticallySuggestSolutionsOutput - The return type for the automaticallySuggestSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticallySuggestSolutionsInputSchema = z.object({
  problemDescription: z.string().describe('The detailed description of the coding problem.'),
  codeSnippet: z.string().optional().describe('Optional code snippet related to the problem.'),
  uploadedFiles: z
    .array(z.string())
    .optional()
    .describe('Optional URLs of uploaded files (code files, images, PDFs, Word docs).'),
});

export type AutomaticallySuggestSolutionsInput = z.infer<
  typeof AutomaticallySuggestSolutionsInputSchema
>;

const AutomaticallySuggestSolutionsOutputSchema = z.object({
  suggestedSolution: z.string().describe('The AI-generated suggested solution to the problem.'),
  confidenceLevel: z
    .number()
    .optional()
    .describe('Optional confidence level (0-1) of the AI in the suggested solution.'),
});

export type AutomaticallySuggestSolutionsOutput = z.infer<
  typeof AutomaticallySuggestSolutionsOutputSchema
>;

export async function automaticallySuggestSolutions(
  input: AutomaticallySuggestSolutionsInput
): Promise<AutomaticallySuggestSolutionsOutput> {
  return automaticallySuggestSolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automaticallySuggestSolutionsPrompt',
  input: {schema: AutomaticallySuggestSolutionsInputSchema},
  output: {schema: AutomaticallySuggestSolutionsOutputSchema},
  prompt: `You are an AI expert in debugging and solving coding problems.

You will analyze the problem description, code snippet (if provided), and any uploaded files to suggest a solution.

Problem Description: {{{problemDescription}}}

{{#if codeSnippet}}
Code Snippet:
{{codeSnippet}}
{{/if}}

{{#if uploadedFiles}}
Uploaded Files:
{{#each uploadedFiles}}
- {{{this}}}
{{/each}}
{{/if}}

Suggest a solution to the coding problem. Include the confidence level of your solution if possible.
`,
});

const automaticallySuggestSolutionsFlow = ai.defineFlow(
  {
    name: 'automaticallySuggestSolutionsFlow',
    inputSchema: AutomaticallySuggestSolutionsInputSchema,
    outputSchema: AutomaticallySuggestSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
