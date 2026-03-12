/**
 * @fileOverview Genkit Initialization for FourSix46.
 * 
 * This file configures the AI architecture using Google's Gemini models.
 * The Gemini API key is required to power the following features:
 * - summarizeMagazineArticle: Automated editorial summaries for the archive.
 * - generateVisionContent: Drafting high-fidelity corporate narratives.
 * - generateVentureLogoAndTagline: Branding assistance for new portfolio entries.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash', // High-performance model for low-latency intelligence
});
