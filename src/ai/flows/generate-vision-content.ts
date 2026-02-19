'use server';
/**
 * @fileOverview A Genkit flow for generating a company's vision statement and core values.
 *
 * - generateVisionContent - A function that handles the generation process.
 * - GenerateVisionContentInput - The input type for the generateVisionContent function.
 * - GenerateVisionContentOutput - The return type for the generateVisionContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisionContentInputSchema = z.object({
  outline: z
    .string()
    .describe(
      "A brief outline or keywords describing the company's founding principles and history."
    ),
});
export type GenerateVisionContentInput = z.infer<
  typeof GenerateVisionContentInputSchema
>;

const GenerateVisionContentOutputSchema = z.object({
  visionStatement: z.string().describe('The generated vision statement for the company.'),
  coreValues: z
    .array(
      z.object({
        title: z.string().describe('The title of the core value.'),
        description: z.string().describe('A brief description of the core value.'),
      })
    )
    .describe('An array of 3-5 core values, each with a title and description.'),
});
export type GenerateVisionContentOutput = z.infer<
  typeof GenerateVisionContentOutputSchema
>;

export async function generateVisionContent(
  input: GenerateVisionContentInput
): Promise<GenerateVisionContentOutput> {
  return generateVisionContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisionContentPrompt',
  input: {schema: GenerateVisionContentInputSchema},
  output: {schema: GenerateVisionContentOutputSchema},
  prompt: `You are a content writer for "FourSix46", a premium, multi-brand holding company.
Your task is to draft an engaging and sophisticated "Vision" statement and a set of 3-5 concise core values with descriptions, reflecting a "Quiet Luxury" and "Neo-Brutalism" aesthetic.

The content should be impactful, forward-looking, and resonate with investors, business partners, and global media.

Here is an outline or keywords describing the company's founding principles and history:
{{{outline}}}

Ensure the language is high-end, articulate, and embodies the company's ambition and unique market position.
`,
});

const generateVisionContentFlow = ai.defineFlow(
  {
    name: 'generateVisionContentFlow',
    inputSchema: GenerateVisionContentInputSchema,
    outputSchema: GenerateVisionContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
