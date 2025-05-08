'use server';

/**
 * @fileOverview Summarizes code error messages or logs to help users quickly understand the root cause of problems.
 *
 * - summarizeCodeErrors - A function that summarizes code errors.
 * - SummarizeCodeErrorsInput - The input type for the summarizeCodeErrors function.
 * - SummarizeCodeErrorsOutput - The return type for the summarizeCodeErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCodeErrorsInputSchema = z.object({
  errorLog: z
    .string()
    .describe('The error message or log to summarize.'),
  codeSnippet: z
    .string()
    .optional()
    .describe('Optional code snippet related to the error.'),
  language: z
    .string()
    .optional()
    .describe('The programming language of the code snippet.'),
});

export type SummarizeCodeErrorsInput = z.infer<typeof SummarizeCodeErrorsInputSchema>;

const SummarizeCodeErrorsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the error and its root cause.'),
});

export type SummarizeCodeErrorsOutput = z.infer<typeof SummarizeCodeErrorsOutputSchema>;

export async function summarizeCodeErrors(
  input: SummarizeCodeErrorsInput
): Promise<SummarizeCodeErrorsOutput> {
  return summarizeCodeErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCodeErrorsPrompt',
  input: {schema: SummarizeCodeErrorsInputSchema},
  output: {schema: SummarizeCodeErrorsOutputSchema},
  prompt: `You are an expert software developer. You will be given an error log, an optional code snippet, and the programming language. Your task is to summarize the error and explain its root cause in a concise manner.\n\nLanguage: {{{language}}}\nCode Snippet:\n```{{{language}}}\n{{codeSnippet}}\n```\n\nError Log: {{{errorLog}}}\n\nSummary: `,
});

const summarizeCodeErrorsFlow = ai.defineFlow(
  {
    name: 'summarizeCodeErrorsFlow',
    inputSchema: SummarizeCodeErrorsInputSchema,
    outputSchema: SummarizeCodeErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
