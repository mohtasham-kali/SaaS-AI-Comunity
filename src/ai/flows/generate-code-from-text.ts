'use server';

import { ai, models } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCodeFromTextInputSchema = z.object({
    prompt: z.string().describe('The description of the code to generate.'),
    model: z.string().optional().describe('The AI model to use for generation.'),
});

export type GenerateCodeFromTextInput = z.infer<typeof GenerateCodeFromTextInputSchema>;

const GenerateCodeFromTextOutputSchema = z.object({
    code: z.string().describe('The generated code.'),
    explanation: z.string().optional().describe('Brief explanation of the code.'),
    modelUsed: z.string().optional().describe('The name of the model used.'),
});

export type GenerateCodeFromTextOutput = z.infer<typeof GenerateCodeFromTextOutputSchema>;

export async function generateCodeFromText(input: GenerateCodeFromTextInput): Promise<GenerateCodeFromTextOutput> {
    return generateCodeFromTextFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateCodeFromTextPrompt',
    input: { schema: GenerateCodeFromTextInputSchema },
    output: { schema: GenerateCodeFromTextOutputSchema },
    prompt: `You are an expert software developer.
Generate high-quality, efficient, and well-commented code based on the user's description.

User Description:
{{{prompt}}}

Instructions:
1. Generate the complete code requested.
2. If it's a UI component, include necessary HTML/CSS/JS.
3. If it's a function, include usage examples.
4. Provide a brief explanation of how it works.

Output Format:
Return the code and explanation.
`,
});

const generateCodeFromTextFlow = ai.defineFlow(
    {
        name: 'generateCodeFromTextFlow',
        inputSchema: GenerateCodeFromTextInputSchema,
        outputSchema: GenerateCodeFromTextOutputSchema,
    },
    async (input) => {
        const modelName = input.model || 'gemini-flash';
        // @ts-ignore - Dynamic model selection
        const selectedModel = models[modelName] || models['gemini-flash'];

        const { output } = await prompt(input, { model: selectedModel });
        return { ...output!, modelUsed: modelName };
    }
);
