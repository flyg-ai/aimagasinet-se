/** Extra yrkes-hub-profiler (ChatGPT-merge) — genererade av
 *  scripts/rehome-hubs.ts. Mergas in i HubTemplate KNOWN / ReviewTemplate REVIEW_KNOWN. */
import type { ReviewProfile } from '@/components/templates/ReviewTemplate';

export const YRKES_HUB_KNOWN_EXTRA = {
  "chatgpt-marknadsforing": {
    "logo": "bg-emerald-500",
    "ctaName": "ChatGPT",
    "score": 9.2,
    "fallbackUrl": "https://chat.openai.com",
    "tagline": "Allround AI för copy, sociala medier och kreativ ideation.",
    "tags": [
      "GPT-5",
      "Custom GPTs",
      "Snabb research",
      "Multimodal"
    ],
    "pros": [
      "Snabb och flexibel",
      "Stort GPT-bibliotek för SEO",
      "Bra på svenska",
      "Bredast användning"
    ],
    "cons": [
      "Ingen direkt SERP-data",
      "Kräver bra prompts",
      "Knapphändig källhantering"
    ],
    "offer": {
      "title": "Plus 7 dagar gratis",
      "price": "Gratis · Plus 20 USD/mån",
      "bestFor": "Allmänt copy-arbete utan smal nisch"
    },
    "label": "Redaktionens val"
  }
};

export const YRKES_HUB_REVIEW_KNOWN_EXTRA: Record<string, Partial<ReviewProfile>> = {
  "chatgpt-marknadsforing": {
    "logo": "bg-emerald-500",
    "ctaName": "ChatGPT",
    "score": 9.2,
    "fallbackUrl": "https://chat.openai.com",
    "company": "OpenAI",
    "model": "ChatGPT plattform",
    "founded": 2015,
    "hq": "San Francisco, USA",
    "useCases": [
      "Keyword-research",
      "Content-briefs",
      "Meta-optimering",
      "SERP-analys via plugins",
      "Internal linking-förslag",
      "Bloggar och artiklar",
      "Sociala medier",
      "E-postsekvenser"
    ],
    "ratingCriteria": [
      {
        "label": "Textkvalitet",
        "score": 9.5
      },
      {
        "label": "Brand voice",
        "score": 9.4
      },
      {
        "label": "Mallar & flöden",
        "score": 9.3
      },
      {
        "label": "Språkstöd",
        "score": 9.2
      },
      {
        "label": "Pris / prestanda",
        "score": 9.1
      },
      {
        "label": "Användarvänlighet",
        "score": 9
      }
    ],
    "tags": [
      "GPT-5",
      "Custom GPTs",
      "Snabb research",
      "Multimodal"
    ],
    "pros": [
      "Snabb och flexibel",
      "Stort GPT-bibliotek för SEO",
      "Bra på svenska",
      "Bredast användning"
    ],
    "cons": [
      "Ingen direkt SERP-data",
      "Kräver bra prompts",
      "Knapphändig källhantering"
    ],
    "offer": {
      "title": "Plus 7 dagar gratis",
      "price": "Gratis · Plus 20 USD/mån",
      "bestFor": "Allmänt copy-arbete utan smal nisch"
    },
    "label": "Redaktionens val"
  }
};
