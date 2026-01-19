'use server';

import { ai, models } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateForumAnswerInputSchema = z.object({
    title: z.string().describe('The title of the forum post.'),
    description: z.string().describe('The content/description of the forum post.'),
    codeSnippet: z.string().optional().describe('Optional code snippet from the post.'),
    language: z.string().optional().describe('Programming language of the code snippet.'),
    model: z.string().optional().describe('The AI model to use for generating the answer.'),
});

export type GenerateForumAnswerInput = z.infer<typeof GenerateForumAnswerInputSchema>;

const GenerateForumAnswerOutputSchema = z.object({
    answer: z.string().describe('The helpful, empathetic, and technical answer to the post.'),
    modelUsed: z.string().optional().describe('The name of the model used to generate the answer.'),
});

export type GenerateForumAnswerOutput = z.infer<typeof GenerateForumAnswerOutputSchema>;

export async function generateForumAnswer(input: GenerateForumAnswerInput): Promise<GenerateForumAnswerOutput> {
    return generateForumAnswerFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateForumAnswerPrompt',
    input: { schema: GenerateForumAnswerInputSchema },
    output: { schema: GenerateForumAnswerOutputSchema },
    prompt: `You are a helpful, empathetic, and expert software developer in a community forum.
A user has posted a question that hasn't received a reply for a while. Your goal is to provide a high-quality answer to help them.

Post Title: {{{title}}}

Post Description:
{{{description}}}

{{#if codeSnippet}}
Code Snippet ({{{language}}}):
\`\`\`{{{language}}}
{{{codeSnippet}}}
\`\`\`
{{/if}}

Instructions:
1. Be polite and encouraging. Acknowledge that they've been waiting.
2. Analyze the problem carefully.
3. Provide a clear, step-by-step solution or explanation.
4. If code is involved, provide corrected or example code in markdown blocks.
5. Keep the tone professional but friendly.
6. If the question is unclear, ask clarifying questions but still try to offer general advice based on the title.

Answer:
`,
});

const generateForumAnswerFlow = ai.defineFlow(
    {
        name: 'generateForumAnswerFlow',
        inputSchema: GenerateForumAnswerInputSchema,
        outputSchema: GenerateForumAnswerOutputSchema,
    },
    async (input) => {
        const modelName = input.model || 'gemini-flash';
        // @ts-ignore - Dynamic model selection
        const selectedModel = models[modelName] || models['gemini-flash'];

        const { output } = await prompt(input, { model: selectedModel });
        return { ...output!, modelUsed: modelName };
    }
);
