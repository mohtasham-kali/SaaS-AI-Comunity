'use server';

/**
 * @fileOverview An AI agent that debugs code snippets.
 *
 * - debugCode - A function that handles the code debugging process.
 * - DebugCodeInput - The input type for the debugCode function.
 * - DebugCodeOutput - The return type for the debugCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebugCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to debug.'),
  language: z.string().describe('The programming language of the code snippet.'),
  description: z
    .string()
    .optional()
    .describe('Optional description of the issue or context of the code.'),
});
export type DebugCodeInput = z.infer<typeof DebugCodeInputSchema>;

const DebugCodeOutputSchema = z.object({
  explanation: z.string().describe('Explanation of the errors found in the code.'),
  suggestions: z.string().describe('Suggestions for fixing the identified errors.'),
  debuggedCode: z.string().describe('The debugged code snippet with fixes applied.'),
});
export type DebugCodeOutput = z.infer<typeof DebugCodeOutputSchema>;

export async function debugCode(input: DebugCodeInput): Promise<DebugCodeOutput> {
  return debugCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'debugCodePrompt',
  input: {schema: DebugCodeInputSchema},
  output: {schema: DebugCodeOutputSchema},
  prompt: `You are an expert software developer specializing in debugging code.

You will receive a code snippet, the programming language it is written in, and an optional description of the issue.

Your task is to identify and explain any errors in the code, suggest fixes, and provide a debugged version of the code.

Language: {{{language}}}
Code:
```
{{{code}}}
```
Description: {{{description}}}

Explanation of errors:
Suggestions for fixes:
Debugged code:
`,
});

const debugCodeFlow = ai.defineFlow(
  {
    name: 'debugCodeFlow',
    inputSchema: DebugCodeInputSchema,
    outputSchema: DebugCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
