'use server';
/**
 * @fileOverview An AI agent to explain errors in code.
 *
 * - explainErrors - A function that handles the error explanation process.
 * - ExplainErrorsInput - The input type for the explainErrors function.
 * - ExplainErrorsOutput - The return type for the explainErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainErrorsInputSchema = z.object({
  code: z.string().describe('The code snippet containing the error.'),
  error: z.string().describe('The error message or stack trace.'),
  language: z.string().describe('The programming language of the code.'),
});
export type ExplainErrorsInput = z.infer<typeof ExplainErrorsInputSchema>;

const ExplainErrorsOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the error and its potential causes.'),
  suggestedSolution: z.string().describe('A suggested solution or steps to fix the error.'),
});
export type ExplainErrorsOutput = z.infer<typeof ExplainErrorsOutputSchema>;

export async function explainErrors(input: ExplainErrorsInput): Promise<ExplainErrorsOutput> {
  return explainErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainErrorsPrompt',
  input: {schema: ExplainErrorsInputSchema},
  output: {schema: ExplainErrorsOutputSchema},
  prompt: `You are an expert software developer. You will be given a code snippet, an error message, and the programming language. Your task is to explain the error in detail and provide a suggested solution.

Language: {{{language}}}
Code:
```{{{language}}}\n{{code}}\n```

Error: {{{error}}}

Explanation:`,
});

const explainErrorsFlow = ai.defineFlow(
  {
    name: 'explainErrorsFlow',
    inputSchema: ExplainErrorsInputSchema,
    outputSchema: ExplainErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
