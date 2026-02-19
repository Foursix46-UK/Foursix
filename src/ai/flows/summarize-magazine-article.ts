'use server';
/**
 * @fileOverview This file implements a Genkit flow for summarizing magazine articles and extracting key tags.
 *
 * - summarizeMagazineArticle - A function that handles the article summarization process.
 * - SummarizeMagazineArticleInput - The input type for the summarizeMagazineArticle function.
 * - SummarizeMagazineArticleOutput - The return type for the summarizeMagazineArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMagazineArticleInputSchema = z.object({
  articleContent: z.string().describe('The full text content of the magazine article to be summarized.'),
});
export type SummarizeMagazineArticleInput = z.infer<typeof SummarizeMagazineArticleInputSchema>;

const SummarizeMagazineArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the magazine article.'),
  tags: z.array(z.string()).describe('An array of key tags or keywords relevant to the article content.'),
});
export type SummarizeMagazineArticleOutput = z.infer<typeof SummarizeMagazineArticleOutputSchema>;

export async function summarizeMagazineArticle(input: SummarizeMagazineArticleInput): Promise<SummarizeMagazineArticleOutput> {
  return summarizeMagazineArticleFlow(input);
}

const summarizeMagazineArticlePrompt = ai.definePrompt({
  name: 'summarizeMagazineArticlePrompt',
  input: {schema: SummarizeMagazineArticleInputSchema},
  output: {schema: SummarizeMagazineArticleOutputSchema},
  prompt: `You are an expert content editor for FourSix46, specializing in creating concise summaries and identifying key tags for magazine articles.

Given the full text content of a magazine article, your task is to:
1. Provide a concise summary that captures the main points and overall theme of the article.
2. Identify 3-5 key tags (single words or short phrases) that best describe the content and would be useful for categorization.

Article Content: {{{articleContent}}}`,
});

const summarizeMagazineArticleFlow = ai.defineFlow(
  {
    name: 'summarizeMagazineArticleFlow',
    inputSchema: SummarizeMagazineArticleInputSchema,
    outputSchema: SummarizeMagazineArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeMagazineArticlePrompt(input);
    return output!;
  }
);
