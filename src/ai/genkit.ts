import { genkit } from 'genkit';
import { googleAI, gemini20Flash, gemini15Pro } from '@genkit-ai/googleai';
import { anthropic, claude3Haiku, claude3Sonnet, claude3Opus } from 'genkitx-anthropic';
import { mistral, openMistralLarge, openMistralSmall } from 'genkitx-mistral';

const plugins = [];

if (process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
  plugins.push(googleAI());
}

if (process.env.ANTHROPIC_API_KEY) {
  plugins.push(anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }));
}

if (process.env.MISTRAL_API_KEY) {
  plugins.push(mistral({ apiKey: process.env.MISTRAL_API_KEY }));
}

export const ai = genkit({
  plugins,
  model: gemini20Flash, // Default model
});

export const models = {
  'gemini-flash': gemini20Flash,
  'gemini-pro': gemini15Pro,
  'claude-haiku': claude3Haiku,
  'claude-sonnet': claude3Sonnet,
  'claude-opus': claude3Opus,
  'mistral-large': openMistralLarge,
  'mistral-small': openMistralSmall,
};
