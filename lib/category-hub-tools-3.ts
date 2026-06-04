/** Kategori-hub-profiler (batch 3) — genererad av scripts/seed-category-hubs-3.ts.
 *  Mergas in i REVIEW_KNOWN (ReviewTemplate) + KNOWN (HubTemplate). */
import type { ReviewProfile } from '@/components/templates/ReviewTemplate';

export const CATEGORY_HUB_REVIEW_KNOWN_3: Record<string, Partial<ReviewProfile>> = {
  "perplexity": {
    "logo": "bg-indigo-600",
    "ctaName": "Perplexity",
    "fallbackUrl": "https://www.perplexity.ai",
    "company": "Perplexity AI",
    "model": "Perplexity sonar-pro",
    "founded": 2022,
    "hq": "San Francisco, USA",
    "useCases": [
      "Faktabaserad webbsökning med källor",
      "Akademisk research",
      "Nyhetssökning i realtid",
      "Produktjämförelser",
      "Snabba faktafrågor"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 8.7
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Integritet & GDPR",
        "score": 7.9
      },
      {
        "label": "Integrationer",
        "score": 8
      },
      {
        "label": "Pris/prestanda",
        "score": 8.9
      },
      {
        "label": "Användarvänlighet",
        "score": 9
      }
    ],
    "tags": [
      "Källhänvisningar",
      "Realtidssökning",
      "Research",
      "Faktagranskning"
    ],
    "pros": [
      "Alltid uppdaterad information med tydliga källhänvisningar",
      "Snabb och fokuserad — inga onödiga utsvävningar",
      "Gratisnivån inkluderar faktisk webbsökning"
    ],
    "cons": [
      "Sämre på kreativa och öppna skrivuppgifter",
      "Begränsat stöd för svenska källor i källförteckningen"
    ],
    "offer": {
      "title": "Perplexity Pro",
      "price": "Gratis · Pro 20 USD/mån",
      "bestFor": "Forskare, journalister och analytiker som behöver fakta med källbelägg"
    },
    "label": "Bäst för research",
    "score": 8.6
  },
  "microsoft-copilot": {
    "logo": "bg-emerald-500",
    "ctaName": "Microsoft Copilot",
    "fallbackUrl": "https://copilot.microsoft.com",
    "company": "Microsoft",
    "model": "GPT-4o via Azure OpenAI",
    "founded": 2023,
    "hq": "Redmond, USA",
    "useCases": [
      "Microsoft 365-integration",
      "Mötessammanfattningar i Teams",
      "Kodning i GitHub Copilot",
      "Dokumentgenerering i Word",
      "Dataanalys i Excel"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 8.8
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.5
      },
      {
        "label": "Integritet & GDPR",
        "score": 8.6
      },
      {
        "label": "Integrationer",
        "score": 9.6
      },
      {
        "label": "Pris/prestanda",
        "score": 8.3
      },
      {
        "label": "Användarvänlighet",
        "score": 8.9
      }
    ],
    "tags": [
      "Microsoft 365",
      "Företag",
      "GDPR-stöd",
      "Teams"
    ],
    "pros": [
      "Överlägsen integration i hela Microsoft-ekosystemet",
      "Företagsplan uppfyller GDPR-krav via EU-datacenter",
      "Bekant gränssnitt för befintliga Microsoft-användare"
    ],
    "cons": [
      "Utanför Microsoft-ekosystemet tappar Copilot mycket av sitt värde",
      "Företagslicensen är dyr för mindre organisationer"
    ],
    "offer": {
      "title": "Microsoft Copilot",
      "price": "Gratis · Microsoft 365 Copilot 30 USD/användare/mån",
      "bestFor": "Organisationer som arbetar dagligen i Microsoft 365 och Teams"
    },
    "label": "Bäst för företag",
    "score": 8.8
  },
  "meta-ai": {
    "logo": "bg-orange-500",
    "ctaName": "Meta AI",
    "fallbackUrl": "https://www.meta.ai",
    "company": "Meta",
    "model": "Llama 4",
    "founded": 2023,
    "hq": "Menlo Park, USA",
    "useCases": [
      "Chattassistans i WhatsApp och Instagram",
      "Bildgenerering",
      "Informationssökning i sociala flöden",
      "Kreativt skrivande",
      "Enkel faktakoll"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 8.2
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.6
      },
      {
        "label": "Integritet & GDPR",
        "score": 7.2
      },
      {
        "label": "Integrationer",
        "score": 8.1
      },
      {
        "label": "Pris/prestanda",
        "score": 9.2
      },
      {
        "label": "Användarvänlighet",
        "score": 8.7
      }
    ],
    "tags": [
      "Gratis",
      "WhatsApp",
      "Sociala medier",
      "Öppen modell"
    ],
    "pros": [
      "Helt kostnadsfri utan begränsningar på gratisnivån",
      "Inbyggd i WhatsApp, Instagram och Facebook utan extra app",
      "Llama-modellen är öppen och kan köras lokalt"
    ],
    "cons": [
      "Metas datainsamlingspolicy är problematisk ur GDPR-perspektiv",
      "Sämre svarskvalitet på komplexa analytiska uppgifter"
    ],
    "offer": {
      "title": "Meta AI",
      "price": "Helt gratis",
      "bestFor": "Privatpersoner som vill ha en gratis assistent direkt i sina befintliga sociala appar"
    },
    "label": "Bäst gratisval",
    "score": 8.2
  },
  "mistral-le-chat": {
    "logo": "bg-sky-500",
    "ctaName": "Mistral Le Chat",
    "fallbackUrl": "https://chat.mistral.ai",
    "company": "Mistral AI",
    "model": "Mistral Large 2",
    "founded": 2023,
    "hq": "Paris, Frankrike",
    "useCases": [
      "Europeisk företagsanvändning",
      "Kodgenerering",
      "Flerspråkig textbearbetning",
      "API-integration för utvecklare",
      "GDPR-kompatibel automatisering"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 8.6
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.3
      },
      {
        "label": "Integritet & GDPR",
        "score": 9.3
      },
      {
        "label": "Integrationer",
        "score": 8.4
      },
      {
        "label": "Pris/prestanda",
        "score": 9
      },
      {
        "label": "Användarvänlighet",
        "score": 8.5
      }
    ],
    "tags": [
      "Europeiskt",
      "GDPR",
      "Öppen källkod",
      "Utvecklarvänlig"
    ],
    "pros": [
      "Europeisk aktör med starka GDPR-garantier och EU-datacenter",
      "Öppen källkod möjliggör lokal driftsättning",
      "Konkurrenskraftig prestanda till lågt pris"
    ],
    "cons": [
      "Varumärkeskännedom och ekosystem klart mindre än amerikanska konkurrenter",
      "Svenska svar är korrekta men ibland något stela"
    ],
    "offer": {
      "title": "Le Chat Pro",
      "price": "Gratis · Pro 14,99 EUR/mån",
      "bestFor": "Europeiska företag och utvecklare med höga krav på dataskydd och öppen infrastruktur"
    },
    "label": "Bäst för GDPR",
    "score": 8.7
  },
  "deepseek": {
    "logo": "bg-violet-600",
    "ctaName": "DeepSeek",
    "fallbackUrl": "https://www.deepseek.com",
    "company": "DeepSeek",
    "model": "DeepSeek-V3",
    "founded": 2023,
    "hq": "Hangzhou, Kina",
    "useCases": [
      "Avancerad kodning",
      "Matematisk problemlösning",
      "Teknisk dokumentation",
      "Kostnadseffektiv API-användning",
      "Akademisk analys"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 9.1
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.5
      },
      {
        "label": "Integritet & GDPR",
        "score": 7.2
      },
      {
        "label": "Integrationer",
        "score": 7.8
      },
      {
        "label": "Pris/prestanda",
        "score": 9.4
      },
      {
        "label": "Användarvänlighet",
        "score": 8.3
      }
    ],
    "tags": [
      "Kodning",
      "Matematik",
      "Kostnadseffektiv",
      "Öppen modell"
    ],
    "pros": [
      "Exceptionellt stark på kod och matematik till bråkdelen av konkurrenternas API-kostnad",
      "Öppen modell som kan köras lokalt för full kontroll",
      "Imponerande prestanda relativt modellstorleken"
    ],
    "cons": [
      "Kinesiskt ursprung skapar legitima farhågor kring datasuveränitet",
      "Svagt stöd för svenska och bristfällig GDPR-efterlevnad"
    ],
    "offer": {
      "title": "DeepSeek",
      "price": "Gratis webbgränssnitt · API från 0,27 USD per miljon tokens",
      "bestFor": "Utvecklare och forskare som söker maximal prestanda per spenderad krona på tekniska uppgifter"
    },
    "label": "",
    "score": 8.3
  },
  "grok": {
    "logo": "bg-rose-500",
    "ctaName": "Grok",
    "fallbackUrl": "https://grok.com",
    "company": "xAI",
    "model": "Grok-2",
    "founded": 2023,
    "hq": "Austin, USA",
    "useCases": [
      "Realtidsanalys av X-flödet",
      "Aktuella nyheter och debatter",
      "Humoristiskt och odogmatiskt skrivande",
      "Faktakoll mot sociala medier",
      "Teknisk konversation"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 8.5
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.7
      },
      {
        "label": "Integritet & GDPR",
        "score": 7.5
      },
      {
        "label": "Integrationer",
        "score": 7.9
      },
      {
        "label": "Pris/prestanda",
        "score": 8.4
      },
      {
        "label": "Användarvänlighet",
        "score": 8.6
      }
    ],
    "tags": [
      "X-integration",
      "Realtid",
      "Odogmatisk",
      "Humoristisk"
    ],
    "pros": [
      "Unik tillgång till realtidsdata från X utan fördröjning",
      "Mer öppenhjärtlig och mindre censurerad i kontroversiella ämnen",
      "Inbyggd i X Premium utan extra abonnemang"
    ],
    "cons": [
      "Starkt beroende av X-ekosystemet begränsar bredden",
      "Dataskyddspolicy knuten till X Corp är svårbedömd ur GDPR-synvinkel"
    ],
    "offer": {
      "title": "Grok via X Premium",
      "price": "Gratis begränsad · X Premium 8 USD/mån · Premium+ 16 USD/mån",
      "bestFor": "Aktiva X-användare som vill ha en assistent med puls på sociala medier i realtid"
    },
    "label": "",
    "score": 8.2
  },
  "pi-ai": {
    "logo": "bg-amber-500",
    "ctaName": "Pi AI",
    "fallbackUrl": "https://pi.ai",
    "company": "Inflection AI",
    "model": "Inflection-2.5",
    "founded": 2022,
    "hq": "Palo Alto, USA",
    "useCases": [
      "Emotionellt stöd och samtal",
      "Personlig coaching",
      "Mental hälsa och reflektion",
      "Stresshantering",
      "Dagliga incheckningar"
    ],
    "ratingCriteria": [
      {
        "label": "Svarskvalitet",
        "score": 8
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Integritet & GDPR",
        "score": 8.1
      },
      {
        "label": "Integrationer",
        "score": 7.6
      },
      {
        "label": "Pris/prestanda",
        "score": 8.8
      },
      {
        "label": "Användarvänlighet",
        "score": 9.4
      }
    ],
    "tags": [
      "Empatisk",
      "Coaching",
      "Mental hälsa",
      "Konversation"
    ],
    "pros": [
      "Unikt empatiskt och tålmodigt konversationssätt",
      "Fokuserar på användarens välmående snarare än uppgiftsutförande",
      "Enkel och inbjudande design utan överväldigande funktioner"
    ],
    "cons": [
      "Inte avsedd för produktivitetsuppgifter som kodning eller dokumentanalys",
      "Begränsade integrationer och inget API för externa tjänster"
    ],
    "offer": {
      "title": "Pi AI",
      "price": "Helt gratis",
      "bestFor": "Privatpersoner som söker en empatisk samtalspartner för reflektion och personlig utveckling"
    },
    "label": "Bäst för samtal",
    "score": 8.3
  },
  "murf-ai": {
    "logo": "bg-teal-500",
    "ctaName": "Murf AI",
    "fallbackUrl": "https://murf.ai",
    "company": "Murf AI",
    "model": "Murf Studio v4",
    "founded": 2020,
    "hq": "San Francisco, USA",
    "useCases": [
      "E-lärandeproduktion",
      "Företagspresentationer",
      "Reklaminspelningar",
      "Produktdemos",
      "HR-utbildningar"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 9
      },
      {
        "label": "Svenska språkstöd",
        "score": 9
      },
      {
        "label": "Röstbibliotek",
        "score": 9.1
      },
      {
        "label": "Voice cloning",
        "score": 8.2
      },
      {
        "label": "Pris/prestanda",
        "score": 8.6
      },
      {
        "label": "Användarvänlighet",
        "score": 9.5
      }
    ],
    "tags": [
      "Studio-editor",
      "Teamsamarbete",
      "Svenska röster",
      "Företag"
    ],
    "pros": [
      "Inbyggd röstredigerare med timing och betoning direkt i gränssnittet",
      "Starka svenska röster med naturligt flöde",
      "Enkel att sätta ihop ett team kring utan teknisk bakgrund"
    ],
    "cons": [
      "Voice cloning kräver Enterprise-plan och är relativt begränsad",
      "Exportformat är färre än hos konkurrenterna"
    ],
    "offer": {
      "title": "Business",
      "price": "Gratis · Pro 29 USD/mån",
      "bestFor": "Företagsteam som producerar utbildnings- och presentationsmaterial"
    },
    "label": "Bäst för företag",
    "score": 9.1
  },
  "speechify": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Speechify",
    "fallbackUrl": "https://speechify.com",
    "company": "Speechify",
    "model": "Speechify Studio 2.0",
    "founded": 2017,
    "hq": "Los Angeles, USA",
    "useCases": [
      "Tillgänglighetsanpassning",
      "Studiehjälp",
      "Podcastskapande",
      "Dokumentuppläsning",
      "Mobilanvändning"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 8.8
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.4
      },
      {
        "label": "Röstbibliotek",
        "score": 8.6
      },
      {
        "label": "Voice cloning",
        "score": 8
      },
      {
        "label": "Pris/prestanda",
        "score": 8.9
      },
      {
        "label": "Användarvänlighet",
        "score": 9.6
      }
    ],
    "tags": [
      "Mobilapp",
      "Tillgänglighet",
      "Chrome-tillägg",
      "Naturliga röster"
    ],
    "pros": [
      "Överlägsen mobilapp med sömlös integration i vardagsflödet",
      "Mycket enkel att komma igång med utan inlärningskurva",
      "Stark prestanda per krona för enskilda användare"
    ],
    "cons": [
      "Fokuserad på uppläsning snarare än professionell röstproduktion",
      "Begränsade avancerade anpassningsmöjligheter för studio-bruk"
    ],
    "offer": {
      "title": "Premium",
      "price": "Gratis · Premium 139 USD/år",
      "bestFor": "Privatpersoner och studenter som vill ha text uppläst effektivt"
    },
    "label": "Bäst för privatpersoner",
    "score": 8.8
  },
  "play-ht": {
    "logo": "bg-cyan-600",
    "ctaName": "Play.ht",
    "fallbackUrl": "https://play.ht",
    "company": "Play.ht",
    "model": "PlayDialog",
    "founded": 2019,
    "hq": "San Francisco, USA",
    "useCases": [
      "Podcastproduktion",
      "Nyhetssajter",
      "Röstassistenter",
      "API-integrationer",
      "Innehållsautomatisering"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 9.1
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.5
      },
      {
        "label": "Röstbibliotek",
        "score": 9.3
      },
      {
        "label": "Voice cloning",
        "score": 9
      },
      {
        "label": "Pris/prestanda",
        "score": 8.7
      },
      {
        "label": "Användarvänlighet",
        "score": 8.8
      }
    ],
    "tags": [
      "API-first",
      "Podcast",
      "Ultra-realistisk",
      "Voice cloning"
    ],
    "pros": [
      "PlayDialog-modellen levererar exceptionellt naturliga samtalston",
      "Stort röstbibliotek med god variation i ålder och stil",
      "Flexibelt API som passar tekniska integrationer"
    ],
    "cons": [
      "Gränssnittet är mer komplext än Murf och Speechify",
      "Prisplaner kan vara svåra att jämföra utan att räkna teckenvolymer noga"
    ],
    "offer": {
      "title": "Creator",
      "price": "Gratis · Creator 31 USD/mån",
      "bestFor": "Podcastproducenter och utvecklare som behöver API-access"
    },
    "label": "Bäst API",
    "score": 9
  },
  "resemble-ai": {
    "logo": "bg-indigo-600",
    "ctaName": "Resemble AI",
    "fallbackUrl": "https://www.resemble.ai",
    "company": "Resemble AI",
    "model": "Resemble Neural v3",
    "founded": 2019,
    "hq": "Toronto, Kanada",
    "useCases": [
      "Spelröster",
      "Interaktiva karaktärer",
      "Röstassistenter",
      "Reklam",
      "Säkerhetsautentisering"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 9.2
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Röstbibliotek",
        "score": 8.3
      },
      {
        "label": "Voice cloning",
        "score": 9.7
      },
      {
        "label": "Pris/prestanda",
        "score": 8
      },
      {
        "label": "Användarvänlighet",
        "score": 8.2
      }
    ],
    "tags": [
      "Voice cloning",
      "Realtidssyntes",
      "Spel",
      "Enterprise"
    ],
    "pros": [
      "Marknadens starkaste voice cloning med detaljkontroll",
      "Realtidsmöjligheter gör det lämpat för interaktiva applikationer",
      "Robusta API-verktyg för komplexa produktionsflöden"
    ],
    "cons": [
      "Svenska språkstöd är inte ett prioriterat fokusområde",
      "Inlärningskurvan är brant för användare utan teknisk bakgrund"
    ],
    "offer": {
      "title": "Growth",
      "price": "Gratis trial · Growth 99 USD/mån",
      "bestFor": "Spelutvecklare och företag som bygger röstdrivna applikationer"
    },
    "label": "Bäst voice cloning",
    "score": 8.9
  },
  "wellsaid-labs": {
    "logo": "bg-emerald-500",
    "ctaName": "Wellsaid Labs",
    "fallbackUrl": "https://wellsaidlabs.com",
    "company": "WellSaid Labs",
    "model": "WellSaid Avatar v4",
    "founded": 2018,
    "hq": "Seattle, USA",
    "useCases": [
      "Företagsutbildning",
      "Compliance-material",
      "Marknadsföringsvideor",
      "E-learning",
      "Intern kommunikation"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 9
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.9
      },
      {
        "label": "Röstbibliotek",
        "score": 8.4
      },
      {
        "label": "Voice cloning",
        "score": 8.1
      },
      {
        "label": "Pris/prestanda",
        "score": 8.3
      },
      {
        "label": "Användarvänlighet",
        "score": 9.2
      }
    ],
    "tags": [
      "Företag",
      "Studio-kvalitet",
      "Etisk AI",
      "Teamplan"
    ],
    "pros": [
      "Röster med konsekvent hög studio-kvalitet utan brus eller artefakter",
      "Tydlig etisk policy kring röstägarnas samtycke och ersättning",
      "Intuitivt gränssnitt med bra samarbetsfunktioner"
    ],
    "cons": [
      "Begränsat svenska språkstöd jämfört med ElevenLabs och Murf",
      "Dyrare grundplan gör det mindre lämpat för småskalig användning"
    ],
    "offer": {
      "title": "Teams",
      "price": "Starter 49 USD/mån · Teams 149 USD/mån",
      "bestFor": "Medelstora företag med behov av konsekvent voiceover-produktion"
    },
    "label": "Bäst etisk AI",
    "score": 8.7
  },
  "lovo-ai": {
    "logo": "bg-orange-500",
    "ctaName": "LOVO AI",
    "fallbackUrl": "https://lovo.ai",
    "company": "LOVO AI",
    "model": "Genny v3",
    "founded": 2019,
    "hq": "Los Angeles, USA",
    "useCases": [
      "Youtubevideor",
      "Marknadsföringskontent",
      "E-learning",
      "Podcasts",
      "Sociala medier"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 8.7
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.6
      },
      {
        "label": "Röstbibliotek",
        "score": 9.2
      },
      {
        "label": "Voice cloning",
        "score": 8.5
      },
      {
        "label": "Pris/prestanda",
        "score": 9.1
      },
      {
        "label": "Användarvänlighet",
        "score": 9.3
      }
    ],
    "tags": [
      "Video-editor",
      "Stora bibliotek",
      "Kreativ",
      "Flerspråkig"
    ],
    "pros": [
      "Kombinerar röstsyntes med enkel videoeditor i ett verktyg",
      "Över 500 röster på fler än 100 språk inklusive svenska",
      "Mycket bra pris-prestanda-förhållande för kreatörer"
    ],
    "cons": [
      "Videoeditorn är för enkel för professionell videoproduktion",
      "Röstkvaliteten är något ojämn beroende på vilken röst som väljs"
    ],
    "offer": {
      "title": "Pro",
      "price": "Gratis · Pro 24 USD/mån",
      "bestFor": "Innehållsskapare som vill ha röst och enkel video i ett verktyg"
    },
    "label": "Bäst allt-i-ett",
    "score": 8.9
  },
  "voicemaker": {
    "logo": "bg-sky-500",
    "ctaName": "Voicemaker",
    "fallbackUrl": "https://voicemaker.in",
    "company": "Voicemaker",
    "model": "Voicemaker Neural 2.0",
    "founded": 2020,
    "hq": "Delaware, USA",
    "useCases": [
      "Budgetvänlig voiceover",
      "Utbildningsmaterial",
      "Podcastintro",
      "Webbplatsljud",
      "Enmansföretag"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 8
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.2
      },
      {
        "label": "Röstbibliotek",
        "score": 8.8
      },
      {
        "label": "Voice cloning",
        "score": 7.5
      },
      {
        "label": "Pris/prestanda",
        "score": 9.5
      },
      {
        "label": "Användarvänlighet",
        "score": 9.1
      }
    ],
    "tags": [
      "Budget",
      "Stort bibliotek",
      "Enkel",
      "API"
    ],
    "pros": [
      "Mycket lågt pris med generös gratiskvot och billiga betalplaner",
      "Stort röstbibliotek med brett språkstöd inklusive svenska",
      "Snabb och enkel att komma igång med utan registreringskrångel"
    ],
    "cons": [
      "Röstkvaliteten når inte upp till ElevenLabs eller Murf vid noggrann lyssning",
      "Begränsade avancerade funktioner för professionell produktion"
    ],
    "offer": {
      "title": "Personal",
      "price": "Gratis · Personal 10 USD/mån",
      "bestFor": "Privatpersoner och frilansare med begränsad budget"
    },
    "label": "Bäst budget",
    "score": 8.5
  },
  "replica-studios": {
    "logo": "bg-violet-600",
    "ctaName": "Replica Studios",
    "fallbackUrl": "https://replicastudios.com",
    "company": "Replica Studios",
    "model": "Replica v4",
    "founded": 2018,
    "hq": "Brisbane, Australien",
    "useCases": [
      "Spel och interaktiva medier",
      "Filmproduktion",
      "VR-upplevelser",
      "Karaktärsröster",
      "Prototyping"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 9.1
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.6
      },
      {
        "label": "Röstbibliotek",
        "score": 8.5
      },
      {
        "label": "Voice cloning",
        "score": 9.2
      },
      {
        "label": "Pris/prestanda",
        "score": 8.1
      },
      {
        "label": "Användarvänlighet",
        "score": 8.5
      }
    ],
    "tags": [
      "Spel",
      "Film",
      "Karaktärsröster",
      "Unreal Engine"
    ],
    "pros": [
      "Specifikt optimerad för emotionella karaktärsröster i spel och film",
      "Direkt integration med Unreal Engine och Unity",
      "Voice cloning med finkornig emotionell kontroll"
    ],
    "cons": [
      "Svenska språkstöd är svagt och inte ett kärnfokus för plattformen",
      "Mindre lämpat för generell voiceover utanför spel och film"
    ],
    "offer": {
      "title": "Indie",
      "price": "Gratis trial · Indie 40 USD/mån",
      "bestFor": "Spelutvecklare och filmproducenter som behöver karaktärsröster"
    },
    "label": "Bäst för spel",
    "score": 8.7
  },
  "amazon-polly": {
    "logo": "bg-rose-500",
    "ctaName": "Amazon Polly",
    "fallbackUrl": "https://aws.amazon.com/polly/",
    "company": "Amazon Web Services",
    "model": "Amazon Polly Neural",
    "founded": 2016,
    "hq": "Seattle, USA",
    "useCases": [
      "Storskalig TTS-automation",
      "Webbapplikationer",
      "IoT-enheter",
      "Tillgänglighetsanpassning",
      "Backend-integration"
    ],
    "ratingCriteria": [
      {
        "label": "Röstrealism",
        "score": 8.3
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.7
      },
      {
        "label": "Röstbibliotek",
        "score": 8.2
      },
      {
        "label": "Voice cloning",
        "score": 7.5
      },
      {
        "label": "Pris/prestanda",
        "score": 9.6
      },
      {
        "label": "Användarvänlighet",
        "score": 7.8
      }
    ],
    "tags": [
      "AWS",
      "API",
      "Skalbar",
      "SSML"
    ],
    "pros": [
      "Enastående skalbarhet och driftstabilitet via AWS-infrastruktur",
      "Stark svenska röster med konsekvent kvalitet på neural modell",
      "Betala per tecken gör det extremt kostnadseffektivt vid hög volym"
    ],
    "cons": [
      "Kräver teknisk kompetens för integration, inget visuellt studio-gränssnitt",
      "Saknar moderna funktioner som voice cloning och emotionsstyrning"
    ],
    "offer": {
      "title": "Pay-per-use",
      "price": "Gratis tier · 4 USD per 1M tecken",
      "bestFor": "Utvecklare och företag som behöver pålitlig TTS i stor skala via API"
    },
    "label": "Bäst skalbarhet",
    "score": 8.6
  },
  "descript": {
    "logo": "bg-amber-500",
    "ctaName": "Descript",
    "fallbackUrl": "https://www.descript.com",
    "company": "Descript Inc.",
    "model": "Descript AI",
    "founded": 2017,
    "hq": "San Francisco, USA",
    "useCases": [
      "Textbaserad ljudredigering",
      "Automatisk transkribering",
      "Röstkloning och overdub",
      "Borttagning av filler words",
      "Videopodcast-produktion"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 8.7
      },
      {
        "label": "AI-redigering",
        "score": 9.5
      },
      {
        "label": "Transkribering",
        "score": 9.2
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Pris/prestanda",
        "score": 8.4
      },
      {
        "label": "Användarvänlighet",
        "score": 9.1
      }
    ],
    "tags": [
      "Textbaserad redigering",
      "Transkribering",
      "Röstkloning",
      "Videopodcast"
    ],
    "pros": [
      "Textbaserad redigering sparar tid radikalt jämfört med traditionella DAW-verktyg",
      "Overdub-funktionen skapar övertygande röstkorrigeringar utan omtagningar",
      "Komplett arbetsflöde från inspelning till publicering i en enda app"
    ],
    "cons": [
      "Overdub och avancerade AI-funktioner kräver dyrare plan",
      "Svenska transkriberingar innehåller fler fel än engelska"
    ],
    "offer": {
      "title": "Descript Pro",
      "price": "Gratis · Pro 24 USD/mån",
      "bestFor": "Podcastare som vill redigera ljud som ett textdokument"
    },
    "label": "Redaktionens val",
    "score": 8.8
  },
  "riverside-fm": {
    "logo": "bg-teal-500",
    "ctaName": "Riverside.fm",
    "fallbackUrl": "https://riverside.fm",
    "company": "Riverside.fm Ltd.",
    "model": "Riverside AI Studio",
    "founded": 2019,
    "hq": "Tel Aviv, Israel",
    "useCases": [
      "Fjärrinspelning i studiokvalitet",
      "Automatisk ljudnivåjustering",
      "AI-klippning av höjdpunkter",
      "Texttransformation till sociala klipp",
      "Separata spår per deltagare"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 9.3
      },
      {
        "label": "AI-redigering",
        "score": 8.7
      },
      {
        "label": "Transkribering",
        "score": 8.5
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.7
      },
      {
        "label": "Pris/prestanda",
        "score": 8.3
      },
      {
        "label": "Användarvänlighet",
        "score": 8.9
      }
    ],
    "tags": [
      "Fjärrinspelning",
      "Separata spår",
      "Sociala klipp",
      "Intervju"
    ],
    "pros": [
      "Spelar in lokalt på varje deltagares enhet vilket eliminerar internetkvalitetsproblem",
      "Automatisk Magic Clips identifierar de starkaste segmenten för sociala medier",
      "Upp till 4K-video och 48 kHz okomprimerat ljud per spår"
    ],
    "cons": [
      "Priset stiger snabbt när antalet inspelningstimmar ökar",
      "AI-transkriberingsmodulen ingår inte i grundplanen"
    ],
    "offer": {
      "title": "Riverside Standard",
      "price": "Gratis · Standard 15 USD/mån",
      "bestFor": "Podcastare med distansintervjuer som kräver tillförlitlig inspelningskvalitet"
    },
    "label": "",
    "score": 8.7
  },
  "cleanvoice-ai": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Cleanvoice AI",
    "fallbackUrl": "https://cleanvoice.ai",
    "company": "Cleanvoice GmbH",
    "model": "Cleanvoice AI",
    "founded": 2021,
    "hq": "Berlin, Tyskland",
    "useCases": [
      "Automatisk borttagning av filler words",
      "Eliminering av stamningar och hostningar",
      "Bakgrundsbrusreducering",
      "Batch-bearbetning av avsnitt",
      "API-integration för produktionspipelines"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 9
      },
      {
        "label": "AI-redigering",
        "score": 9.1
      },
      {
        "label": "Transkribering",
        "score": 7.5
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.2
      },
      {
        "label": "Pris/prestanda",
        "score": 9
      },
      {
        "label": "Användarvänlighet",
        "score": 8.6
      }
    ],
    "tags": [
      "Filler words",
      "Brusreducering",
      "Batch",
      "Automatisering"
    ],
    "pros": [
      "Identifierar och tar bort svenska filler words som eh och öh bättre än de flesta konkurrenter",
      "Batch-läget processar en hel avsnittsserie utan manuell inmatning",
      "Transparent kreditbaserad prissättning utan dolda begränsningar"
    ],
    "cons": [
      "Saknar inspelnings- och distribueringsfunktioner vilket kräver kompletterande verktyg",
      "Klarar komplexa musikunderlägg sämre än dedikerade mastering-tjänster"
    ],
    "offer": {
      "title": "Cleanvoice Pay-as-you-go",
      "price": "Gratis 30 min · 10 USD per 10 timmar",
      "bestFor": "Podcastare som vill automatisera borttagning av filler words och stamningar"
    },
    "label": "",
    "score": 8.7
  },
  "auphonic": {
    "logo": "bg-cyan-600",
    "ctaName": "Auphonic",
    "fallbackUrl": "https://auphonic.com",
    "company": "Auphonic e.U.",
    "model": "Auphonic Multitrack",
    "founded": 2011,
    "hq": "Wien, Österrike",
    "useCases": [
      "Automatisk loudness-normalisering till EBU R128",
      "Adaptiv brusreducering",
      "Multitrack-balansering",
      "Publicering direkt till hosting-plattformar",
      "Kapitelmarkörer och metadata"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 9.2
      },
      {
        "label": "AI-redigering",
        "score": 8.8
      },
      {
        "label": "Transkribering",
        "score": 7.6
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.5
      },
      {
        "label": "Pris/prestanda",
        "score": 9.3
      },
      {
        "label": "Användarvänlighet",
        "score": 8.7
      }
    ],
    "tags": [
      "Mastering",
      "Loudness",
      "Multitrack",
      "Publicering"
    ],
    "pros": [
      "Branschstandard för loudness-normalisering och uppfyller kraven hos alla stora plattformar",
      "Direktpublicering till Spotify, SoundCloud och RSS eliminerar ett manuellt steg",
      "Har fungerat pålitligt i över ett decennium med konsekvent kvalitet"
    ],
    "cons": [
      "Gränssnittet känns daterat och saknar moderna UX-konventioner",
      "Transkriberingsmodulen är ett tillägg som kostar extra och levererar medioker svenska"
    ],
    "offer": {
      "title": "Auphonic Credits",
      "price": "Gratis 2 h/mån · 11 USD per 9 timmar",
      "bestFor": "Podcastare med fasta tekniska krav på loudness och direkt plattformspublicering"
    },
    "label": "",
    "score": 8.8
  },
  "podcastle": {
    "logo": "bg-indigo-600",
    "ctaName": "Podcastle",
    "fallbackUrl": "https://podcastle.ai",
    "company": "Podcastle Inc.",
    "model": "Podcastle AI",
    "founded": 2019,
    "hq": "Los Angeles, USA",
    "useCases": [
      "Webbaserad inspelning och redigering",
      "AI-röstgenerering för soloavsnitt",
      "Automatisk transkribering",
      "Bakgrundsljudsborttagning",
      "Export till alla större format"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 8.5
      },
      {
        "label": "AI-redigering",
        "score": 8.9
      },
      {
        "label": "Transkribering",
        "score": 8.7
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Pris/prestanda",
        "score": 8.8
      },
      {
        "label": "Användarvänlighet",
        "score": 9.3
      }
    ],
    "tags": [
      "Webb",
      "Nybörjare",
      "Röstgenerering",
      "Allt-i-ett"
    ],
    "pros": [
      "Hela produktionsflödet sker i webbläsaren utan installation",
      "Magic Dust-funktionen förbättrar inspelningskvaliteten med ett klick",
      "Generös gratisplan som räcker långt för nybörjare"
    ],
    "cons": [
      "AI-röstgenereringen på svenska saknar naturlighet och har märkbar accent",
      "Exportalternativ för avancerade format som multitrack AIFF är begränsade"
    ],
    "offer": {
      "title": "Podcastle Storyteller",
      "price": "Gratis · Storyteller 23,99 USD/mån",
      "bestFor": "Nybörjare som vill producera podcast utan att installera programvara"
    },
    "label": "",
    "score": 8.7
  },
  "alitu": {
    "logo": "bg-emerald-500",
    "ctaName": "Alitu",
    "fallbackUrl": "https://alitu.com",
    "company": "The Podcast Host Ltd.",
    "model": "Alitu",
    "founded": 2015,
    "hq": "Edinburgh, Skottland",
    "useCases": [
      "Automatisk ljudrensning och normalisering",
      "Enkel klippning och sammansättning",
      "Inbyggt musikbibliotek för intro och outro",
      "Direktpublicering till hosting",
      "Steg-för-steg-guide för nybörjare"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 8.6
      },
      {
        "label": "AI-redigering",
        "score": 8.5
      },
      {
        "label": "Transkribering",
        "score": 8
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.9
      },
      {
        "label": "Pris/prestanda",
        "score": 8.4
      },
      {
        "label": "Användarvänlighet",
        "score": 9.4
      }
    ],
    "tags": [
      "Nybörjare",
      "Automatisering",
      "Publicering",
      "Allt-i-ett"
    ],
    "pros": [
      "Guidat gränssnitt leder dig från rå inspelning till publicerat avsnitt utan tekniska beslut",
      "Automatisk bearbetning hanterar EQ, brus och normalisering utan manuell inställning",
      "Inbyggd hosting via Captivate ingår i planen och förenklar hela flödet"
    ],
    "cons": [
      "Erbjuder liten kontroll för användare som vill finjustera ljud manuellt",
      "Saknar videostöd vilket utesluter videopodcast-produktion"
    ],
    "offer": {
      "title": "Alitu",
      "price": "38 USD/mån (hosting inkluderat)",
      "bestFor": "Podcastare som vill ha ett komplett och enkelt flöde utan tekniska detaljer"
    },
    "label": "",
    "score": 8.5
  },
  "headliner": {
    "logo": "bg-orange-500",
    "ctaName": "Headliner",
    "fallbackUrl": "https://www.headliner.app",
    "company": "Headliner App Inc.",
    "model": "Headliner AI",
    "founded": 2017,
    "hq": "New York, USA",
    "useCases": [
      "Automatiska audiogram för sociala medier",
      "AI-genererade videotextningar",
      "Klippning av episodhöjdpunkter",
      "Publicering till YouTube och Instagram",
      "Transkriptionsbaserad klippning"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 8.2
      },
      {
        "label": "AI-redigering",
        "score": 8.6
      },
      {
        "label": "Transkribering",
        "score": 8.8
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.6
      },
      {
        "label": "Pris/prestanda",
        "score": 9.1
      },
      {
        "label": "Användarvänlighet",
        "score": 8.8
      }
    ],
    "tags": [
      "Sociala medier",
      "Audiogram",
      "Videotextning",
      "Marknadsföring"
    ],
    "pros": [
      "Automatiserar hela processen från ljudfil till färdigt audiogram för sociala medier",
      "Genererar textningar med hög träffsäkerhet för engelska och acceptabel svenska",
      "Gratisplanen täcker grundläggande behov för marknadsföring av enstaka avsnitt"
    ],
    "cons": [
      "Primärt ett marknadsföringsverktyg snarare än ett redigeringsverktyg, saknar djupare ljudbearbetning",
      "Exportkvaliteten på video är begränsad i gratisplanen och kräver uppgradering"
    ],
    "offer": {
      "title": "Headliner Pro",
      "price": "Gratis · Pro 7,99 USD/mån",
      "bestFor": "Podcastare som vill omvandla avsnitt till engagerande innehåll för sociala medier"
    },
    "label": "",
    "score": 8.5
  },
  "buzzsprout-ai": {
    "logo": "bg-sky-500",
    "ctaName": "Buzzsprout AI",
    "fallbackUrl": "https://www.buzzsprout.com",
    "company": "Buzzsprout LLC",
    "model": "Buzzsprout AI Tools",
    "founded": 2009,
    "hq": "Jacksonville, USA",
    "useCases": [
      "AI-genererade avsnittsbeskrivningar",
      "Automatiska kapitelmarkörer",
      "Transkribering inbyggd i hosting",
      "Automatisk publikationsschemaläggning",
      "SEO-optimerade shownotes"
    ],
    "ratingCriteria": [
      {
        "label": "Ljudkvalitet",
        "score": 7.8
      },
      {
        "label": "AI-redigering",
        "score": 8.2
      },
      {
        "label": "Transkribering",
        "score": 8.6
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.7
      },
      {
        "label": "Pris/prestanda",
        "score": 9
      },
      {
        "label": "Användarvänlighet",
        "score": 9.2
      }
    ],
    "tags": [
      "Hosting",
      "Shownotes",
      "SEO",
      "Publicering"
    ],
    "pros": [
      "AI-verktygen är direkt integrerade i hostingplattformen utan extra inloggningar",
      "Automatiska shownotes med kapitel och tidsstämplar sparar tid efter varje inspelning",
      "Enkel prisstuktur utan dolda avgifter för AI-funktioner"
    ],
    "cons": [
      "AI-funktionerna är ett komplement till hosting snarare än ett fristående produktionsverktyg",
      "Djup redigering och röstförbättring saknas och kräver ett separat verktyg"
    ],
    "offer": {
      "title": "Buzzsprout Plus",
      "price": "Gratis · Plus 12 USD/mån",
      "bestFor": "Podcastare som redan använder Buzzsprout och vill automatisera publiceringssteget"
    },
    "label": "",
    "score": 8.4
  },
  "obsidian-ai": {
    "logo": "bg-violet-600",
    "ctaName": "Obsidian AI",
    "fallbackUrl": "https://obsidian.md",
    "company": "Dynalist Inc.",
    "model": "Lokala plugin-modeller + valfri API-koppling",
    "founded": 2020,
    "hq": "Toronto, Kanada",
    "useCases": [
      "Lokal anteckningshantering med länkade koncept",
      "Personlig kunskapsbas och zettelkasten-system",
      "Offline-säker dokumentation för känsliga projekt",
      "Lång tankekedja och forskningsanteckningar",
      "Plugin-baserad AI-assistans anpassad efter eget behov"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8
      },
      {
        "label": "Tidsplanering",
        "score": 7.5
      },
      {
        "label": "Anteckningar",
        "score": 9.6
      },
      {
        "label": "Integrationer",
        "score": 8.2
      },
      {
        "label": "Pris/prestanda",
        "score": 9.5
      },
      {
        "label": "Användarvänlighet",
        "score": 7.8
      }
    ],
    "tags": [
      "Anteckningar",
      "Lokal lagring",
      "PKM",
      "Öppen källkod"
    ],
    "pros": [
      "Data lagras lokalt vilket ger full kontroll och offline-åtkomst",
      "Enormt plugin-ekosystem gör verktyget mycket anpassningsbart",
      "Engångspris utan obligatorisk prenumeration för grundfunktioner"
    ],
    "cons": [
      "Brantare inlärningskurva än konkurrenterna, kräver tid att konfigurera",
      "AI-funktionerna kräver externa API-nycklar och manuell installation"
    ],
    "offer": {
      "title": "Obsidian",
      "price": "Gratis (personligt) · Sync 4 USD/mån · Publish 8 USD/mån",
      "bestFor": "Integritetsinriktade användare och forskare som vill äga sin data och bygga en djup personlig kunskapsbas"
    },
    "label": "",
    "score": 8.6
  },
  "mem-ai": {
    "logo": "bg-rose-500",
    "ctaName": "Mem.ai",
    "fallbackUrl": "https://get.mem.ai",
    "company": "Mem Labs",
    "model": "Mem X (proprietär + GPT-4o)",
    "founded": 2020,
    "hq": "San Francisco, USA",
    "useCases": [
      "Automatisk organisering av anteckningar utan mappar",
      "AI-sökning över hela kunskapsbasen",
      "Snabb infångning av tankar och idéer",
      "Sammankoppling av relaterade anteckningar automatiskt",
      "Dagliga AI-sammanfattningar av sparad information"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9.4
      },
      {
        "label": "Tidsplanering",
        "score": 7.9
      },
      {
        "label": "Anteckningar",
        "score": 9.1
      },
      {
        "label": "Integrationer",
        "score": 8.3
      },
      {
        "label": "Pris/prestanda",
        "score": 7.6
      },
      {
        "label": "Användarvänlighet",
        "score": 8.7
      }
    ],
    "tags": [
      "Anteckningar",
      "AI-sökning",
      "Automatisering",
      "PKM"
    ],
    "pros": [
      "AI-organiseringen fungerar utan att du behöver skapa mappar eller taggar manuellt",
      "Sökmotorn hittar relevanta anteckningar även med vaga söktermer",
      "Snabbaste infångningsflödet av samtliga verktyg i listan"
    ],
    "cons": [
      "Prisnivån för AI-planen är hög jämfört med konkurrenterna",
      "Begränsade integrationer med externa kalender- och projektverktyg"
    ],
    "offer": {
      "title": "Mem AI",
      "price": "Gratis (begränsat) · AI-plan 14.99 USD/mån",
      "bestFor": "Kunskapsarbetare som samlar mycket information och vill att AI ska hålla ordning åt dem"
    },
    "label": "",
    "score": 8.5
  },
  "reclaim-ai": {
    "logo": "bg-amber-500",
    "ctaName": "Reclaim AI",
    "fallbackUrl": "https://reclaim.ai",
    "company": "Reclaim AI",
    "model": "Proprietär schemaläggningsmodell",
    "founded": 2020,
    "hq": "Seattle, USA",
    "useCases": [
      "Automatisk schemaläggning av återkommande uppgifter",
      "Skyddad fokustid i kalendern",
      "Synkronisering av uppgifter från Asana, Linear och Jira",
      "Smart omschemaläggnig vid konflikter",
      "Balansanalys av arbetstid och möten"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9
      },
      {
        "label": "Tidsplanering",
        "score": 9.6
      },
      {
        "label": "Anteckningar",
        "score": 7.2
      },
      {
        "label": "Integrationer",
        "score": 9.3
      },
      {
        "label": "Pris/prestanda",
        "score": 8.8
      },
      {
        "label": "Användarvänlighet",
        "score": 8.9
      }
    ],
    "tags": [
      "Kalender",
      "Automatisering",
      "Fokustid",
      "Integrationer"
    ],
    "pros": [
      "Automatisk schemaläggning av fokustid fungerar konsekvent och pålitligt",
      "Integrationer med projektverktyg gör att uppgifter hamnar i kalendern utan manuellt arbete",
      "Ger tydlig visuell översikt över hur arbetstiden faktiskt används"
    ],
    "cons": [
      "Anteckningsfunktioner saknas helt, verktyget gör bara en sak",
      "Kräver att Google Kalender används, fungerar inte fristående"
    ],
    "offer": {
      "title": "Reclaim AI",
      "price": "Gratis · Starter 8 USD/mån · Business 12 USD/mån",
      "bestFor": "Yrkesverksamma med packade kalendrar som vill skydda tid för djuparbete automatiskt"
    },
    "label": "Redaktionens val",
    "score": 9.1
  },
  "todoist-ai": {
    "logo": "bg-teal-500",
    "ctaName": "Todoist AI",
    "fallbackUrl": "https://todoist.com",
    "company": "Doist",
    "model": "Todoist AI (GPT-4o-integration)",
    "founded": 2007,
    "hq": "Barcelona, Spanien",
    "useCases": [
      "Uppgiftshantering med AI-prioritering",
      "Projektöversikt för team och familj",
      "Återkommande uppgifter med naturligt språk",
      "AI-nedbrytning av stora mål till deluppgifter",
      "Daglig prioriteringsvy baserad på deadlines"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.5
      },
      {
        "label": "Tidsplanering",
        "score": 8.8
      },
      {
        "label": "Anteckningar",
        "score": 7.4
      },
      {
        "label": "Integrationer",
        "score": 8.9
      },
      {
        "label": "Pris/prestanda",
        "score": 9.3
      },
      {
        "label": "Användarvänlighet",
        "score": 9.5
      }
    ],
    "tags": [
      "Uppgiftshantering",
      "Enkel",
      "Team",
      "Pris"
    ],
    "pros": [
      "Enklast att komma igång med av alla verktyg i listan",
      "Naturligt språkigenkänning för att lägga till uppgifter är snabb och träffsäker",
      "Utmärkt förhållande mellan pris och funktionalitet för privatpersoner och småteam"
    ],
    "cons": [
      "AI-funktionerna är tunnare än hos dedikerade AI-verktyg",
      "Begränsad kalenderintegration jämfört med Motion och Reclaim AI"
    ],
    "offer": {
      "title": "Todoist",
      "price": "Gratis · Pro 4 USD/mån · Business 6 USD/mån",
      "bestFor": "Individer och småteam som vill ha enkel, tillförlitlig uppgiftshantering med grundläggande AI-stöd"
    },
    "label": "",
    "score": 8.7
  },
  "sunsama": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Sunsama",
    "fallbackUrl": "https://sunsama.com",
    "company": "Sunsama",
    "model": "GPT-4o-integration",
    "founded": 2018,
    "hq": "Austin, USA",
    "useCases": [
      "Daglig ritualiserad planeringsrutin",
      "Samling av uppgifter från GitHub, Asana och e-post",
      "Tidsuppskattning och kapacitetsplanering per dag",
      "Veckoreflektion med AI-sammanfattning",
      "Fokusläge med en uppgift i taget"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.3
      },
      {
        "label": "Tidsplanering",
        "score": 9.2
      },
      {
        "label": "Anteckningar",
        "score": 8.1
      },
      {
        "label": "Integrationer",
        "score": 9.1
      },
      {
        "label": "Pris/prestanda",
        "score": 7.8
      },
      {
        "label": "Användarvänlighet",
        "score": 9
      }
    ],
    "tags": [
      "Dagplanering",
      "Ritualer",
      "Integrationer",
      "Välmående"
    ],
    "pros": [
      "Dagliga planeringsritualer skapar struktur som faktiskt efterlevs",
      "Samlar uppgifter från många källor i en enda dagvy",
      "Uppmuntrar realistisk kapacitetsplanering och motverkar överplanering"
    ],
    "cons": [
      "Priset är svårt att motivera om du inte fullt ut tar in planeringsfilosofin",
      "Ingen mobilapp i paritet med skrivbordsversionen"
    ],
    "offer": {
      "title": "Sunsama",
      "price": "16 USD/mån · Årsplan 12 USD/mån",
      "bestFor": "Yrkesverksamma som vill bygga en medveten daglig planeringsrutin och undvika känslan av att arbeta reaktivt"
    },
    "label": "",
    "score": 8.6
  },
  "akiflow": {
    "logo": "bg-cyan-600",
    "ctaName": "Akiflow",
    "fallbackUrl": "https://akiflow.com",
    "company": "Akiflow",
    "model": "GPT-4o-integration + proprietär planering",
    "founded": 2020,
    "hq": "Remote",
    "useCases": [
      "Samlad inkorg för uppgifter från Slack, Gmail och Notion",
      "Tidsblockering direkt i kalender",
      "Daglig uppgiftsgranskning och prioritering",
      "Kortkommandon för blixtsnabb uppgiftsinfångning",
      "Veckoöversikt med tidsanalys"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.6
      },
      {
        "label": "Tidsplanering",
        "score": 9
      },
      {
        "label": "Anteckningar",
        "score": 8
      },
      {
        "label": "Integrationer",
        "score": 9.2
      },
      {
        "label": "Pris/prestanda",
        "score": 8.4
      },
      {
        "label": "Användarvänlighet",
        "score": 9.1
      }
    ],
    "tags": [
      "Tidsblockering",
      "Snabbhet",
      "Integrationer",
      "Kalender"
    ],
    "pros": [
      "Snabbaste arbetsflödet för att fånga och blockera uppgifter i kalendern",
      "Integrationer med Slack och Gmail fungerar smidigt och utan friktion",
      "Kortkommandon och snabbkommandon gör vardagen märkbart effektivare"
    ],
    "cons": [
      "AI-funktionerna är ännu inte lika djupa som i Motion eller Reclaim AI",
      "Saknar riktiga anteckningsfunktioner vilket kräver ett kompletterande verktyg"
    ],
    "offer": {
      "title": "Akiflow",
      "price": "19 USD/mån · Årsplan 14.99 USD/mån",
      "bestFor": "Produktivitetsentusiaster som vill ha snabb uppgiftsinfångning och noggrann tidsblockering i ett och samma verktyg"
    },
    "label": "",
    "score": 8.8
  },
  "cron": {
    "logo": "bg-indigo-600",
    "ctaName": "Cron",
    "fallbackUrl": "https://cron.com",
    "company": "Notion Labs (förvärvat 2022)",
    "model": "Kalenderoptimering + Notion-integration",
    "founded": 2019,
    "hq": "New York, USA",
    "useCases": [
      "Kalenderhantering med tangentbordsfokus",
      "Sammanslagna kalendervy för privat och arbete",
      "Schemaläggningslänkar för externa möten",
      "Djup Notion-integration för mötesanteckningar",
      "Snabb navigering och tangentbordsgenvägar"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 7.8
      },
      {
        "label": "Tidsplanering",
        "score": 8.9
      },
      {
        "label": "Anteckningar",
        "score": 7.6
      },
      {
        "label": "Integrationer",
        "score": 8.6
      },
      {
        "label": "Pris/prestanda",
        "score": 9.2
      },
      {
        "label": "Användarvänlighet",
        "score": 9.3
      }
    ],
    "tags": [
      "Kalender",
      "Tangentbord",
      "Notion",
      "Enkelhet"
    ],
    "pros": [
      "Den mest polerade kalenderupplevelsen med genomtänkt tangentbordsnavigering",
      "Gratis för privatpersoner och integrerar sömlöst med Notion",
      "Snabb inlärningskurva och omedelbart produktiv från dag ett"
    ],
    "cons": [
      "AI-funktionerna är begränsade jämfört med Motion och Reclaim AI",
      "Passar inte team som behöver avancerad projektplanering"
    ],
    "offer": {
      "title": "Cron",
      "price": "Gratis · Teams kontakta för pris",
      "bestFor": "Notion-användare och tangentbordsorienterande yrkesverksamma som vill ha en snabb, ren kalenderupplevelse"
    },
    "label": "",
    "score": 8.6
  },
  "reflect": {
    "logo": "bg-emerald-500",
    "ctaName": "Reflect",
    "fallbackUrl": "https://reflect.app",
    "company": "Reflect Notes",
    "model": "GPT-4o-integration",
    "founded": 2021,
    "hq": "Remote",
    "useCases": [
      "Länkade anteckningar med backlink-system",
      "AI-sammanfattning av mötesanteckningar",
      "Dagboksskrivande och personlig reflektion",
      "Snabb infångning via mobilapp",
      "Koppling mellan tankar och kalenderinlägg"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.2
      },
      {
        "label": "Tidsplanering",
        "score": 7.7
      },
      {
        "label": "Anteckningar",
        "score": 9.3
      },
      {
        "label": "Integrationer",
        "score": 8
      },
      {
        "label": "Pris/prestanda",
        "score": 8.3
      },
      {
        "label": "Användarvänlighet",
        "score": 9.2
      }
    ],
    "tags": [
      "Anteckningar",
      "Reflektion",
      "PKM",
      "Enkelhet"
    ],
    "pros": [
      "Rent och avskalat gränssnitt som uppmuntrar till faktiskt skrivande",
      "Backlink-systemet är lättare att komma igång med än Obsidians",
      "Mobilappen är i paritet med skrivbordsversionen, sällan fallet i kategorin"
    ],
    "cons": [
      "Färre integrationer med externa verktyg än Notion och Mem.ai",
      "Saknar avancerade databas- eller projektvyer för teamanvändning"
    ],
    "offer": {
      "title": "Reflect",
      "price": "10 USD/mån · Årsplan 8 USD/mån",
      "bestFor": "Individer som vill ha ett snyggt, länkat anteckningssystem med AI-stöd utan att behöva konfigurera ett komplext system"
    },
    "label": "",
    "score": 8.5
  },
  "mailchimp-ai": {
    "logo": "bg-orange-500",
    "ctaName": "Mailchimp AI",
    "fallbackUrl": "https://mailchimp.com",
    "company": "Intuit Mailchimp",
    "model": "Intuit Assist (intern LLM-integration)",
    "founded": 2001,
    "hq": "Atlanta, USA",
    "useCases": [
      "Nyhetsbrev för småföretag",
      "Automatiserade välkomstsekvenser",
      "Produktrekommendationer via e-handel",
      "A/B-testning av ämnesrader",
      "Segmentering baserad på köphistorik"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.1
      },
      {
        "label": "Personalisering",
        "score": 8.3
      },
      {
        "label": "Automation",
        "score": 8.5
      },
      {
        "label": "Leveransbarhet",
        "score": 8.6
      },
      {
        "label": "Pris/prestanda",
        "score": 8
      },
      {
        "label": "Användarvänlighet",
        "score": 9.2
      }
    ],
    "tags": [
      "Nyhetsbrev",
      "Automation",
      "E-handel",
      "Småföretag"
    ],
    "pros": [
      "Mycket lättlärt gränssnitt med guided onboarding",
      "Bred integrationsekosystem med över 300 appar",
      "AI-genererade ämnesrader och innehållsförslag direkt i editorn"
    ],
    "cons": [
      "Priset stiger snabbt när kontaktlistan växer",
      "Avancerad segmentering kräver dyrare planer"
    ],
    "offer": {
      "title": "Mailchimp Free / Standard / Premium",
      "price": "Gratis · Standard från 13 USD/mån",
      "bestFor": "Småföretag och soloprenörer som vill ha ett välbeprövat allt-i-ett-verktyg"
    },
    "label": "",
    "score": 8.5
  },
  "activecampaign-ai": {
    "logo": "bg-sky-500",
    "ctaName": "ActiveCampaign AI",
    "fallbackUrl": "https://www.activecampaign.com",
    "company": "ActiveCampaign",
    "model": "ActiveCampaign AI (intern prediktiv + GPT-integration)",
    "founded": 2003,
    "hq": "Chicago, USA",
    "useCases": [
      "Komplexa multi-steg-automatiseringar för B2B",
      "Lead scoring och CRM-synkronisering",
      "Beteendebaserade e-postsekvenser",
      "Prediktiv sändningstid per kontakt",
      "Webbplatsbesökarspårning kopplad till e-post"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9
      },
      {
        "label": "Personalisering",
        "score": 8.9
      },
      {
        "label": "Automation",
        "score": 9.5
      },
      {
        "label": "Leveransbarhet",
        "score": 8.7
      },
      {
        "label": "Pris/prestanda",
        "score": 8.2
      },
      {
        "label": "Användarvänlighet",
        "score": 8.1
      }
    ],
    "tags": [
      "B2B",
      "CRM",
      "Automation",
      "Lead scoring"
    ],
    "pros": [
      "Branschledande automationsbyggare med villkorsstyrd logik",
      "Inbyggt CRM eliminerar behovet av separat säljverktyg",
      "Prediktiv sändningstid ökar öppningsfrekvensen mätbart"
    ],
    "cons": [
      "Gränssnittet kan kännas överväldigande för nybörjare",
      "Grundplanen saknar vissa avancerade AI-funktioner"
    ],
    "offer": {
      "title": "Starter / Plus / Professional / Enterprise",
      "price": "Från 15 USD/mån (Starter)",
      "bestFor": "B2B-företag och byråer som behöver djup automation och CRM i samma plattform"
    },
    "label": "",
    "score": 8.9
  },
  "brevo-ai": {
    "logo": "bg-violet-600",
    "ctaName": "Brevo AI",
    "fallbackUrl": "https://www.brevo.com",
    "company": "Brevo (fd. Sendinblue)",
    "model": "Brevo AI (intern optimeringsmotor)",
    "founded": 2012,
    "hq": "Paris, Frankrike",
    "useCases": [
      "Kostnadseffektiva massutskick för SMB",
      "Transaktionella e-postmeddelanden",
      "SMS-kampanjer kombinerat med e-post",
      "Enkel automationsbyggare för nybörjare",
      "GDPR-kompatibel marknadsföring inom EU"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 7.9
      },
      {
        "label": "Personalisering",
        "score": 8
      },
      {
        "label": "Automation",
        "score": 8.2
      },
      {
        "label": "Leveransbarhet",
        "score": 8.8
      },
      {
        "label": "Pris/prestanda",
        "score": 9.5
      },
      {
        "label": "Användarvänlighet",
        "score": 9
      }
    ],
    "tags": [
      "SMB",
      "GDPR",
      "Kostnadseffektivt",
      "Transaktionell e-post"
    ],
    "pros": [
      "Bästa pris-prestanda-förhållandet i kategorin",
      "Stark GDPR-hantering med europeisk datalagring",
      "Generös gratisplan utan kontaktgräns, bara volymgräns"
    ],
    "cons": [
      "AI-funktionerna är mindre avancerade än hos Klaviyo eller ActiveCampaign",
      "Automationsbyggaren saknar djupare villkorslogik på lägre planer"
    ],
    "offer": {
      "title": "Free / Starter / Business / Enterprise",
      "price": "Gratis · Starter från 9 USD/mån",
      "bestFor": "Europeiska SMB-företag och startups som prioriterar GDPR och låg kostnad"
    },
    "label": "",
    "score": 8.6
  },
  "hubspot-email": {
    "logo": "bg-rose-500",
    "ctaName": "HubSpot Email",
    "fallbackUrl": "https://www.hubspot.com/products/marketing/email",
    "company": "HubSpot",
    "model": "HubSpot AI (Content Assistant + Breeze AI)",
    "founded": 2006,
    "hq": "Cambridge, USA",
    "useCases": [
      "Inbound-marknadsföring integrerat med CRM",
      "Nurturing-sekvenser för B2B-leads",
      "Personaliserade e-poster baserade på CRM-data",
      "Rapportering kopplad till pipeline och intäkter",
      "Account-based marketing-kampanjer"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.8
      },
      {
        "label": "Personalisering",
        "score": 9.1
      },
      {
        "label": "Automation",
        "score": 8.9
      },
      {
        "label": "Leveransbarhet",
        "score": 8.5
      },
      {
        "label": "Pris/prestanda",
        "score": 7.6
      },
      {
        "label": "Användarvänlighet",
        "score": 8.7
      }
    ],
    "tags": [
      "CRM-integrerat",
      "B2B",
      "Inbound",
      "Enterprise"
    ],
    "pros": [
      "Sömlös integration med HubSpots kompletta CRM och säljplattform",
      "Breeze AI genererar e-postinnehåll och segmentförslag direkt i flödet",
      "Kraftfull intäktsattribuering visar exakt vilka e-poster som driver affärer"
    ],
    "cons": [
      "Högt totalpris när hela HubSpot-sviten räknas in",
      "E-postfunktionen är svår att motivera isolerat utan resten av HubSpot"
    ],
    "offer": {
      "title": "Marketing Hub Free / Starter / Professional / Enterprise",
      "price": "Gratis · Starter från 20 USD/mån",
      "bestFor": "B2B-företag som redan använder HubSpot CRM och vill ha ett sammanhållet marknadsföringsekosystem"
    },
    "label": "",
    "score": 8.7
  },
  "instantly-ai": {
    "logo": "bg-amber-500",
    "ctaName": "Instantly AI",
    "fallbackUrl": "https://instantly.ai",
    "company": "Instantly AI",
    "model": "Instantly AI (intern leveransoptimering + LLM-personalisering)",
    "founded": 2021,
    "hq": "San Francisco, USA",
    "useCases": [
      "Kall e-postutkontakt i stor skala",
      "Automatisk domänuppvärmning",
      "Rotering av flera avsändarpostlådor",
      "AI-personaliserade öppningsrader per mottagare",
      "Leadgenerering för säljteam och byråer"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.6
      },
      {
        "label": "Personalisering",
        "score": 8.8
      },
      {
        "label": "Automation",
        "score": 9.1
      },
      {
        "label": "Leveransbarhet",
        "score": 9.7
      },
      {
        "label": "Pris/prestanda",
        "score": 9.2
      },
      {
        "label": "Användarvänlighet",
        "score": 8.5
      }
    ],
    "tags": [
      "Kall e-post",
      "Leveransbarhet",
      "Outreach",
      "Säljautomation"
    ],
    "pros": [
      "Bäst i kategorin på leveransbarhet tack vare inbyggd domänuppvärmning",
      "Obegränsat antal avsändarkonton på alla planer",
      "AI-genererade personaliserade öppningsrader i stor skala"
    ],
    "cons": [
      "Fokuserat på kall e-post, passar inte traditionell nyhetsbrevmarknadsföring",
      "Analysdashboarden är funktionell men inte lika detaljerad som hos konkurrenterna"
    ],
    "offer": {
      "title": "Growth / Hypergrowth / Light Speed",
      "price": "Från 37 USD/mån (Growth)",
      "bestFor": "Säljteam och tillväxtbyråer som kör storskalig kall e-postutkontakt"
    },
    "label": "",
    "score": 9
  },
  "lemlist": {
    "logo": "bg-teal-500",
    "ctaName": "Lemlist",
    "fallbackUrl": "https://www.lemlist.com",
    "company": "Lemlist",
    "model": "Lemlist AI (intern LLM + bildpersonalisering)",
    "founded": 2018,
    "hq": "Paris, Frankrike",
    "useCases": [
      "Hyper-personaliserade kalla e-poster med dynamiska bilder",
      "Multi-kanal outreach med LinkedIn och e-post kombinerat",
      "Automatiserade uppföljningssekvenser",
      "Byråarbetsflöden med flera klientkonton",
      "Video-prospektering integrerat i e-postflöden"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.7
      },
      {
        "label": "Personalisering",
        "score": 9.3
      },
      {
        "label": "Automation",
        "score": 8.8
      },
      {
        "label": "Leveransbarhet",
        "score": 8.6
      },
      {
        "label": "Pris/prestanda",
        "score": 8.4
      },
      {
        "label": "Användarvänlighet",
        "score": 8.6
      }
    ],
    "tags": [
      "Personalisering",
      "Kall e-post",
      "Multi-kanal",
      "Bilder"
    ],
    "pros": [
      "Unik dynamisk bildpersonalisering som höjer svarsfrekvensen påtagligt",
      "Inbyggt LinkedIn-steg gör det till ett äkta multi-kanal-verktyg",
      "Lemlist community och mallar erbjuder omedelbart värde vid uppstart"
    ],
    "cons": [
      "Priset är relativt högt för vad som erbjuds på grundplanen",
      "Videofunktionen kräver integration med externa verktyg för bästa resultat"
    ],
    "offer": {
      "title": "Email Outreach / Multi-Channel / Enterprise",
      "price": "Från 59 USD/mån",
      "bestFor": "Säljare och byråer som vill sticka ut i inkorgen med visuell och personlig outreach"
    },
    "label": "",
    "score": 8.7
  },
  "smartlead": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Smartlead",
    "fallbackUrl": "https://www.smartlead.ai",
    "company": "Smartlead.ai",
    "model": "Smartlead AI (intern leveransmotor + AI-textoptimering)",
    "founded": 2022,
    "hq": "Delaware, USA",
    "useCases": [
      "Storskalig kall e-postutkontakt med hög leveransbarhet",
      "Automatiserad postlådeuppvärmning och rotation",
      "Byråhantering med klientöversikter",
      "AI-optimering av ämnesrader och brödtext",
      "Centraliserad inkorgshantering för flera konton"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.5
      },
      {
        "label": "Personalisering",
        "score": 8.4
      },
      {
        "label": "Automation",
        "score": 9.2
      },
      {
        "label": "Leveransbarhet",
        "score": 9.6
      },
      {
        "label": "Pris/prestanda",
        "score": 9.3
      },
      {
        "label": "Användarvänlighet",
        "score": 8.3
      }
    ],
    "tags": [
      "Leveransbarhet",
      "Kall e-post",
      "Byråverktyg",
      "Skalbarhet"
    ],
    "pros": [
      "Obegränsat antal aktiva leads och e-postkonton på alla planer",
      "Mycket stark leveransbarhet med avancerad uppvärmningsinfrastruktur",
      "Prisvärd byråfunktionalitet med vitLabel-alternativ"
    ],
    "cons": [
      "Gränssnittet är funktionellt men saknar polering jämfört med Instantly och Lemlist",
      "AI-textfunktionerna är ännu inte i paritet med dedikerade skrivverktyg"
    ],
    "offer": {
      "title": "Basic / Pro / Custom",
      "price": "Från 39 USD/mån (Basic)",
      "bestFor": "Byråer och tillväxtteam som hanterar flera klientkampanjer med fokus på leveransbarhet"
    },
    "label": "",
    "score": 8.8
  },
  "lavender": {
    "logo": "bg-cyan-600",
    "ctaName": "Lavender",
    "fallbackUrl": "https://www.lavender.ai",
    "company": "Lavender",
    "model": "Lavender AI (GPT-baserad e-postcoach)",
    "founded": 2020,
    "hq": "New York, USA",
    "useCases": [
      "Realtidscoachning av e-posttext direkt i Gmail och Outlook",
      "Poängsättning av e-poster baserat på konverteringsdata",
      "Personaliserade öppningsrader från LinkedIn-data",
      "Säljteamanalys av e-postprestanda",
      "Utbildning av säljare i effektiv e-postkommunikation"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9.2
      },
      {
        "label": "Personalisering",
        "score": 9
      },
      {
        "label": "Automation",
        "score": 7.8
      },
      {
        "label": "Leveransbarhet",
        "score": 8.2
      },
      {
        "label": "Pris/prestanda",
        "score": 8.5
      },
      {
        "label": "Användarvänlighet",
        "score": 9.4
      }
    ],
    "tags": [
      "E-postcoach",
      "Säljteam",
      "Gmail",
      "Outlook"
    ],
    "pros": [
      "Realtidsfeedback direkt i e-postklienten utan att byta verktyg",
      "Datadrivna rekommendationer baserade på miljontals analyserade e-poster",
      "Utmärkt för att snabbt höja hela säljteamets e-postkvalitet"
    ],
    "cons": [
      "Är ett kompletteringsverktyg, inte ett fullständigt utskicksverktyg",
      "Värdet minskar påtagligt utan ett dedikerat outreach-verktyg vid sidan om"
    ],
    "offer": {
      "title": "Free / Individual / Teams",
      "price": "Gratis (begränsat) · Individual från 29 USD/mån",
      "bestFor": "Säljare och SDR:er som vill höja kvaliteten på varje enskild e-post med AI-coachning i realtid"
    },
    "label": "",
    "score": 8.8
  },
  "warmer-ai": {
    "logo": "bg-indigo-600",
    "ctaName": "Warmer.ai",
    "fallbackUrl": "https://warmer.ai",
    "company": "Warmer.ai",
    "model": "Warmer AI (LLM-driven hyper-personalisering)",
    "founded": 2022,
    "hq": "London, Storbritannien",
    "useCases": [
      "Hyper-personaliserade e-poster genererade från LinkedIn-profiler och webbplatser",
      "Personalisering i stor skala för kalla kampanjer",
      "Icebreaker-generering per lead automatiskt",
      "Integrerad personalisering med Instantly och Smartlead",
      "Leadlistpersonalisering för byråer"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.9
      },
      {
        "label": "Personalisering",
        "score": 9.5
      },
      {
        "label": "Automation",
        "score": 8.6
      },
      {
        "label": "Leveransbarhet",
        "score": 8.3
      },
      {
        "label": "Pris/prestanda",
        "score": 8.7
      },
      {
        "label": "Användarvänlighet",
        "score": 8.8
      }
    ],
    "tags": [
      "Hyper-personalisering",
      "Kall e-post",
      "LinkedIn-data",
      "Skalbarhet"
    ],
    "pros": [
      "Snabbaste sättet att generera genuint personaliserade öppningsrader i stor skala",
      "Scraper hämtar automatiskt data från LinkedIn och företagswebbplatser",
      "Sömlös integration med de ledande outreach-plattformarna"
    ],
    "cons": [
      "Gör bara en sak, kräver alltid ett kompletterande utskicksverktyg",
      "Kvaliteten på personalisering varierar beroende på hur rik leadprofilen är"
    ],
    "offer": {
      "title": "Starter / Growth / Agency",
      "price": "Från 59 USD/mån (Starter)",
      "bestFor": "Outreach-team och byråer som vill automatisera hyper-personalisering utan att offra relevans"
    },
    "label": "",
    "score": 8.8
  },
  "tableau-ai": {
    "logo": "bg-emerald-500",
    "ctaName": "Tableau AI",
    "fallbackUrl": "https://www.tableau.com",
    "company": "Salesforce",
    "model": "Tableau AI (Einstein)",
    "founded": 2003,
    "hq": "Seattle, USA",
    "useCases": [
      "Interaktiva dashboards för C-suite",
      "Försäljningsanalys i realtid",
      "Kundresebeteende",
      "Supply chain-visualisering",
      "Self-service BI för hela organisationen"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9.4
      },
      {
        "label": "Visualisering",
        "score": 9.8
      },
      {
        "label": "Naturligt språk",
        "score": 8.6
      },
      {
        "label": "Integrationer",
        "score": 9.5
      },
      {
        "label": "Pris/prestanda",
        "score": 7.6
      },
      {
        "label": "Användarvänlighet",
        "score": 8.8
      }
    ],
    "tags": [
      "Enterprise BI",
      "Visualisering",
      "Prediktiv analys",
      "Salesforce-ekosystem"
    ],
    "pros": [
      "Branschledande visualiseringslager med djup AI-integration",
      "Sömlös koppling till Salesforce CRM och Slack",
      "Stöd för komplexa datakällor utan att kompromissa på prestanda"
    ],
    "cons": [
      "Licensieringskostnaden är hög för mindre organisationer",
      "Inlärningskurvan är brant utan dedikerad utbildning"
    ],
    "offer": {
      "title": "Tableau AI",
      "price": "Gratis provperiod · Creator från 75 USD/mån",
      "bestFor": "Medelstora till stora organisationer som redan använder Salesforce"
    },
    "label": "Redaktionens val",
    "score": 9.1
  },
  "power-bi-copilot": {
    "logo": "bg-orange-500",
    "ctaName": "Power BI Copilot",
    "fallbackUrl": "https://powerbi.microsoft.com",
    "company": "Microsoft",
    "model": "Power BI Copilot",
    "founded": 1975,
    "hq": "Redmond, USA",
    "useCases": [
      "Finansiell rapportering",
      "Operativa KPI-dashboards",
      "HR-analys",
      "Marknadsföringsattribution",
      "Microsoft 365-integrerad datainsikt"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9.2
      },
      {
        "label": "Visualisering",
        "score": 9.1
      },
      {
        "label": "Naturligt språk",
        "score": 9.3
      },
      {
        "label": "Integrationer",
        "score": 9.6
      },
      {
        "label": "Pris/prestanda",
        "score": 9
      },
      {
        "label": "Användarvänlighet",
        "score": 9.2
      }
    ],
    "tags": [
      "Microsoft 365",
      "Copilot",
      "Enterprise BI",
      "Naturligt språk"
    ],
    "pros": [
      "Djupaste integrationen med Microsoft-ekosystemet på marknaden",
      "Copilot genererar rapporter och DAX-formler från fritext",
      "Mycket konkurrenskraftigt pris för befintliga Microsoft-kunder"
    ],
    "cons": [
      "Utanför Microsoft-ekosystemet är integrationsdjupet begränsat",
      "Avancerade AI-funktioner kräver Premium Per User-licens"
    ],
    "offer": {
      "title": "Power BI Copilot",
      "price": "Gratis (begränsad) · Pro 10 USD/mån · Premium Per User 20 USD/mån",
      "bestFor": "Organisationer som redan investerat i Microsoft 365 och Azure"
    },
    "label": "Bäst för Microsoft-miljöer",
    "score": 9.2
  },
  "looker-ai": {
    "logo": "bg-sky-500",
    "ctaName": "Looker AI",
    "fallbackUrl": "https://looker.com",
    "company": "Google Cloud",
    "model": "Looker AI (Gemini)",
    "founded": 2012,
    "hq": "Santa Cruz, USA",
    "useCases": [
      "Datakatalog och semantisk modellering",
      "Inbäddad analys i SaaS-produkter",
      "Multi-cloud dataanalys",
      "Kundexponerade dashboards",
      "BigQuery-native analys"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9
      },
      {
        "label": "Visualisering",
        "score": 8.7
      },
      {
        "label": "Naturligt språk",
        "score": 8.8
      },
      {
        "label": "Integrationer",
        "score": 9.3
      },
      {
        "label": "Pris/prestanda",
        "score": 7.8
      },
      {
        "label": "Användarvänlighet",
        "score": 8.5
      }
    ],
    "tags": [
      "Google Cloud",
      "Semantiskt lager",
      "Embedded analytics",
      "BigQuery"
    ],
    "pros": [
      "LookML skapar ett robust semantiskt lager som säkrar konsistens",
      "Gemini-integration ger kraftfull naturligt språk-analys",
      "Utmärkt för inbäddad analys i externa produkter"
    ],
    "cons": [
      "Kräver teknisk kompetens för att konfigurera LookML-modeller",
      "Höga ingångskostnader jämfört med enklare alternativ"
    ],
    "offer": {
      "title": "Looker AI",
      "price": "Kontakta säljteamet · Från ca 5 000 USD/mån",
      "bestFor": "Teknikbolag och enterprises som bygger datadrivna produkter på Google Cloud"
    },
    "label": "",
    "score": 8.9
  },
  "julius-ai": {
    "logo": "bg-violet-600",
    "ctaName": "Julius AI",
    "fallbackUrl": "https://julius.ai",
    "company": "Julius AI Inc.",
    "model": "Julius AI",
    "founded": 2022,
    "hq": "San Francisco, USA",
    "useCases": [
      "Snabb explorativ dataanalys",
      "Visualisering från kalkylblad",
      "Statistisk analys utan kod",
      "Akademisk och forskningsdata",
      "Individuell analytiker-produktivitet"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.2
      },
      {
        "label": "Visualisering",
        "score": 8.5
      },
      {
        "label": "Naturligt språk",
        "score": 9.4
      },
      {
        "label": "Integrationer",
        "score": 7.8
      },
      {
        "label": "Pris/prestanda",
        "score": 9.3
      },
      {
        "label": "Användarvänlighet",
        "score": 9.5
      }
    ],
    "tags": [
      "No-code",
      "Naturligt språk",
      "Kalkylblad",
      "Snabb analys"
    ],
    "pros": [
      "Exceptionellt enkelt att komma igång med uppladdade filer",
      "Svarar på komplexa statistiska frågor via vanlig konversation",
      "Generös gratisplan för enskilda användare"
    ],
    "cons": [
      "Saknar enterprise-funktioner som rollhantering och SSO",
      "Skalbarhet till stora dataset är begränsad jämfört med BI-plattformar"
    ],
    "offer": {
      "title": "Julius AI",
      "price": "Gratis · Plus 22 USD/mån · Pro 49 USD/mån",
      "bestFor": "Analytiker, studenter och team som vill ställa frågor till data utan att skriva kod"
    },
    "label": "",
    "score": 8.9
  },
  "datarobot": {
    "logo": "bg-rose-500",
    "ctaName": "DataRobot",
    "fallbackUrl": "https://www.datarobot.com",
    "company": "DataRobot",
    "model": "DataRobot AI Platform",
    "founded": 2012,
    "hq": "Boston, USA",
    "useCases": [
      "Enterprise AutoML och MLOps",
      "Riskmodellering inom finans",
      "Bedrägeridetektering",
      "Prognos av efterfrågan",
      "AI-styrning och modelövervakning"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9.6
      },
      {
        "label": "Visualisering",
        "score": 8.4
      },
      {
        "label": "Naturligt språk",
        "score": 8.3
      },
      {
        "label": "Integrationer",
        "score": 9.1
      },
      {
        "label": "Pris/prestanda",
        "score": 7.5
      },
      {
        "label": "Användarvänlighet",
        "score": 8
      }
    ],
    "tags": [
      "Enterprise AutoML",
      "MLOps",
      "AI-styrning",
      "Finans och försäkring"
    ],
    "pros": [
      "Marknadens mest mogna AutoML-plattform med inbyggd MLOps",
      "Stark AI-styrning med explainability och modellövervakning",
      "Stöd för ett brett spektrum av algoritmer och datatyper"
    ],
    "cons": [
      "Prisnivån är utmanande för organisationer utanför enterprise-segmentet",
      "Kräver dedikerad data science-kompetens för full potentialutvinning"
    ],
    "offer": {
      "title": "DataRobot AI Platform",
      "price": "Kontakta säljteamet · Enterprise-prissättning",
      "bestFor": "Stora organisationer med etablerade data science-team som behöver skalbar MLOps"
    },
    "label": "",
    "score": 8.8
  },
  "h2o-ai": {
    "logo": "bg-amber-500",
    "ctaName": "H2O.ai",
    "fallbackUrl": "https://h2o.ai",
    "company": "H2O.ai",
    "model": "H2O AI Cloud",
    "founded": 2012,
    "hq": "Mountain View, USA",
    "useCases": [
      "Open source AutoML med H2O-3",
      "Generativ BI med h2oGPT",
      "Telekombortfall och churnmodeller",
      "Läkemedelsforskning och genomik",
      "Storbankers kreditmodeller"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 9.5
      },
      {
        "label": "Visualisering",
        "score": 8.2
      },
      {
        "label": "Naturligt språk",
        "score": 8.5
      },
      {
        "label": "Integrationer",
        "score": 8.8
      },
      {
        "label": "Pris/prestanda",
        "score": 8.9
      },
      {
        "label": "Användarvänlighet",
        "score": 7.8
      }
    ],
    "tags": [
      "Open source",
      "AutoML",
      "Generativ AI",
      "MLOps"
    ],
    "pros": [
      "Ledande open source AutoML-motor med stor community",
      "h2oGPT möjliggör generativ analys direkt mot egna data",
      "Flexibel driftsättning på eget moln, on-premise eller H2O Cloud"
    ],
    "cons": [
      "Användargränssnittet kräver viss teknisk mognad för optimal användning",
      "Dokumentation och support varierar mellan open source och enterprise-tier"
    ],
    "offer": {
      "title": "H2O AI Cloud",
      "price": "Gratis (open source) · Enterprise-licens från kontakt med säljteam",
      "bestFor": "Data science-team som värdesätter open source-flexibilitet och vill integrera generativ AI"
    },
    "label": "",
    "score": 8.8
  },
  "akkio": {
    "logo": "bg-teal-500",
    "ctaName": "Akkio",
    "fallbackUrl": "https://www.akkio.com",
    "company": "Akkio",
    "model": "Akkio",
    "founded": 2019,
    "hq": "Boston, USA",
    "useCases": [
      "Leadscoringmodeller för sälj",
      "Konverteringsprognos för marknadsföring",
      "Kundpersegmentering",
      "Realtidsprediktioner i CRM",
      "Snabb prototyping av ML-modeller"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.5
      },
      {
        "label": "Visualisering",
        "score": 8.3
      },
      {
        "label": "Naturligt språk",
        "score": 8.9
      },
      {
        "label": "Integrationer",
        "score": 8.6
      },
      {
        "label": "Pris/prestanda",
        "score": 9.1
      },
      {
        "label": "Användarvänlighet",
        "score": 9.3
      }
    ],
    "tags": [
      "No-code ML",
      "Marknadsföring",
      "CRM-integration",
      "Snabb driftsättning"
    ],
    "pros": [
      "Tränar och driftsätter modeller på under tio minuter",
      "Stark integration mot HubSpot, Salesforce och populära datakällor",
      "Chattgränssnitt gör prediktion tillgänglig utan teknisk bakgrund"
    ],
    "cons": [
      "Modellanpassning och hyperparametertuning är begränsad",
      "Passar bäst för strukturerad tabelldata och hanterar ej bilddata"
    ],
    "offer": {
      "title": "Akkio",
      "price": "Gratis provperiod · Build 49 USD/mån · Launch 99 USD/mån",
      "bestFor": "Sälj- och marknadsföringsteam som vill driftsätta prediktiva modeller direkt i sina befintliga verktyg"
    },
    "label": "",
    "score": 8.8
  },
  "polymer": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Polymer",
    "fallbackUrl": "https://www.polymersearch.com",
    "company": "Polymer",
    "model": "Polymer Search",
    "founded": 2020,
    "hq": "New York, USA",
    "useCases": [
      "Omvandling av kalkylblad till interaktiva dashboards",
      "E-handelsanalys",
      "Marknadsföringsrapportering",
      "Snabb datautforskning för team",
      "Delning av datadrivna berättelser"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8
      },
      {
        "label": "Visualisering",
        "score": 9
      },
      {
        "label": "Naturligt språk",
        "score": 9.1
      },
      {
        "label": "Integrationer",
        "score": 8.2
      },
      {
        "label": "Pris/prestanda",
        "score": 9.2
      },
      {
        "label": "Användarvänlighet",
        "score": 9.6
      }
    ],
    "tags": [
      "No-code",
      "Kalkylblad",
      "Visualisering",
      "Datadelning"
    ],
    "pros": [
      "Omvandlar en CSV-fil till ett interaktivt dashboard på sekunder",
      "Sökinriktat gränssnitt gör dataanalys extremt tillgänglig",
      "Utmärkt för team som vill dela insikter utan BI-verktygsexpertis"
    ],
    "cons": [
      "Saknar avancerade statistiska och prediktiva funktioner",
      "Begränsade integrationsalternativ jämfört med enterprise-plattformar"
    ],
    "offer": {
      "title": "Polymer",
      "price": "Gratis · Starter 10 USD/mån · Pro 20 USD/mån",
      "bestFor": "Team och individer som vill förvandla kalkylblad till visuella berättelser utan teknisk kompetens"
    },
    "label": "",
    "score": 9
  },
  "rows-ai": {
    "logo": "bg-cyan-600",
    "ctaName": "Rows AI",
    "fallbackUrl": "https://rows.com",
    "company": "Rows",
    "model": "Rows AI",
    "founded": 2018,
    "hq": "Porto, Portugal",
    "useCases": [
      "AI-assisterad kalkylbladsanalys",
      "Sammanfattning av stora dataset",
      "Automatiserad rapportering",
      "API-integration direkt i kalkylbladet",
      "Textanalys och sentimentklassificering i celler"
    ],
    "ratingCriteria": [
      {
        "label": "AI-funktioner",
        "score": 8.1
      },
      {
        "label": "Visualisering",
        "score": 8.6
      },
      {
        "label": "Naturligt språk",
        "score": 9.2
      },
      {
        "label": "Integrationer",
        "score": 8.9
      },
      {
        "label": "Pris/prestanda",
        "score": 9.4
      },
      {
        "label": "Användarvänlighet",
        "score": 9.4
      }
    ],
    "tags": [
      "Kalkylblad",
      "AI-assistent",
      "API-integration",
      "Automatisering"
    ],
    "pros": [
      "Slår ihop kraftfull AI direkt i ett välbekant kalkylbladsformat",
      "Inbyggda AI-funktioner som sammanfattar, klassificerar och analyserar text per cell",
      "Stark API-integration gör det enkelt att hämta live-data utan kod"
    ],
    "cons": [
      "Passar inte som ersättare för fullskaliga BI-plattformar vid komplex analys",
      "Samarbetsfunktioner är fortfarande mer begränsade än i Google Sheets"
    ],
    "offer": {
      "title": "Rows AI",
      "price": "Gratis · Plus 59 USD/mån per arbetsyta",
      "bestFor": "Team som vill ha AI-kraften i ett BI-verktyg men föredrar kalkylbladets bekanta gränssnitt"
    },
    "label": "",
    "score": 9
  },
  "khan-academy-ai": {
    "logo": "bg-indigo-600",
    "ctaName": "Khan Academy AI",
    "fallbackUrl": "https://www.khanacademy.org",
    "company": "Khan Academy",
    "model": "GPT-4o (anpassad)",
    "founded": 2008,
    "hq": "Mountain View, USA",
    "useCases": [
      "Adaptiv matematikträning",
      "Naturvetenskapliga förklaringar steg för steg",
      "Hemläxhjälp för grundskole- och gymnasieelever",
      "Lärarstatistik och framstegsövervakning",
      "SAT- och tentamensförberedelse"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 9.4
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.2
      },
      {
        "label": "Ämnesbredd",
        "score": 9
      },
      {
        "label": "Integritet & elevdata",
        "score": 8.5
      },
      {
        "label": "Pris/prestanda",
        "score": 9.6
      },
      {
        "label": "Användarvänlighet",
        "score": 9
      }
    ],
    "tags": [
      "Matematik",
      "Naturvetenskap",
      "Adaptivt lärande",
      "Gratis"
    ],
    "pros": [
      "Täcker ett exceptionellt brett ämnesregister från talräkning till universitetskalkyl",
      "Gratis för elever och lärare utan begränsad funktionalitet",
      "Detaljerade lärarrapporter ger reell insikt i varje elevs framsteg"
    ],
    "cons": [
      "Gränssnittet och innehållet är primärt på engelska vilket begränsar nytta i svenska klassrum",
      "AI-förklaringarna kan ibland vara alltför ordrika för elever med lässvårigheter"
    ],
    "offer": {
      "title": "Khan Academy Gratis",
      "price": "Gratis · Inga betalplaner för privatpersoner",
      "bestFor": "Grundskole- och gymnasieelever som vill träna matematik och naturvetenskap på egen hand"
    },
    "label": "Redaktionens val",
    "score": 9
  },
  "duolingo-ai": {
    "logo": "bg-emerald-500",
    "ctaName": "Duolingo AI",
    "fallbackUrl": "https://www.duolingo.com",
    "company": "Duolingo",
    "model": "GPT-4 (integrerad)",
    "founded": 2011,
    "hq": "Pittsburgh, USA",
    "useCases": [
      "Daglig språkträning med adaptiva övningar",
      "Uttal och konversationsövning via AI-karaktärer",
      "Grammatikförklaringar i kontext",
      "Spelifierad vokabelinlärning",
      "Korta intensivkurser inför resor eller prov"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 8.6
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.8
      },
      {
        "label": "Ämnesbredd",
        "score": 7
      },
      {
        "label": "Integritet & elevdata",
        "score": 8
      },
      {
        "label": "Pris/prestanda",
        "score": 9.2
      },
      {
        "label": "Användarvänlighet",
        "score": 9.5
      }
    ],
    "tags": [
      "Språkinlärning",
      "Spelifiering",
      "Mobilapp",
      "Engelska"
    ],
    "pros": [
      "Exceptionellt engagerande spelmekanik som driver daglig användning",
      "Svenska finns som målspråk och undervisningsspråk i flera kurser",
      "AI-roleplays med inbyggda karaktärer ger realistisk konversationsträning"
    ],
    "cons": [
      "Fokuserar nästan uteslutande på språk, vilket gör verktyget smalt för generell skolanvändning",
      "Djupare grammatik och skrivfärdigheter kräver Duolingo Max-prenumeration"
    ],
    "offer": {
      "title": "Duolingo Free / Duolingo Max",
      "price": "Gratis · Max 14,99 USD/mån",
      "bestFor": "Elever och vuxna som vill lära sig ett nytt språk i ett lättillgängligt och motiverande format"
    },
    "label": "",
    "score": 8.7
  },
  "coursera-ai": {
    "logo": "bg-orange-500",
    "ctaName": "Coursera AI",
    "fallbackUrl": "https://www.coursera.org",
    "company": "Coursera",
    "model": "GPT-4 Turbo (anpassad)",
    "founded": 2012,
    "hq": "Mountain View, USA",
    "useCases": [
      "Universitetskurser med AI-handledning",
      "Branschcertifieringar inom teknik och data",
      "Kompetensutveckling för yrkesverksamma lärare",
      "Automatisk kursanpassning baserad på prestationsdata",
      "Examensprogram från partneruniversitet"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 9
      },
      {
        "label": "Svenska språkstöd",
        "score": 7
      },
      {
        "label": "Ämnesbredd",
        "score": 9.2
      },
      {
        "label": "Integritet & elevdata",
        "score": 8.3
      },
      {
        "label": "Pris/prestanda",
        "score": 7.8
      },
      {
        "label": "Användarvänlighet",
        "score": 8.4
      }
    ],
    "tags": [
      "Högskoleutbildning",
      "Certifieringar",
      "Professionell utveckling",
      "MOOC"
    ],
    "pros": [
      "Samarbeten med hundratals ledande universitet ger akademisk tyngd",
      "AI-handledaren Coursera Coach förklarar kursinnehåll och genererar övningsfrågor",
      "Brett utbud av kurser inom STEM, humaniora och affärsutveckling"
    ],
    "cons": [
      "Priset för certifieringsprogram kan vara högt för enskilda elever och småskolor",
      "Innehållet är nästan uteslutande på engelska vilket begränsar tillgängligheten"
    ],
    "offer": {
      "title": "Coursera Plus",
      "price": "Gratis (enstaka kurser) · Plus 59 USD/mån",
      "bestFor": "Högskolestudenter och yrkesverksamma som söker erkända certifieringar med AI-stöd"
    },
    "label": "",
    "score": 8.3
  },
  "synthesis-ai": {
    "logo": "bg-sky-500",
    "ctaName": "Synthesis AI",
    "fallbackUrl": "https://www.synthesis.com",
    "company": "Synthesis",
    "model": "Proprietär modell",
    "founded": 2018,
    "hq": "Austin, USA",
    "useCases": [
      "Problemlösning och kritiskt tänkande för barn 6–14 år",
      "Matematisk logik via interaktiva simuleringsspel",
      "Samarbetsövningar i realtid med andra elever",
      "Adaptiva utmaningar som skalas med elevens nivå",
      "Föräldrarapporter om kognitiv utveckling"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 9.1
      },
      {
        "label": "Svenska språkstöd",
        "score": 7
      },
      {
        "label": "Ämnesbredd",
        "score": 7.5
      },
      {
        "label": "Integritet & elevdata",
        "score": 8.6
      },
      {
        "label": "Pris/prestanda",
        "score": 8
      },
      {
        "label": "Användarvänlighet",
        "score": 9.2
      }
    ],
    "tags": [
      "Kritiskt tänkande",
      "Matematik",
      "Barn",
      "Adaptivt lärande"
    ],
    "pros": [
      "Unikt fokus på problemlösning och beslutsfattande snarare än memanpassning",
      "Engagerande spelformat håller barn motiverade utan yttre belöningssystem",
      "Adaptiv svårighetsgrad justeras i realtid under sessionen"
    ],
    "cons": [
      "Begränsad ämnesbredd utanför matematik och logiskt tänkande",
      "Ingen svenska i gränssnittet och inget innehåll anpassat till svenska läroplanen"
    ],
    "offer": {
      "title": "Synthesis Tutor",
      "price": "Gratis (begränsat) · 35 USD/mån",
      "bestFor": "Föräldrar och skolor som vill stärka barns logiska tänkande och matematiska resonemang"
    },
    "label": "",
    "score": 8.3
  },
  "khanmigo": {
    "logo": "bg-violet-600",
    "ctaName": "Khanmigo",
    "fallbackUrl": "https://www.khanmigo.ai",
    "company": "Khan Academy",
    "model": "GPT-4o (anpassad med guardrails)",
    "founded": 2023,
    "hq": "Mountain View, USA",
    "useCases": [
      "Sokratisk AI-handledning som aldrig ger svaret direkt",
      "Lärarhjälp med lektionsplaner och diskussionsfrågor",
      "Kreativt skrivande med AI som medförfattare",
      "Historiska rollspel för att levandegöra samhällskunskap",
      "Föräldraöversikt av elevens konversationer med AI"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 9.6
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.3
      },
      {
        "label": "Ämnesbredd",
        "score": 8.8
      },
      {
        "label": "Integritet & elevdata",
        "score": 9.2
      },
      {
        "label": "Pris/prestanda",
        "score": 8.2
      },
      {
        "label": "Användarvänlighet",
        "score": 8.7
      }
    ],
    "tags": [
      "Sokratisk metod",
      "Lärarverktyg",
      "Etisk AI",
      "Handledning"
    ],
    "pros": [
      "Pedagogiskt genomtänkt sokratisk metod förhindrar passivt svar-surfande",
      "Tydliga dataskyddsregler och föräldratransparens är inbyggda i produkten",
      "Lärarläget är ett av marknadens mest kompletta för att skapa kursinnehåll"
    ],
    "cons": [
      "Kräver prenumeration även för elever, vilket begränsar tillgängligheten i skolor med liten budget",
      "Gränssnittet och handledningsspråket är engelska, svenska saknas"
    ],
    "offer": {
      "title": "Khanmigo för elever & lärare",
      "price": "9 USD/mån (elev) · Gratis för skolor via ansökan",
      "bestFor": "Skolor och lärare som vill erbjuda etisk AI-handledning med inbyggd pedagogisk säkerhet"
    },
    "label": "Redaktionens val",
    "score": 9
  },
  "quizlet-ai": {
    "logo": "bg-rose-500",
    "ctaName": "Quizlet AI",
    "fallbackUrl": "https://quizlet.com",
    "company": "Quizlet",
    "model": "GPT-4 (integrerad)",
    "founded": 2005,
    "hq": "San Francisco, USA",
    "useCases": [
      "Automatisk generering av flash-cards från egna texter",
      "AI-anpassade repetitionssessioner baserade på glömskekurvan",
      "Flervalstest skapade från studiematerial",
      "Samarbetsstudier med delade kortlekar",
      "Förberedelsehjälp inför prov i alla ämnen"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 8.4
      },
      {
        "label": "Svenska språkstöd",
        "score": 8
      },
      {
        "label": "Ämnesbredd",
        "score": 8.7
      },
      {
        "label": "Integritet & elevdata",
        "score": 7.8
      },
      {
        "label": "Pris/prestanda",
        "score": 9
      },
      {
        "label": "Användarvänlighet",
        "score": 9.4
      }
    ],
    "tags": [
      "Flash-cards",
      "Pluggverktyg",
      "Repetition",
      "Samarbete"
    ],
    "pros": [
      "Extremt snabb att komma igång med — klistra in text och få ett komplett studieset på sekunder",
      "Spaced repetition-algoritmen är väldokumenterad och effektiv",
      "Fungerar lika bra för språk, historia, biologi och juridik"
    ],
    "cons": [
      "Gratisversionen är nu kraftigt begränsad och de viktigaste AI-funktionerna kräver Plus",
      "Djupare förklaringar och konceptuell förståelse ligger utanför verktygets räckvidd"
    ],
    "offer": {
      "title": "Quizlet Free / Quizlet Plus",
      "price": "Gratis (begränsat) · Plus 7,99 USD/mån",
      "bestFor": "Elever och studenter som vill effektivisera sin inläsning med AI-genererade studieset och spaced repetition"
    },
    "label": "",
    "score": 8.6
  },
  "socratic": {
    "logo": "bg-amber-500",
    "ctaName": "Socratic",
    "fallbackUrl": "https://socratic.org",
    "company": "Google",
    "model": "Gemini (integrerad)",
    "founded": 2013,
    "hq": "Mountain View, USA",
    "useCases": [
      "Fotografera en uppgift och få steg-för-steg-förklaring",
      "Matematikhjälp med visuella lösningssteg",
      "Naturvetenskap och historieförklaringar på gymnasienivå",
      "Källhänvisningar till fördjupande resurser",
      "Snabb faktakontroll av läroboksinnehåll"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 8.5
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Ämnesbredd",
        "score": 8.6
      },
      {
        "label": "Integritet & elevdata",
        "score": 8.4
      },
      {
        "label": "Pris/prestanda",
        "score": 9.7
      },
      {
        "label": "Användarvänlighet",
        "score": 9.3
      }
    ],
    "tags": [
      "Kamerabaserad",
      "Gratis",
      "Gymnasieelever",
      "Google"
    ],
    "pros": [
      "Helt gratis utan prenumeration eller dolda begränsningar",
      "Kameraingången gör det trivialt enkelt att få hjälp med en specifik uppgift",
      "Googles Gemini ger breda ämneskunskaper och tillförlitliga förklaringar"
    ],
    "cons": [
      "Djupet på förklaringarna är ojämnt och kan vara ytligt i avancerade ämnen",
      "Ingen lärarintegration eller möjlighet att spåra elevframsteg"
    ],
    "offer": {
      "title": "Socratic by Google",
      "price": "Gratis",
      "bestFor": "Gymnasieelever som snabbt behöver en tydlig förklaring till en specifik uppgift eller läroboksfråga"
    },
    "label": "",
    "score": 8.7
  },
  "photomath-ai": {
    "logo": "bg-teal-500",
    "ctaName": "Photomath AI",
    "fallbackUrl": "https://photomath.com",
    "company": "Google (Photomath)",
    "model": "Proprietär OCR + AI",
    "founded": 2014,
    "hq": "Zagreb, Kroatien",
    "useCases": [
      "Fotografera matematikuppgifter och få fullständiga lösningar",
      "Steg-för-steg-förklaringar i algebra, kalkyl och statistik",
      "Grafritning och ekvationsanalys",
      "Orduppgifter tolkade och lösta visuellt",
      "Kontroll av egna uträkningar med felidentifiering"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 8.8
      },
      {
        "label": "Svenska språkstöd",
        "score": 8.2
      },
      {
        "label": "Ämnesbredd",
        "score": 7.2
      },
      {
        "label": "Integritet & elevdata",
        "score": 8
      },
      {
        "label": "Pris/prestanda",
        "score": 9.5
      },
      {
        "label": "Användarvänlighet",
        "score": 9.6
      }
    ],
    "tags": [
      "Matematik",
      "Kamerabaserad",
      "Steg-för-steg",
      "Gymnasienivå"
    ],
    "pros": [
      "Världsledande OCR-teknik för handskriven och tryckt matematik",
      "Förklaringarna är detaljerade och pedagogiska, inte bara slutsvaret",
      "Fungerar offline för grundläggande beräkningar"
    ],
    "cons": [
      "Fokus nästan uteslutande på matematik, inget stöd för andra ämnen",
      "Djupare förklaringar och animerade lösningssteg kräver Plus-prenumeration"
    ],
    "offer": {
      "title": "Photomath Free / Plus",
      "price": "Gratis · Plus 9,99 USD/mån",
      "bestFor": "Grundskole- och gymnasieelever som behöver tydliga steg-för-steg-genomgångar i matematik"
    },
    "label": "",
    "score": 8.6
  },
  "grammarly": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Grammarly",
    "fallbackUrl": "https://www.grammarly.com",
    "company": "Grammarly Inc.",
    "model": "Proprietär GrammarlyGO",
    "founded": 2009,
    "hq": "San Francisco, USA",
    "useCases": [
      "Grammatik- och stavningskontroll i realtid",
      "Stilanpassning av text till akademisk eller formell ton",
      "AI-driven omskrivning och meningsförbättring",
      "Klarhet och läsbarhetsbedömning av uppsatser",
      "Plagiatdetektering i Education-versionen"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 8.7
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.5
      },
      {
        "label": "Ämnesbredd",
        "score": 7.8
      },
      {
        "label": "Integritet & elevdata",
        "score": 8.3
      },
      {
        "label": "Pris/prestanda",
        "score": 8.6
      },
      {
        "label": "Användarvänlighet",
        "score": 9.5
      }
    ],
    "tags": [
      "Skrivhjälp",
      "Engelska",
      "Grammatik",
      "Akademiskt skrivande"
    ],
    "pros": [
      "Sömlös integration med Word, Google Docs och de flesta webbläsare",
      "Återkopplingen på meningsnivå är specifik och förklarar varför en ändring förbättrar texten",
      "Education-versionen ger lärare insikt i elevernas skrivutveckling"
    ],
    "cons": [
      "Fokuserar på engelska, stödet för svenska texter är mycket begränsat och opålitligt",
      "De kraftfullaste omskrivningsfunktionerna kräver Pro-prenumeration"
    ],
    "offer": {
      "title": "Grammarly Free / Pro / Education",
      "price": "Gratis · Pro 12 USD/mån · Education via licens",
      "bestFor": "Studenter och lärare som arbetar med engelskspråkiga texter och vill ha omedelbar och detaljerad skrivåterkoppling"
    },
    "label": "",
    "score": 8.5
  },
  "turnitin-ai": {
    "logo": "bg-cyan-600",
    "ctaName": "Turnitin AI",
    "fallbackUrl": "https://www.turnitin.com",
    "company": "Turnitin LLC",
    "model": "Proprietär detektionsmodell",
    "founded": 1998,
    "hq": "Oakland, USA",
    "useCases": [
      "Plagiatdetektering i inlämnade elevarbeten",
      "AI-genererat innehåll identifieras och markeras",
      "Formativ skrivåterkoppling för studenter",
      "Likhetsrapporter med källhänvisningar",
      "Integration med LMS som Canvas och Schoology"
    ],
    "ratingCriteria": [
      {
        "label": "Pedagogisk kvalitet",
        "score": 8.2
      },
      {
        "label": "Svenska språkstöd",
        "score": 7.8
      },
      {
        "label": "Ämnesbredd",
        "score": 7.5
      },
      {
        "label": "Integritet & elevdata",
        "score": 9.1
      },
      {
        "label": "Pris/prestanda",
        "score": 7.8
      },
      {
        "label": "Användarvänlighet",
        "score": 8.5
      }
    ],
    "tags": [
      "Plagiatdetektering",
      "AI-detektion",
      "Högskolenivå",
      "Institutionslicens"
    ],
    "pros": [
      "Branschstandard för akademisk integritet med dokumenterat hög träffsäkerhet",
      "AI-detektionsrapporten ger procentsats och markerade textpassager",
      "Djup LMS-integration gör arbetsflödet smidigt för lärare"
    ],
    "cons": [
      "Enbart institutionslicens gör verktyget otillgängligt för enskilda lärare och småskolor",
      "Falska positiva identifieringar av AI-genererat innehåll förekommer och kan skapa orättvisa situationer"
    ],
    "offer": {
      "title": "Turnitin Feedback Studio",
      "price": "Institutionslicens — pris på offert",
      "bestFor": "Högskolor och gymnasieskolor som behöver ett tillförlitligt system för att upprätthålla akademisk integritet"
    },
    "label": "",
    "score": 8.2
  }
};
