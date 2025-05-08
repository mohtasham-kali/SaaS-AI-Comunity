import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-uploaded-files.ts';
import '@/ai/flows/automatically-suggest-solutions.ts';
import '@/ai/flows/debug-code.ts';
import '@/ai/flows/explain-errors.ts';
import '@/ai/flows/suggest-working-code-solutions.ts';
import '@/ai/flows/suggest-code-solutions.ts';
import '@/ai/flows/summarize-code-errors.ts';
import '@/ai/flows/auto-debug-code.ts';