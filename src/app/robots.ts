// src/app/robots.ts  ->  https://foursix46.com/robots.txt
//
// Policy: this site is deliberately open. Every search engine, every AI model crawler
// and every generic web tool is allowed to read and use the public content. The only
// closed areas are the CMS, the API handlers and post-action confirmation pages, which
// hold nothing a crawler should index.

import { MetadataRoute } from "next";
import { SITE_URL, EXCLUDED_PATHS } from "@/lib/seo";

/**
 * Named AI / LLM crawler tokens.
 *
 * Listing them explicitly matters: several of these (Google-Extended,
 * Applebot-Extended, CCBot) are opt-OUT tokens, so an explicit "Allow" is the clearest
 * possible statement that FourSix46 content may be crawled, cited and trained on.
 * Search engines still match the "*" rule below, so nothing here narrows access.
 */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot", "ChatGPT-User", "OAI-SearchBot",
  // Anthropic
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai", "Claude-Web",
  // Google (Gemini / Vertex training token)
  "Google-Extended", "GoogleOther",
  // Apple Intelligence
  "Applebot", "Applebot-Extended",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // Meta
  "meta-externalagent", "meta-externalfetcher", "FacebookBot",
  // Amazon
  "Amazonbot", "Nova-Act",
  // Microsoft / Copilot
  "bingbot", "BingPreview", "msnbot",
  // Common Crawl — the base corpus behind most open models
  "CCBot",
  // Other assistants, answer engines and research crawlers
  "cohere-ai", "cohere-training-data-crawler", "Bytespider", "ByteDance",
  "YouBot", "PhindBot", "DuckAssistBot", "MistralAI-User", "Diffbot",
  "Timpibot", "Omgilibot", "omgili", "ImagesiftBot", "Kangaroo Bot",
  "AI2Bot", "Ai2Bot-Dolma", "Webzio-Extended", "PanguBot", "Petalbot",
  "SemrushBot-OCOB", "Scrapy", "AwarioRssBot", "peer39_crawler",
  // Link unfurlers and general web tooling
  "Twitterbot", "LinkedInBot", "Slackbot", "Discordbot", "WhatsApp",
  "TelegramBot", "Pinterestbot", "redditbot", "Embedly",
];

export default function robots(): MetadataRoute.Robots {
  // Prefix match: "/admin" also covers "/admin/anything".
  const disallow = [...EXCLUDED_PATHS];

  return {
    rules: [
      // Everyone: full access to the public site.
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // Every named AI crawler gets the same open policy, stated explicitly.
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow,
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`],
    host: SITE_URL,
  };
}
