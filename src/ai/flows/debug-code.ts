
'use server';

/**
 * @fileOverview An AI agent that debugs code snippets and programming problems.
 *
 * - debugCode - A function that handles the code debugging process.
 * - DebugCodeInput - The input type for the debugCode function.
 * - DebugCodeOutput - The return type for the debugCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebugCodeInputSchema = z.object({
  problemDescription: z
    .string()
    .min(1, { message: "Problem description cannot be empty." })
    .describe('A detailed description of the bug, error, or problem encountered.'),
  codeSnippet: z
    .string()
    .optional()
    .describe('An optional code snippet that is related to the problem.'),
  language: z
    .string()
    .optional()
    .describe('The programming language of the optional code snippet (e.g., javascript, python).'),
  uploadedFiles: z
    .array(
      z.string().describe("A data URI of an uploaded file. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")
    )
    .optional()
    .describe('Optional array of uploaded files (e.g., screenshots of errors, log files, additional code files) as data URIs.'),
});
export type DebugCodeInput = z.infer<typeof DebugCodeInputSchema>;

const DebugCodeOutputSchema = z.object({
  explanation: z.string().describe('Explanation of the errors found or the problem analysis.'),
  suggestions: z.string().describe('Suggestions for fixing the identified errors or addressing the problem.'),
  debuggedCode: z.string().describe('The debugged code snippet with fixes applied, or "N/A" if not applicable.'),
});
export type DebugCodeOutput = z.infer<typeof DebugCodeOutputSchema>;

export async function debugCode(input: DebugCodeInput): Promise<DebugCodeOutput> {
  return debugCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'debugCodePrompt',
  input: {schema: DebugCodeInputSchema},
  output: {schema: DebugCodeOutputSchema},
  prompt: `You are an expert software developer specializing in debugging code and solving programming problems.

You will be provided with a problem description, an optional code snippet, its language, and optional uploaded files (which could be images of errors, screenshots, or text files containing logs or more code).

Your task is to:
1. Analyze all provided information (description, code snippet, files).
2. Clearly explain any identified errors or problems in the "Explanation of errors" section.
3. Provide detailed, actionable suggestions for fixing these issues in the "Suggestions for fixes" section.
4. If a code snippet was provided and it's relevant to a fix, provide a debugged version of that code in the "Debugged code" section. If no code snippet was provided, or if debugging it isn't the primary solution, or if the snippet is too large to reasonably debug, you can state "N/A" or provide a conceptual fix. Ensure any provided code is in a markdown code block with the language specified if known.

Problem Description:
{{{problemDescription}}}

{{#if codeSnippet}}
Programming Language: {{{language}}}
Code Snippet:
\`\`\`{{{language}}}
{{{codeSnippet}}}
\`\`\`
{{/if}}

{{#if uploadedFiles}}
Uploaded Files:
{{#each uploadedFiles}}
{{media url=this}}
{{/each}}
{{/if}}

---
Explanation of errors:
[Your detailed explanation here]

Suggestions for fixes:
[Your actionable suggestions here]

Debugged code:
[Your debugged code snippet here, or N/A. If providing code, ensure it's in a markdown code block with the language specified if known.]
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

