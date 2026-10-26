import type { MetadataRoute } from "next";
import { absUrl } from "@/content/site";

export const dynamic = "force-static";

/**
 * Open to search and AI crawlers alike — the goal is to be cited in Google AI Overviews,
 * Gemini, ChatGPT, Claude, Perplexity, DeepSeek, Copilot and friends.
 */
const aiAgents = [
  "Google-Extended",
  "GoogleOther",
  "Gemini-Deep-Research",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "DeepSeekBot",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "meta-externalagent",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "Amazonbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiAgents, allow: "/" },
    ],
    sitemap: absUrl("/sitemap.xml"),
  };
}
