'use server';

/**
 * @fileOverview Analyzes uploaded files for bugs and errors.
 *
 * - analyzeUploadedFiles - A function that analyzes uploaded files for bugs and errors.
 * - AnalyzeUploadedFilesInput - The input type for the analyzeUploadedFiles function.
 * - AnalyzeUploadedFilesOutput - The return type for the analyzeUploadedFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedFilesInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The file to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileType: z.string().describe('The type of the uploaded file.'),
});
export type AnalyzeUploadedFilesInput = z.infer<typeof AnalyzeUploadedFilesInputSchema>;

const AnalyzeUploadedFilesOutputSchema = z.object({
  analysisResults: z
    .string()
    .describe('The results of the analysis, including any bugs or errors found.'),
});
export type AnalyzeUploadedFilesOutput = z.infer<typeof AnalyzeUploadedFilesOutputSchema>;

export async function analyzeUploadedFiles(input: AnalyzeUploadedFilesInput): Promise<AnalyzeUploadedFilesOutput> {
  return analyzeUploadedFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedFilesPrompt',
  input: {schema: AnalyzeUploadedFilesInputSchema},
  output: {schema: AnalyzeUploadedFilesOutputSchema},
  prompt: `You are an expert software developer. Analyze the uploaded file for bugs and errors and provide a detailed explanation of any issues found and how to fix them. The file type is {{{fileType}}}.\n\nFile: {{media url=fileDataUri}}`,
});

const analyzeUploadedFilesFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedFilesFlow',
    inputSchema: AnalyzeUploadedFilesInputSchema,
    outputSchema: AnalyzeUploadedFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
