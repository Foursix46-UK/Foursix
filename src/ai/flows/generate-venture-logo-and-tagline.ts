'use server';
/**
 * @fileOverview A Genkit flow that generates a unique, stylistically consistent placeholder logo and a concise tagline for a new venture.
 *
 * - generateVentureLogoAndTagline - A function that handles the generation process.
 * - GenerateVentureLogoAndTaglineInput - The input type for the generateVentureLogoAndTagline function.
 * - GenerateVentureLogoAndTaglineOutput - The return type for the generateVentureLogoAndTagline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVentureLogoAndTaglineInputSchema = z.object({
  ventureName: z.string().describe('The name of the venture.'),
  ventureDescription: z.string().describe('A brief description of the venture.'),
});
export type GenerateVentureLogoAndTaglineInput = z.infer<
  typeof GenerateVentureLogoAndTaglineInputSchema
>;

const GenerateVentureLogoAndTaglineOutputSchema = z.object({
  tagline: z.string().describe('A concise and catchy tagline for the venture.'),
  logoDataUri:
    z.string()
      .describe(
        "A data URI of the generated placeholder logo image (e.g., 'data:image/png;base64,...')"
      )
      .optional(), // Make optional as image generation can fail or return null media
});
export type GenerateVentureLogoAndTaglineOutput = z.infer<
  typeof GenerateVentureLogoAndTaglineOutputSchema
>;

export async function generateVentureLogoAndTagline(
  input: GenerateVentureLogoAndTaglineInput
): Promise<GenerateVentureLogoAndTaglineOutput> {
  return generateVentureLogoAndTaglineFlow(input);
}

const taglinePrompt = ai.definePrompt({
  name: 'ventureTaglinePrompt',
  input: {schema: GenerateVentureLogoAndTaglineInputSchema},
  output: {schema: z.object({tagline: z.string()})},
  prompt: `You are a branding expert for a premium, multi-brand holding company with a "Quiet Luxury" and "Neo-Brutalism" aesthetic in Dark Mode.
Generate a concise, catchy, and premium-sounding tagline for a new venture. The tagline should be 10 words or less.

Venture Name: {{{ventureName}}}
Venture Description: {{{ventureDescription}}}

Output only the tagline.`, 
});

const generateVentureLogoAndTaglineFlow = ai.defineFlow(
  {
    name: 'generateVentureLogoAndTaglineFlow',
    inputSchema: GenerateVentureLogoAndTaglineInputSchema,
    outputSchema: GenerateVentureLogoAndTaglineOutputSchema,
  },
  async input => {
    // Run tagline generation and logo generation in parallel for efficiency
    const [taglineResult, logoResult] = await Promise.all([
      taglinePrompt(input),
      ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate an abstract, minimalist, and modern placeholder logo for a venture named "${input.ventureName}" which is described as "${input.ventureDescription}".
          The logo should embody a "Quiet Luxury" and "Neo-Brutalism" aesthetic, suitable for a dark mode interface with a #0A0A0A background and #171717 surfaces.
          Incorporate elements that hint at the venture's core idea without being overly literal. Use a sophisticated color palette with subtle use of red (#E31837), cyan (#27A9E1), or yellow (#FFD100) accents if appropriate, but keep it predominantly dark and abstract.
          The output should be a single, simple, iconic image.`,
      }),
    ]);

    const tagline = taglineResult.output!.tagline;
    const logoDataUri = logoResult.media?.url;

    if (!logoDataUri) {
      // Log an error or handle the case where logo generation fails, but allow tagline to return.
      console.error('Failed to generate logo image for venture:', input.ventureName);
    }

    return {
      tagline,
      logoDataUri,
    };
  }
);
