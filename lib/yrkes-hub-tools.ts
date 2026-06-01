/** Kanoniska yrkes-hub-profiler — deterministiskt regenererade av
 *  scripts/repair-yrkes-lib.ts. YRKES_HUB_KNOWN → HubTemplate KNOWN,
 *  YRKES_HUB_REVIEW_KNOWN → ReviewTemplate REVIEW_KNOWN. */
import type { ReviewProfile } from '@/components/templates/ReviewTemplate';

export const YRKES_HUB_KNOWN = {
  "harvey-ai": {
    "logo": "bg-violet-700",
    "ctaName": "Harvey AI",
    "score": 9.4,
    "fallbackUrl": "https://www.harvey.ai",
    "tagline": "Branschledande domänmodell för stora advokatbyråer — bäst på engelska, växande på svensk juridik.",
    "tags": [
      "Big Law",
      "Enterprise",
      "Domänmodell",
      "M&A"
    ],
    "pros": [
      "Skarp på komplex juridisk argumentation",
      "Stark dokumentförståelse",
      "Snabbväxande modeller"
    ],
    "cons": [
      "Designat för Big Law — dyrt för småbyråer",
      "Engelska först, svenska sekundärt"
    ],
    "offer": {
      "title": "Demo via Harveys sales-team",
      "price": "Enterprise från ~$100k/år",
      "bestFor": "Stora advokatbyråer och inhouse-team på börsbolag"
    },
    "label": "Redaktionens val"
  },
  "lexis-ai": {
    "logo": "bg-red-700",
    "ctaName": "Lexis+ AI",
    "score": 9,
    "fallbackUrl": "https://www.lexisnexis.com/lexis-plus-ai",
    "tagline": "LexisNexis AI-lager ovanpå världens största juridiska databas — bäst för citerbar research.",
    "tags": [
      "Big Database",
      "Citerbar",
      "Research",
      "Lexis"
    ],
    "pros": [
      "Auktoritativ källtäckning",
      "Inbyggd citation-validering",
      "Stark juristworkflow"
    ],
    "cons": [
      "Lexis-licens krävs",
      "Bäst för anglo-rätt; svensk täckning tunnare"
    ],
    "offer": {
      "title": "Demo via Lexis-säljare",
      "price": "Tillägg från ~$200/anv/mån",
      "bestFor": "Advokater som redan jobbar i Lexis"
    },
    "label": "Bäst för research"
  },
  "ironclad-ai": {
    "logo": "bg-indigo-700",
    "ctaName": "Ironclad AI",
    "score": 8.9,
    "fallbackUrl": "https://ironcladapp.com",
    "tagline": "Contract Lifecycle Management (CLM) med AI för stora juridiska avdelningar.",
    "tags": [
      "CLM",
      "Enterprise",
      "Workflows",
      "E-signering"
    ],
    "pros": [
      "Bredast CLM-funktionalitet",
      "Stark integration med Salesforce/Workday",
      "Mogen produkt"
    ],
    "cons": [
      "Enterprise-pris",
      "Implementation tar veckor till månader"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom — typiskt $25k+/år",
      "bestFor": "Mid-market till enterprise med högt avtalsflöde"
    },
    "label": "Bäst CLM enterprise"
  },
  "casetext": {
    "logo": "bg-blue-700",
    "ctaName": "Casetext",
    "score": 8.8,
    "fallbackUrl": "https://casetext.com",
    "tagline": "CoCounsel-assistenten från Casetext — köptes upp av Thomson Reuters och integreras nu med Westlaw.",
    "tags": [
      "CoCounsel",
      "Thomson Reuters",
      "Westlaw",
      "US case law"
    ],
    "pros": [
      "Beprövad GPT-4-baserad workflow",
      "Tight integration med Westlaw",
      "Stor user base"
    ],
    "cons": [
      "Fokus på US-rätt",
      "Svensk täckning saknas i praktiken"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Från $250/anv/mån",
      "bestFor": "US-byråer och inhouse på multinationella bolag"
    },
    "label": "Bäst för US-rätt"
  },
  "spellbook": {
    "logo": "bg-amber-700",
    "ctaName": "Spellbook",
    "score": 8.7,
    "fallbackUrl": "https://www.spellbook.legal",
    "tagline": "Word-tilläggssprängd AI för transactional lawyers — drafting och review direkt i dokumentet.",
    "tags": [
      "Word add-in",
      "Drafting",
      "Transactional",
      "Commercial"
    ],
    "pros": [
      "Lever i juristernas faktiska verktyg (Word)",
      "Inga separat-app att lära sig",
      "Solid drafting"
    ],
    "cons": [
      "Bara Word-arbete",
      "Mindre stark utanför kommersiella avtal"
    ],
    "offer": {
      "title": "Gratis trial",
      "price": "Från $129/anv/mån",
      "bestFor": "Transactional lawyers och mid-size firms"
    },
    "label": "Bäst i Word"
  },
  "luminance": {
    "logo": "bg-rose-700",
    "ctaName": "Luminance",
    "score": 8.6,
    "fallbackUrl": "https://www.luminance.com",
    "tagline": "AI för granskning av avtal och due diligence — Cambridge-baserat med stark europeisk närvaro.",
    "tags": [
      "80+ språk",
      "On-prem",
      "M&A",
      "DD"
    ],
    "pros": [
      "Bästa för cross-border DD",
      "Privacy-läge med on-prem möjligt",
      "Bred språkstöd"
    ],
    "cons": [
      "Brant inlärningskurva",
      "Pris kräver volym"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~£30k/år",
      "bestFor": "M&A-team och multinationella inhouse-funktioner"
    },
    "label": "Bäst för DD cross-border"
  },
  "contractpodai": {
    "logo": "bg-sky-700",
    "ctaName": "ContractPodAi",
    "score": 8.5,
    "fallbackUrl": "https://contractpodai.com",
    "tagline": "CLM-plattform med fokus på Leah AI-assistenten — populär hos UK/EU-team.",
    "tags": [
      "CLM",
      "EU/UK",
      "GDPR",
      "Word"
    ],
    "pros": [
      "EU-baserat alternativ till Ironclad",
      "Bra Word-flöde",
      "GDPR-fokus"
    ],
    "cons": [
      "Mindre brett ekosystem",
      "UI-modernhet efter konkurrenter"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$30k/år",
      "bestFor": "EU/UK-bolag och europeiska juridik-avdelningar"
    },
    "label": "Bäst för EU/UK"
  },
  "kira-systems": {
    "logo": "bg-fuchsia-700",
    "ctaName": "Kira Systems",
    "score": 8.4,
    "fallbackUrl": "https://kirasystems.com",
    "tagline": "AI för avtalsanalys, akviresad av Litera och nu integrerad i deras juristsvit.",
    "tags": [
      "Litera",
      "Smart fields",
      "M&A",
      "Real estate"
    ],
    "pros": [
      "Stort bibliotek av extraktionsmodeller",
      "Mogen produkt",
      "God Litera-integration"
    ],
    "cons": [
      "Enterprise-onboarding",
      "UI på äldre sidan"
    ],
    "offer": {
      "title": "Demo via Litera-sales",
      "price": "Från ~$50k/år",
      "bestFor": "M&A-team som redan kör Litera-svit"
    },
    "label": "Bäst för Litera-stack"
  },
  "ebrevia": {
    "logo": "bg-zinc-700",
    "ctaName": "eBrevia",
    "score": 7.9,
    "fallbackUrl": "https://ebrevia.com",
    "tagline": "Extraktion av nyckelvillkor från stora avtalsportföljer — populärt under DD och regulatory exercises.",
    "tags": [
      "Extraktion",
      "Finans-DD",
      "Donnelley",
      "Audit"
    ],
    "pros": [
      "Beprövad i finans-due diligence",
      "Snabb pipeline",
      "God audit-trail"
    ],
    "cons": [
      "Mindre AI-modernt än Luminance",
      "Bäst i finans/M&A-context"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom enterprise",
      "bestFor": "Finansiella DD-team och Big4 advisory"
    },
    "label": "Bäst för finans-DD"
  },
  "legalzoom-ai": {
    "logo": "bg-emerald-700",
    "ctaName": "LegalZoom AI",
    "score": 7.6,
    "fallbackUrl": "https://www.legalzoom.com",
    "tagline": "AI-lager ovanpå LegalZooms DIY-juridiktjänst — för småföretagare som vill ta sig själv genom enkla ärenden.",
    "tags": [
      "DIY",
      "Småföretag",
      "US-jurisdiction",
      "Pay-per-use"
    ],
    "pros": [
      "Tillgängligt för icke-jurister",
      "Snabb start för småföretagare",
      "Pris-effektivt för enkla ärenden"
    ],
    "cons": [
      "Ej för komplexa frågor",
      "Bäst för US-jurisdiction"
    ],
    "offer": {
      "title": "Pay-per-document eller månadsabonnemang",
      "price": "Från ~$50/dokument",
      "bestFor": "Småföretagare och solopreneurer i USA"
    },
    "label": "Bäst för DIY"
  },
  "intercom-ai": {
    "logo": "bg-indigo-700",
    "ctaName": "Intercom AI",
    "score": 9.3,
    "fallbackUrl": "https://www.intercom.com",
    "tagline": "Fin AI Agent löser ärenden helt automatiskt — branschledande på faktisk ärendelösning.",
    "tags": [
      "Fin AI",
      "Resolution-based",
      "Messaging",
      "Modern"
    ],
    "pros": [
      "Marknadsledande på autonom resolution",
      "Modern produkt",
      "Stark messaging-DNA"
    ],
    "cons": [
      "Pris hoppar snabbt vid skala",
      "AI-tier separat från base"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Från $39/seat + Fin $0.99/resolution",
      "bestFor": "SaaS-bolag och scale-ups med modernt support-tänk"
    },
    "label": "Redaktionens val"
  },
  "zendesk-ai": {
    "logo": "bg-emerald-700",
    "ctaName": "Zendesk AI",
    "score": 9,
    "fallbackUrl": "https://www.zendesk.com",
    "tagline": "AI-funktioner inbyggda i ärendehanteringen som driver hälften av världens helpdesks.",
    "tags": [
      "Omnichannel",
      "Helpdesk",
      "Branschstandard",
      "Add-on AI"
    ],
    "pros": [
      "Branschstandard helpdesk",
      "Bred integrationsmarknad",
      "Mogen AI på toppen av befintliga flöden"
    ],
    "cons": [
      "AI är tilläggsmodul, inte inbyggt",
      "Stora team får snabbt premium-prislapp"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Suite Team $55 + AI $50/agent/mån",
      "bestFor": "Etablerade kundservice-team med Zendesk redan"
    },
    "label": "Branschstandard"
  },
  "salesforce-einstein": {
    "logo": "bg-blue-600",
    "ctaName": "Salesforce Einstein",
    "score": 8.7,
    "fallbackUrl": "https://www.salesforce.com/products/einstein-ai-solutions",
    "tagline": "Salesforce Einstein och Agentforce — AI-lagret över världens största CRM, nu med autonoma agenter.",
    "tags": [
      "Einstein",
      "Agentforce",
      "Salesforce",
      "Trust Layer"
    ],
    "pros": [
      "Djup Salesforce-integration",
      "Stark säkerhet (Trust Layer)",
      "Autonoma agenter på väg"
    ],
    "cons": [
      "Kräver Salesforce-licens",
      "Komplext om man inte redan kör Salesforce"
    ],
    "offer": {
      "title": "Inkluderad i högre Service Cloud-tiers",
      "price": "Från $500/anv/mån (Service)",
      "bestFor": "Salesforce-kunder med Service Cloud"
    },
    "label": "Bäst för Salesforce-stack"
  },
  "freshdesk-ai": {
    "logo": "bg-amber-600",
    "ctaName": "Freshdesk AI",
    "score": 8.6,
    "fallbackUrl": "https://www.freshworks.com/freshdesk",
    "tagline": "Freshworks helpdesk med Freddy AI — bra prisvärde mot Zendesk på mid-market.",
    "tags": [
      "Freddy AI",
      "Mid-market",
      "Affordable",
      "Omnichannel"
    ],
    "pros": [
      "Konkurrenskraftigt pris",
      "Snabb implementation",
      "Snyggt UI"
    ],
    "cons": [
      "Mindre community än Zendesk",
      "Avancerad routing kräver Enterprise"
    ],
    "offer": {
      "title": "21 dagar trial",
      "price": "Growth $15/agent/mån",
      "bestFor": "Mid-market som vill ha Zendesk-funktionalitet billigare"
    },
    "label": "Bästa pris-prestanda"
  },
  "aisera": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Aisera",
    "score": 8.5,
    "fallbackUrl": "https://aisera.com",
    "tagline": "AI-service desk för IT- och HR-support i stora företag — fokus på autonom internsupport.",
    "tags": [
      "Internsupport",
      "ServiceNow",
      "IT/HR",
      "Enterprise"
    ],
    "pros": [
      "Stark inom intern service desk",
      "God ServiceNow-integration",
      "Enterprise-säkerhet"
    ],
    "cons": [
      "Premium-prislapp",
      "Bäst för stora företag"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom enterprise",
      "bestFor": "Stora företag med IT/HR helpdesk-behov"
    },
    "label": "Bäst intern service desk"
  },
  "hubspot-ai": {
    "logo": "bg-orange-700",
    "ctaName": "HubSpot AI",
    "score": 8.5,
    "fallbackUrl": "https://www.hubspot.com",
    "tagline": "Breeze AI över HubSpots Service Hub — bäst för SMB som redan kör HubSpot CRM.",
    "tags": [
      "Breeze",
      "Service Hub",
      "SMB",
      "CRM-integration"
    ],
    "pros": [
      "Bra för SMB som redan kör HubSpot",
      "AI ingår i högre tiers",
      "Smidigt över sälj/marknad/service"
    ],
    "cons": [
      "Bäst när du redan kör HubSpot",
      "Avancerad routing saknas mot Zendesk"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Service Hub Starter $20/mån",
      "bestFor": "SMB med HubSpot-stack"
    },
    "label": "Bäst för HubSpot-stack"
  },
  "forethought": {
    "logo": "bg-rose-600",
    "ctaName": "Forethought",
    "score": 8.4,
    "fallbackUrl": "https://forethought.ai",
    "tagline": "AI-first kundservice-plattform — fokus på autonom resolution och ärendeprediktion.",
    "tags": [
      "SupportGPT",
      "Autonom",
      "Zendesk-tillägg",
      "Prediktion"
    ],
    "pros": [
      "Stark autonom resolution",
      "Smart prediktion",
      "Bra Zendesk-tillägg"
    ],
    "cons": [
      "Smalt mid-market segment",
      "Mindre känt utanför Bay Area"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$30k/år",
      "bestFor": "Modernt mid-market support-team som vill toppa Zendesk med AI"
    },
    "label": "Bäst Zendesk-toppning"
  },
  "tidio-2": {
    "logo": "bg-sky-600",
    "ctaName": "Tidio",
    "score": 8.2,
    "fallbackUrl": "https://www.tidio.com",
    "tagline": "Lyro AI och chatbot-builder för småföretag — bäst för Shopify och e-handel.",
    "tags": [
      "Lyro AI",
      "Shopify",
      "SMB",
      "E-handel"
    ],
    "pros": [
      "Bäst för småhandlare",
      "Snabb start",
      "Generös gratisversion"
    ],
    "cons": [
      "Smalt för enterprise-volym",
      "Färre integrationer än Zendesk"
    ],
    "offer": {
      "title": "7 dagar premium-trial + free-tier",
      "price": "Free / Starter $29/mån",
      "bestFor": "E-handlare på Shopify/WooCommerce"
    },
    "label": "Bäst för småhandel"
  },
  "drift": {
    "logo": "bg-violet-600",
    "ctaName": "Drift",
    "score": 8,
    "fallbackUrl": "https://www.drift.com",
    "tagline": "Conversational marketing-bot köpt av Salesloft — fokus är på leads, inte renodlad support.",
    "tags": [
      "Conversational marketing",
      "B2B",
      "Leadgen",
      "Salesloft"
    ],
    "pros": [
      "Bäst för B2B-leadgen via chat",
      "God account-routing",
      "Conversational marketing-pionjär"
    ],
    "cons": [
      "Inte renodlad support",
      "Funkar bäst i sälj-tunga flöden"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$2500/mån",
      "bestFor": "B2B-säljteam med inbound-fokus"
    },
    "label": "Bäst för B2B-leadgen"
  },
  "chatbot-com": {
    "logo": "bg-teal-700",
    "ctaName": "ChatBot.com",
    "score": 7.8,
    "fallbackUrl": "https://www.chatbot.com",
    "tagline": "No-code chatbot builder från LiveChat-koncernen — bygg flöden visuellt utan att skriva kod.",
    "tags": [
      "No-code",
      "Flow builder",
      "LiveChat",
      "Templates"
    ],
    "pros": [
      "Inga utvecklare behövs",
      "Bra mall-bibliotek",
      "Snabb implementation"
    ],
    "cons": [
      "Mindre AI-driven än Tidio Lyro",
      "Behöver LiveChat för full kraft"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Starter $52/mån",
      "bestFor": "SMB som vill ha visuell flow-builder"
    },
    "label": "Bäst no-code"
  },
  "workday-ai": {
    "logo": "bg-orange-700",
    "ctaName": "Workday AI",
    "score": 9,
    "fallbackUrl": "https://www.workday.com",
    "tagline": "Workdays HCM-plattform med inbyggd AI-rekrytering — branschstandard för stora företag.",
    "tags": [
      "Enterprise",
      "HCM",
      "Skills Cloud",
      "Recruiting Agent"
    ],
    "pros": [
      "Branschstandard för stora företag",
      "AI fully integrated",
      "Stark compliance"
    ],
    "cons": [
      "Lågfart för ändringar",
      "Enterprise-pris"
    ],
    "offer": {
      "title": "Demo via Workday-sales",
      "price": "Från ~$30/anställd/år",
      "bestFor": "Företag med 1000+ anställda som redan kör Workday"
    },
    "label": "Branschstandard enterprise"
  },
  "eightfold-ai": {
    "logo": "bg-indigo-700",
    "ctaName": "Eightfold AI",
    "score": 9,
    "fallbackUrl": "https://eightfold.ai",
    "tagline": "Talent Intelligence Platform med djup AI — bäst-i-klassen på skills-matching och intern rörlighet.",
    "tags": [
      "Talent Intelligence",
      "Deep learning",
      "Internal mobility",
      "Skills"
    ],
    "pros": [
      "Marknadens djupaste AI-modell",
      "Stark internal mobility",
      "Branschspecifika modeller"
    ],
    "cons": [
      "Enterprise-pris",
      "Implementation kräver konsult"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom enterprise",
      "bestFor": "Stora företag med komplexa skills-pipelines"
    },
    "label": "Djupast AI"
  },
  "greenhouse-ai": {
    "logo": "bg-green-700",
    "ctaName": "Greenhouse AI",
    "score": 8.9,
    "fallbackUrl": "https://www.greenhouse.com",
    "tagline": "Greenhouse ATS med AI-lager — favorit hos tech-bolag och scale-ups.",
    "tags": [
      "ATS",
      "Tech-scale-ups",
      "Strukturerat",
      "Modern UX"
    ],
    "pros": [
      "Branschledande ATS",
      "Bra strukturerad rekryteringsprocess",
      "Modern UX"
    ],
    "cons": [
      "AI är yngre än ATS-stommen",
      "Enterprise-pris"
    ],
    "offer": {
      "title": "Demo via Greenhouse-sales",
      "price": "Från ~$5k/mån",
      "bestFor": "Tech-scale-ups och moderna HR-team"
    },
    "label": "Bäst ATS för tech"
  },
  "paradox": {
    "logo": "bg-pink-700",
    "ctaName": "Paradox",
    "score": 8.7,
    "fallbackUrl": "https://www.paradox.ai",
    "tagline": "Olivia-conversationsbot för volym-rekrytering — McDonalds och stora retail-team litar på den.",
    "tags": [
      "Olivia",
      "SMS",
      "QSR",
      "Retail"
    ],
    "pros": [
      "Bäst för retail/QSR-volym",
      "Stark scheduling-automation",
      "Mobil-first"
    ],
    "cons": [
      "Mindre relevant för senior/profession-roller",
      "Specialiserat på volym"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom från ~$5k/mån",
      "bestFor": "Retail, QSR, manufacturing och annan volym-rekrytering"
    },
    "label": "Bäst för volym"
  },
  "beamery": {
    "logo": "bg-violet-700",
    "ctaName": "Beamery",
    "score": 8.6,
    "fallbackUrl": "https://www.beamery.com",
    "tagline": "Talent Lifecycle Management-plattform med skills-AI — populärast hos stora multinationella företag.",
    "tags": [
      "Talent Cloud",
      "Skills",
      "Europe",
      "Multinationals"
    ],
    "pros": [
      "Bred talent lifecycle-täckning",
      "Skills-baserad approach",
      "EU-fokus"
    ],
    "cons": [
      "Enterprise-pris",
      "Implementation kräver konsult"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$50k/år",
      "bestFor": "Multinationella företag med stor talent pool"
    },
    "label": "Bäst multinationellt"
  },
  "hirevue": {
    "logo": "bg-emerald-600",
    "ctaName": "HireVue",
    "score": 8.5,
    "fallbackUrl": "https://www.hirevue.com",
    "tagline": "AI-driven video-intervju och assessment — pionjär inom on-demand-interviews.",
    "tags": [
      "Videointervju",
      "Volym",
      "Assessment",
      "On-demand"
    ],
    "pros": [
      "Skalbar screening",
      "Bra för volym-rekrytering",
      "Mogen produkt"
    ],
    "cons": [
      "Etikdebatten kring AI-analys",
      "Mindre relevant för senior-roller"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$25k/år",
      "bestFor": "Volym-rekrytering (consulting, banker, retail-management)"
    },
    "label": "Bäst videointervju"
  },
  "seekout": {
    "logo": "bg-rose-700",
    "ctaName": "SeekOut",
    "score": 8.5,
    "fallbackUrl": "https://seekout.com",
    "tagline": "Talent search-motor med AI för att hitta nålar i höstacken — bäst för teknik- och sjukvårdsrekrytering.",
    "tags": [
      "Talent search",
      "Tech",
      "Healthcare",
      "Diversity"
    ],
    "pros": [
      "Bästa kandidat-databasen",
      "Skarp på tech/sjukvård",
      "Diversity-funktioner inbyggt"
    ],
    "cons": [
      "Search-only (ej ATS)",
      "Premium-pris"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$1k/seat/mån",
      "bestFor": "Tech- och sjukvårds-rekryterare med svår-att-hitta roller"
    },
    "label": "Bäst tech/sjukvård search"
  },
  "lever-ai": {
    "logo": "bg-amber-700",
    "ctaName": "Lever AI",
    "score": 8.4,
    "fallbackUrl": "https://www.lever.co",
    "tagline": "Lever ATS + CRM med AI-funktioner — fokus på outbound-sourcing och nurture.",
    "tags": [
      "ATS+CRM",
      "Sourcing",
      "Outbound",
      "Nurture"
    ],
    "pros": [
      "Stark sourcing-funktionalitet",
      "Bra för outbound-tunga team",
      "Solid talent CRM"
    ],
    "cons": [
      "Mindre community än Greenhouse",
      "AI-features yngre"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$4k/mån",
      "bestFor": "Bolag med stora outbound-sourcing-pipelines"
    },
    "label": "Bäst för sourcing"
  },
  "pymetrics": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Pymetrics",
    "score": 8,
    "fallbackUrl": "https://www.harver.com",
    "tagline": "Neurovetenskapsbaserade game-assessments för bias-reducerad screening — nu del av Harver.",
    "tags": [
      "Neuroscience",
      "Bias-reduktion",
      "Fairness",
      "Game-based"
    ],
    "pros": [
      "Vetenskapligt förankrad",
      "Stark bias-reduktion",
      "Bra för att hitta otraditionella kandidater"
    ],
    "cons": [
      "Smalt fokus (assessment, ej ATS)",
      "Kräver volym för att löna sig"
    ],
    "offer": {
      "title": "Demo via Harver-sales",
      "price": "Från ~$15k/år",
      "bestFor": "Stora rekryteringsbolag med diversitetsmål"
    },
    "label": "Bäst för bias-reduktion"
  },
  "fetcher": {
    "logo": "bg-cyan-700",
    "ctaName": "Fetcher",
    "score": 8,
    "fallbackUrl": "https://fetcher.ai",
    "tagline": "Outbound-sourcing-AI som hittar och engagerar passiva kandidater åt dig automatiskt.",
    "tags": [
      "Outbound",
      "Sourcing",
      "Passive candidates",
      "Diversity"
    ],
    "pros": [
      "Snabbar upp passiv sourcing",
      "Bra för småteam",
      "Tydlig diversity-funktion"
    ],
    "cons": [
      "Bara outbound-sourcing (ej ATS)",
      "Inte för executive-rekrytering"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Pro $549/mån",
      "bestFor": "Småteam som behöver volym på passiv kandidat-outreach"
    },
    "label": "Bäst passiv sourcing"
  }
};

export const YRKES_HUB_REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = {
  "harvey-ai": {
    "logo": "bg-violet-700",
    "ctaName": "Harvey AI",
    "score": 9.4,
    "fallbackUrl": "https://www.harvey.ai",
    "company": "Harvey",
    "model": "Harvey AI plattform",
    "founded": 2022,
    "hq": "San Francisco, USA",
    "useCases": [
      "Avtalsgranskning",
      "Due diligence",
      "Regulatory research",
      "Litigation-strategi",
      "Drafting"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 9.4
      },
      {
        "label": "Playbook-anpassning",
        "score": 9.3
      },
      {
        "label": "Risk-flagging",
        "score": 9.2
      },
      {
        "label": "Pris / prestanda",
        "score": 9.1
      },
      {
        "label": "Integrationer",
        "score": 9
      },
      {
        "label": "Svensk juridik",
        "score": 9.8
      }
    ],
    "tags": [
      "Big Law",
      "Enterprise",
      "Domänmodell",
      "M&A"
    ],
    "pros": [
      "Skarp på komplex juridisk argumentation",
      "Stark dokumentförståelse",
      "Snabbväxande modeller"
    ],
    "cons": [
      "Designat för Big Law — dyrt för småbyråer",
      "Engelska först, svenska sekundärt"
    ],
    "offer": {
      "title": "Demo via Harveys sales-team",
      "price": "Enterprise från ~$100k/år",
      "bestFor": "Stora advokatbyråer och inhouse-team på börsbolag"
    },
    "label": "Redaktionens val"
  },
  "lexis-ai": {
    "logo": "bg-red-700",
    "ctaName": "Lexis+ AI",
    "score": 9,
    "fallbackUrl": "https://www.lexisnexis.com/lexis-plus-ai",
    "company": "LexisNexis",
    "model": "Lexis+ AI plattform",
    "founded": 1973,
    "hq": "New York, USA",
    "useCases": [
      "Rättsutredningar",
      "Citation-validering",
      "Cross-jurisdictional",
      "Brief-drafting",
      "Compliance-research"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 9
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.9
      },
      {
        "label": "Risk-flagging",
        "score": 8.8
      },
      {
        "label": "Pris / prestanda",
        "score": 8.7
      },
      {
        "label": "Integrationer",
        "score": 8.6
      },
      {
        "label": "Svensk juridik",
        "score": 9.4
      }
    ],
    "tags": [
      "Big Database",
      "Citerbar",
      "Research",
      "Lexis"
    ],
    "pros": [
      "Auktoritativ källtäckning",
      "Inbyggd citation-validering",
      "Stark juristworkflow"
    ],
    "cons": [
      "Lexis-licens krävs",
      "Bäst för anglo-rätt; svensk täckning tunnare"
    ],
    "offer": {
      "title": "Demo via Lexis-säljare",
      "price": "Tillägg från ~$200/anv/mån",
      "bestFor": "Advokater som redan jobbar i Lexis"
    },
    "label": "Bäst för research"
  },
  "ironclad-ai": {
    "logo": "bg-indigo-700",
    "ctaName": "Ironclad AI",
    "score": 8.9,
    "fallbackUrl": "https://ironcladapp.com",
    "company": "Ironclad",
    "model": "Ironclad AI plattform",
    "founded": 2014,
    "hq": "San Francisco, USA",
    "useCases": [
      "Contract lifecycle",
      "Bulk-review",
      "Approval-workflows",
      "Legacy-import",
      "Compliance-tracking"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 8.9
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.8
      },
      {
        "label": "Risk-flagging",
        "score": 8.7
      },
      {
        "label": "Pris / prestanda",
        "score": 8.6
      },
      {
        "label": "Integrationer",
        "score": 8.5
      },
      {
        "label": "Svensk juridik",
        "score": 9.3
      }
    ],
    "tags": [
      "CLM",
      "Enterprise",
      "Workflows",
      "E-signering"
    ],
    "pros": [
      "Bredast CLM-funktionalitet",
      "Stark integration med Salesforce/Workday",
      "Mogen produkt"
    ],
    "cons": [
      "Enterprise-pris",
      "Implementation tar veckor till månader"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom — typiskt $25k+/år",
      "bestFor": "Mid-market till enterprise med högt avtalsflöde"
    },
    "label": "Bäst CLM enterprise"
  },
  "casetext": {
    "logo": "bg-blue-700",
    "ctaName": "Casetext",
    "score": 8.8,
    "fallbackUrl": "https://casetext.com",
    "company": "Thomson Reuters (Casetext)",
    "model": "Casetext plattform",
    "founded": 2013,
    "hq": "San Francisco, USA",
    "useCases": [
      "Document review",
      "Deposition prep",
      "Memo drafting",
      "Case research",
      "Contract analysis"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 8.8
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.7
      },
      {
        "label": "Risk-flagging",
        "score": 8.6
      },
      {
        "label": "Pris / prestanda",
        "score": 8.5
      },
      {
        "label": "Integrationer",
        "score": 8.4
      },
      {
        "label": "Svensk juridik",
        "score": 9.2
      }
    ],
    "tags": [
      "CoCounsel",
      "Thomson Reuters",
      "Westlaw",
      "US case law"
    ],
    "pros": [
      "Beprövad GPT-4-baserad workflow",
      "Tight integration med Westlaw",
      "Stor user base"
    ],
    "cons": [
      "Fokus på US-rätt",
      "Svensk täckning saknas i praktiken"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Från $250/anv/mån",
      "bestFor": "US-byråer och inhouse på multinationella bolag"
    },
    "label": "Bäst för US-rätt"
  },
  "spellbook": {
    "logo": "bg-amber-700",
    "ctaName": "Spellbook",
    "score": 8.7,
    "fallbackUrl": "https://www.spellbook.legal",
    "company": "Rally Legal",
    "model": "Spellbook plattform",
    "founded": 2018,
    "hq": "St. John's, Kanada",
    "useCases": [
      "Avtalsdrafting",
      "Redlining",
      "Clause-library",
      "Negotiation-stöd",
      "NDA-flöden"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 8.7
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.6
      },
      {
        "label": "Risk-flagging",
        "score": 8.5
      },
      {
        "label": "Pris / prestanda",
        "score": 8.4
      },
      {
        "label": "Integrationer",
        "score": 8.3
      },
      {
        "label": "Svensk juridik",
        "score": 9.1
      }
    ],
    "tags": [
      "Word add-in",
      "Drafting",
      "Transactional",
      "Commercial"
    ],
    "pros": [
      "Lever i juristernas faktiska verktyg (Word)",
      "Inga separat-app att lära sig",
      "Solid drafting"
    ],
    "cons": [
      "Bara Word-arbete",
      "Mindre stark utanför kommersiella avtal"
    ],
    "offer": {
      "title": "Gratis trial",
      "price": "Från $129/anv/mån",
      "bestFor": "Transactional lawyers och mid-size firms"
    },
    "label": "Bäst i Word"
  },
  "luminance": {
    "logo": "bg-rose-700",
    "ctaName": "Luminance",
    "score": 8.6,
    "fallbackUrl": "https://www.luminance.com",
    "company": "Luminance",
    "model": "Luminance plattform",
    "founded": 2015,
    "hq": "Cambridge, UK",
    "useCases": [
      "Due diligence",
      "Cross-border contract review",
      "Risk-detection",
      "Regulatory analysis",
      "M&A-pipeline"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 8.6
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.5
      },
      {
        "label": "Risk-flagging",
        "score": 8.4
      },
      {
        "label": "Pris / prestanda",
        "score": 8.3
      },
      {
        "label": "Integrationer",
        "score": 8.2
      },
      {
        "label": "Svensk juridik",
        "score": 9
      }
    ],
    "tags": [
      "80+ språk",
      "On-prem",
      "M&A",
      "DD"
    ],
    "pros": [
      "Bästa för cross-border DD",
      "Privacy-läge med on-prem möjligt",
      "Bred språkstöd"
    ],
    "cons": [
      "Brant inlärningskurva",
      "Pris kräver volym"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~£30k/år",
      "bestFor": "M&A-team och multinationella inhouse-funktioner"
    },
    "label": "Bäst för DD cross-border"
  },
  "contractpodai": {
    "logo": "bg-sky-700",
    "ctaName": "ContractPodAi",
    "score": 8.5,
    "fallbackUrl": "https://contractpodai.com",
    "company": "ContractPodAi",
    "model": "ContractPodAi plattform",
    "founded": 2012,
    "hq": "New York / London",
    "useCases": [
      "Contract lifecycle",
      "Approval-workflows",
      "EU-compliance",
      "Risk-flagging",
      "Vendor-management"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 8.5
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.4
      },
      {
        "label": "Risk-flagging",
        "score": 8.3
      },
      {
        "label": "Pris / prestanda",
        "score": 8.2
      },
      {
        "label": "Integrationer",
        "score": 8.1
      },
      {
        "label": "Svensk juridik",
        "score": 8.9
      }
    ],
    "tags": [
      "CLM",
      "EU/UK",
      "GDPR",
      "Word"
    ],
    "pros": [
      "EU-baserat alternativ till Ironclad",
      "Bra Word-flöde",
      "GDPR-fokus"
    ],
    "cons": [
      "Mindre brett ekosystem",
      "UI-modernhet efter konkurrenter"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$30k/år",
      "bestFor": "EU/UK-bolag och europeiska juridik-avdelningar"
    },
    "label": "Bäst för EU/UK"
  },
  "kira-systems": {
    "logo": "bg-fuchsia-700",
    "ctaName": "Kira Systems",
    "score": 8.4,
    "fallbackUrl": "https://kirasystems.com",
    "company": "Litera (Kira)",
    "model": "Kira Systems plattform",
    "founded": 2011,
    "hq": "Toronto, Kanada",
    "useCases": [
      "DD-extraktion",
      "Lease-abstraction",
      "Contract review",
      "Compliance audits",
      "M&A pipeline"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 8.4
      },
      {
        "label": "Playbook-anpassning",
        "score": 8.3
      },
      {
        "label": "Risk-flagging",
        "score": 8.2
      },
      {
        "label": "Pris / prestanda",
        "score": 8.1
      },
      {
        "label": "Integrationer",
        "score": 8
      },
      {
        "label": "Svensk juridik",
        "score": 8.8
      }
    ],
    "tags": [
      "Litera",
      "Smart fields",
      "M&A",
      "Real estate"
    ],
    "pros": [
      "Stort bibliotek av extraktionsmodeller",
      "Mogen produkt",
      "God Litera-integration"
    ],
    "cons": [
      "Enterprise-onboarding",
      "UI på äldre sidan"
    ],
    "offer": {
      "title": "Demo via Litera-sales",
      "price": "Från ~$50k/år",
      "bestFor": "M&A-team som redan kör Litera-svit"
    },
    "label": "Bäst för Litera-stack"
  },
  "ebrevia": {
    "logo": "bg-zinc-700",
    "ctaName": "eBrevia",
    "score": 7.9,
    "fallbackUrl": "https://ebrevia.com",
    "company": "Donnelley Financial (eBrevia)",
    "model": "eBrevia plattform",
    "founded": 2012,
    "hq": "Stamford, USA",
    "useCases": [
      "DD-extraktion",
      "Lease-review",
      "Regulatory exercises",
      "Contract abstraction",
      "M&A pipeline"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 7.9
      },
      {
        "label": "Playbook-anpassning",
        "score": 7.8
      },
      {
        "label": "Risk-flagging",
        "score": 7.7
      },
      {
        "label": "Pris / prestanda",
        "score": 7.6
      },
      {
        "label": "Integrationer",
        "score": 7.5
      },
      {
        "label": "Svensk juridik",
        "score": 8.3
      }
    ],
    "tags": [
      "Extraktion",
      "Finans-DD",
      "Donnelley",
      "Audit"
    ],
    "pros": [
      "Beprövad i finans-due diligence",
      "Snabb pipeline",
      "God audit-trail"
    ],
    "cons": [
      "Mindre AI-modernt än Luminance",
      "Bäst i finans/M&A-context"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom enterprise",
      "bestFor": "Finansiella DD-team och Big4 advisory"
    },
    "label": "Bäst för finans-DD"
  },
  "legalzoom-ai": {
    "logo": "bg-emerald-700",
    "ctaName": "LegalZoom AI",
    "score": 7.6,
    "fallbackUrl": "https://www.legalzoom.com",
    "company": "LegalZoom",
    "model": "LegalZoom AI plattform",
    "founded": 2001,
    "hq": "Glendale, USA",
    "useCases": [
      "Bolagsregistrering",
      "NDA-mallar",
      "Anställningsavtal-mallar",
      "Trademark-ansökan",
      "Wills"
    ],
    "ratingCriteria": [
      {
        "label": "Granskningskvalitet",
        "score": 7.6
      },
      {
        "label": "Playbook-anpassning",
        "score": 7.5
      },
      {
        "label": "Risk-flagging",
        "score": 7.4
      },
      {
        "label": "Pris / prestanda",
        "score": 7.3
      },
      {
        "label": "Integrationer",
        "score": 7.2
      },
      {
        "label": "Svensk juridik",
        "score": 8
      }
    ],
    "tags": [
      "DIY",
      "Småföretag",
      "US-jurisdiction",
      "Pay-per-use"
    ],
    "pros": [
      "Tillgängligt för icke-jurister",
      "Snabb start för småföretagare",
      "Pris-effektivt för enkla ärenden"
    ],
    "cons": [
      "Ej för komplexa frågor",
      "Bäst för US-jurisdiction"
    ],
    "offer": {
      "title": "Pay-per-document eller månadsabonnemang",
      "price": "Från ~$50/dokument",
      "bestFor": "Småföretagare och solopreneurer i USA"
    },
    "label": "Bäst för DIY"
  },
  "intercom-ai": {
    "logo": "bg-indigo-700",
    "ctaName": "Intercom AI",
    "score": 9.3,
    "fallbackUrl": "https://www.intercom.com",
    "company": "Intercom",
    "model": "Intercom AI plattform",
    "founded": 2011,
    "hq": "San Francisco / Dublin",
    "useCases": [
      "Autonom ärendelösning",
      "Tier-1 support",
      "Outbound retention",
      "Onboarding-flöden",
      "Proaktiv hjälp"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 9.3
      },
      {
        "label": "Integrationer",
        "score": 9.2
      },
      {
        "label": "Eskaleringslogik",
        "score": 9.1
      },
      {
        "label": "Svenska",
        "score": 9
      },
      {
        "label": "Pris / prestanda",
        "score": 8.9
      },
      {
        "label": "Analytik",
        "score": 9.7
      }
    ],
    "tags": [
      "Fin AI",
      "Resolution-based",
      "Messaging",
      "Modern"
    ],
    "pros": [
      "Marknadsledande på autonom resolution",
      "Modern produkt",
      "Stark messaging-DNA"
    ],
    "cons": [
      "Pris hoppar snabbt vid skala",
      "AI-tier separat från base"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Från $39/seat + Fin $0.99/resolution",
      "bestFor": "SaaS-bolag och scale-ups med modernt support-tänk"
    },
    "label": "Redaktionens val"
  },
  "zendesk-ai": {
    "logo": "bg-emerald-700",
    "ctaName": "Zendesk AI",
    "score": 9,
    "fallbackUrl": "https://www.zendesk.com",
    "company": "Zendesk",
    "model": "Zendesk AI plattform",
    "founded": 2007,
    "hq": "San Francisco, USA",
    "useCases": [
      "Ärendehantering",
      "Routing",
      "Autoresponder",
      "Omnichannel-support",
      "Knowledge-base assist"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 9
      },
      {
        "label": "Integrationer",
        "score": 8.9
      },
      {
        "label": "Eskaleringslogik",
        "score": 8.8
      },
      {
        "label": "Svenska",
        "score": 8.7
      },
      {
        "label": "Pris / prestanda",
        "score": 8.6
      },
      {
        "label": "Analytik",
        "score": 9.4
      }
    ],
    "tags": [
      "Omnichannel",
      "Helpdesk",
      "Branschstandard",
      "Add-on AI"
    ],
    "pros": [
      "Branschstandard helpdesk",
      "Bred integrationsmarknad",
      "Mogen AI på toppen av befintliga flöden"
    ],
    "cons": [
      "AI är tilläggsmodul, inte inbyggt",
      "Stora team får snabbt premium-prislapp"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Suite Team $55 + AI $50/agent/mån",
      "bestFor": "Etablerade kundservice-team med Zendesk redan"
    },
    "label": "Branschstandard"
  },
  "salesforce-einstein": {
    "logo": "bg-blue-600",
    "ctaName": "Salesforce Einstein",
    "score": 8.7,
    "fallbackUrl": "https://www.salesforce.com/products/einstein-ai-solutions",
    "company": "Salesforce",
    "model": "Salesforce Einstein plattform",
    "founded": 1999,
    "hq": "San Francisco, USA",
    "useCases": [
      "Service Cloud-AI",
      "Autonoma agenter",
      "Case-routing",
      "Knowledge-management",
      "Sales-service-koppling"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8.7
      },
      {
        "label": "Integrationer",
        "score": 8.6
      },
      {
        "label": "Eskaleringslogik",
        "score": 8.5
      },
      {
        "label": "Svenska",
        "score": 8.4
      },
      {
        "label": "Pris / prestanda",
        "score": 8.3
      },
      {
        "label": "Analytik",
        "score": 9.1
      }
    ],
    "tags": [
      "Einstein",
      "Agentforce",
      "Salesforce",
      "Trust Layer"
    ],
    "pros": [
      "Djup Salesforce-integration",
      "Stark säkerhet (Trust Layer)",
      "Autonoma agenter på väg"
    ],
    "cons": [
      "Kräver Salesforce-licens",
      "Komplext om man inte redan kör Salesforce"
    ],
    "offer": {
      "title": "Inkluderad i högre Service Cloud-tiers",
      "price": "Från $500/anv/mån (Service)",
      "bestFor": "Salesforce-kunder med Service Cloud"
    },
    "label": "Bäst för Salesforce-stack"
  },
  "freshdesk-ai": {
    "logo": "bg-amber-600",
    "ctaName": "Freshdesk AI",
    "score": 8.6,
    "fallbackUrl": "https://www.freshworks.com/freshdesk",
    "company": "Freshworks",
    "model": "Freshdesk AI plattform",
    "founded": 2010,
    "hq": "San Mateo / Chennai",
    "useCases": [
      "Ärendehantering",
      "Agent-copilot",
      "Chatbot-flöden",
      "Knowledge-base",
      "Field service"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8.6
      },
      {
        "label": "Integrationer",
        "score": 8.5
      },
      {
        "label": "Eskaleringslogik",
        "score": 8.4
      },
      {
        "label": "Svenska",
        "score": 8.3
      },
      {
        "label": "Pris / prestanda",
        "score": 8.2
      },
      {
        "label": "Analytik",
        "score": 9
      }
    ],
    "tags": [
      "Freddy AI",
      "Mid-market",
      "Affordable",
      "Omnichannel"
    ],
    "pros": [
      "Konkurrenskraftigt pris",
      "Snabb implementation",
      "Snyggt UI"
    ],
    "cons": [
      "Mindre community än Zendesk",
      "Avancerad routing kräver Enterprise"
    ],
    "offer": {
      "title": "21 dagar trial",
      "price": "Growth $15/agent/mån",
      "bestFor": "Mid-market som vill ha Zendesk-funktionalitet billigare"
    },
    "label": "Bästa pris-prestanda"
  },
  "aisera": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Aisera",
    "score": 8.5,
    "fallbackUrl": "https://aisera.com",
    "company": "Aisera",
    "model": "Aisera plattform",
    "founded": 2017,
    "hq": "Palo Alto, USA",
    "useCases": [
      "IT helpdesk",
      "HR-support",
      "Finance-support",
      "Self-service-portaler",
      "AIOps-integration"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8.5
      },
      {
        "label": "Integrationer",
        "score": 8.4
      },
      {
        "label": "Eskaleringslogik",
        "score": 8.3
      },
      {
        "label": "Svenska",
        "score": 8.2
      },
      {
        "label": "Pris / prestanda",
        "score": 8.1
      },
      {
        "label": "Analytik",
        "score": 8.9
      }
    ],
    "tags": [
      "Internsupport",
      "ServiceNow",
      "IT/HR",
      "Enterprise"
    ],
    "pros": [
      "Stark inom intern service desk",
      "God ServiceNow-integration",
      "Enterprise-säkerhet"
    ],
    "cons": [
      "Premium-prislapp",
      "Bäst för stora företag"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom enterprise",
      "bestFor": "Stora företag med IT/HR helpdesk-behov"
    },
    "label": "Bäst intern service desk"
  },
  "hubspot-ai": {
    "logo": "bg-orange-700",
    "ctaName": "HubSpot AI",
    "score": 8.5,
    "fallbackUrl": "https://www.hubspot.com",
    "company": "HubSpot",
    "model": "HubSpot AI plattform",
    "founded": 2006,
    "hq": "Cambridge, USA",
    "useCases": [
      "Service Hub-AI",
      "Customer Portal",
      "KB-assistant",
      "Chatbot-flöden",
      "Tightning sälj/service"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8.5
      },
      {
        "label": "Integrationer",
        "score": 8.4
      },
      {
        "label": "Eskaleringslogik",
        "score": 8.3
      },
      {
        "label": "Svenska",
        "score": 8.2
      },
      {
        "label": "Pris / prestanda",
        "score": 8.1
      },
      {
        "label": "Analytik",
        "score": 8.9
      }
    ],
    "tags": [
      "Breeze",
      "Service Hub",
      "SMB",
      "CRM-integration"
    ],
    "pros": [
      "Bra för SMB som redan kör HubSpot",
      "AI ingår i högre tiers",
      "Smidigt över sälj/marknad/service"
    ],
    "cons": [
      "Bäst när du redan kör HubSpot",
      "Avancerad routing saknas mot Zendesk"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Service Hub Starter $20/mån",
      "bestFor": "SMB med HubSpot-stack"
    },
    "label": "Bäst för HubSpot-stack"
  },
  "forethought": {
    "logo": "bg-rose-600",
    "ctaName": "Forethought",
    "score": 8.4,
    "fallbackUrl": "https://forethought.ai",
    "company": "Forethought",
    "model": "Forethought plattform",
    "founded": 2017,
    "hq": "San Francisco, USA",
    "useCases": [
      "Autonom resolution",
      "Sentiment-detection",
      "Ärendeprediktion",
      "Smart routing",
      "Knowledge-bridging"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8.4
      },
      {
        "label": "Integrationer",
        "score": 8.3
      },
      {
        "label": "Eskaleringslogik",
        "score": 8.2
      },
      {
        "label": "Svenska",
        "score": 8.1
      },
      {
        "label": "Pris / prestanda",
        "score": 8
      },
      {
        "label": "Analytik",
        "score": 8.8
      }
    ],
    "tags": [
      "SupportGPT",
      "Autonom",
      "Zendesk-tillägg",
      "Prediktion"
    ],
    "pros": [
      "Stark autonom resolution",
      "Smart prediktion",
      "Bra Zendesk-tillägg"
    ],
    "cons": [
      "Smalt mid-market segment",
      "Mindre känt utanför Bay Area"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$30k/år",
      "bestFor": "Modernt mid-market support-team som vill toppa Zendesk med AI"
    },
    "label": "Bäst Zendesk-toppning"
  },
  "tidio-2": {
    "logo": "bg-sky-600",
    "ctaName": "Tidio",
    "score": 8.2,
    "fallbackUrl": "https://www.tidio.com",
    "company": "Tidio",
    "model": "Tidio plattform",
    "founded": 2013,
    "hq": "San Francisco / Szczecin",
    "useCases": [
      "Chatbot e-handel",
      "Live chat",
      "Cart-recovery",
      "FAQ-automation",
      "Shopify-stöd"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8.2
      },
      {
        "label": "Integrationer",
        "score": 8.1
      },
      {
        "label": "Eskaleringslogik",
        "score": 8
      },
      {
        "label": "Svenska",
        "score": 7.9
      },
      {
        "label": "Pris / prestanda",
        "score": 7.8
      },
      {
        "label": "Analytik",
        "score": 8.6
      }
    ],
    "tags": [
      "Lyro AI",
      "Shopify",
      "SMB",
      "E-handel"
    ],
    "pros": [
      "Bäst för småhandlare",
      "Snabb start",
      "Generös gratisversion"
    ],
    "cons": [
      "Smalt för enterprise-volym",
      "Färre integrationer än Zendesk"
    ],
    "offer": {
      "title": "7 dagar premium-trial + free-tier",
      "price": "Free / Starter $29/mån",
      "bestFor": "E-handlare på Shopify/WooCommerce"
    },
    "label": "Bäst för småhandel"
  },
  "drift": {
    "logo": "bg-violet-600",
    "ctaName": "Drift",
    "score": 8,
    "fallbackUrl": "https://www.drift.com",
    "company": "Salesloft (Drift)",
    "model": "Drift plattform",
    "founded": 2015,
    "hq": "Boston, USA",
    "useCases": [
      "Inbound leadgen",
      "Account-based marketing",
      "Sales-chat",
      "Outbound nurture",
      "Engagement-routing"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 8
      },
      {
        "label": "Integrationer",
        "score": 7.9
      },
      {
        "label": "Eskaleringslogik",
        "score": 7.8
      },
      {
        "label": "Svenska",
        "score": 7.7
      },
      {
        "label": "Pris / prestanda",
        "score": 7.6
      },
      {
        "label": "Analytik",
        "score": 8.4
      }
    ],
    "tags": [
      "Conversational marketing",
      "B2B",
      "Leadgen",
      "Salesloft"
    ],
    "pros": [
      "Bäst för B2B-leadgen via chat",
      "God account-routing",
      "Conversational marketing-pionjär"
    ],
    "cons": [
      "Inte renodlad support",
      "Funkar bäst i sälj-tunga flöden"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$2500/mån",
      "bestFor": "B2B-säljteam med inbound-fokus"
    },
    "label": "Bäst för B2B-leadgen"
  },
  "chatbot-com": {
    "logo": "bg-teal-700",
    "ctaName": "ChatBot.com",
    "score": 7.8,
    "fallbackUrl": "https://www.chatbot.com",
    "company": "LiveChat Inc.",
    "model": "ChatBot.com plattform",
    "founded": 2002,
    "hq": "Wrocław, Polen",
    "useCases": [
      "FAQ-automation",
      "Lead-qualification",
      "Booking-flöden",
      "Survey-bot",
      "E-handel-FAQ"
    ],
    "ratingCriteria": [
      {
        "label": "NLU-kvalitet",
        "score": 7.8
      },
      {
        "label": "Integrationer",
        "score": 7.7
      },
      {
        "label": "Eskaleringslogik",
        "score": 7.6
      },
      {
        "label": "Svenska",
        "score": 7.5
      },
      {
        "label": "Pris / prestanda",
        "score": 7.4
      },
      {
        "label": "Analytik",
        "score": 8.2
      }
    ],
    "tags": [
      "No-code",
      "Flow builder",
      "LiveChat",
      "Templates"
    ],
    "pros": [
      "Inga utvecklare behövs",
      "Bra mall-bibliotek",
      "Snabb implementation"
    ],
    "cons": [
      "Mindre AI-driven än Tidio Lyro",
      "Behöver LiveChat för full kraft"
    ],
    "offer": {
      "title": "14 dagar trial",
      "price": "Starter $52/mån",
      "bestFor": "SMB som vill ha visuell flow-builder"
    },
    "label": "Bäst no-code"
  },
  "workday-ai": {
    "logo": "bg-orange-700",
    "ctaName": "Workday AI",
    "score": 9,
    "fallbackUrl": "https://www.workday.com",
    "company": "Workday",
    "model": "Workday AI plattform",
    "founded": 2005,
    "hq": "Pleasanton, USA",
    "useCases": [
      "End-to-end rekrytering",
      "Talent management",
      "Skills-mapping",
      "Internal mobility",
      "Compliance-rapportering"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.9
      },
      {
        "label": "Bias-skydd",
        "score": 8.8
      },
      {
        "label": "ATS-integration",
        "score": 8.7
      },
      {
        "label": "Skalbarhet",
        "score": 8.6
      },
      {
        "label": "Pris / prestanda",
        "score": 9.4
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 9.3
      }
    ],
    "tags": [
      "Enterprise",
      "HCM",
      "Skills Cloud",
      "Recruiting Agent"
    ],
    "pros": [
      "Branschstandard för stora företag",
      "AI fully integrated",
      "Stark compliance"
    ],
    "cons": [
      "Lågfart för ändringar",
      "Enterprise-pris"
    ],
    "offer": {
      "title": "Demo via Workday-sales",
      "price": "Från ~$30/anställd/år",
      "bestFor": "Företag med 1000+ anställda som redan kör Workday"
    },
    "label": "Branschstandard enterprise"
  },
  "eightfold-ai": {
    "logo": "bg-indigo-700",
    "ctaName": "Eightfold AI",
    "score": 9,
    "fallbackUrl": "https://eightfold.ai",
    "company": "Eightfold AI",
    "model": "Eightfold AI plattform",
    "founded": 2016,
    "hq": "Santa Clara, USA",
    "useCases": [
      "Skills-matching",
      "Internal mobility",
      "Diversity-pipelines",
      "Talent-prediktion",
      "M&A-talent-integration"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.9
      },
      {
        "label": "Bias-skydd",
        "score": 8.8
      },
      {
        "label": "ATS-integration",
        "score": 8.7
      },
      {
        "label": "Skalbarhet",
        "score": 8.6
      },
      {
        "label": "Pris / prestanda",
        "score": 9.4
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 9.3
      }
    ],
    "tags": [
      "Talent Intelligence",
      "Deep learning",
      "Internal mobility",
      "Skills"
    ],
    "pros": [
      "Marknadens djupaste AI-modell",
      "Stark internal mobility",
      "Branschspecifika modeller"
    ],
    "cons": [
      "Enterprise-pris",
      "Implementation kräver konsult"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom enterprise",
      "bestFor": "Stora företag med komplexa skills-pipelines"
    },
    "label": "Djupast AI"
  },
  "greenhouse-ai": {
    "logo": "bg-green-700",
    "ctaName": "Greenhouse AI",
    "score": 8.9,
    "fallbackUrl": "https://www.greenhouse.com",
    "company": "Greenhouse",
    "model": "Greenhouse AI plattform",
    "founded": 2012,
    "hq": "New York, USA",
    "useCases": [
      "ATS-flöden",
      "Strukturerade intervjuer",
      "Talent CRM",
      "Diversity-tracking",
      "Skills-bedömning"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.8
      },
      {
        "label": "Bias-skydd",
        "score": 8.7
      },
      {
        "label": "ATS-integration",
        "score": 8.6
      },
      {
        "label": "Skalbarhet",
        "score": 8.5
      },
      {
        "label": "Pris / prestanda",
        "score": 9.3
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 9.2
      }
    ],
    "tags": [
      "ATS",
      "Tech-scale-ups",
      "Strukturerat",
      "Modern UX"
    ],
    "pros": [
      "Branschledande ATS",
      "Bra strukturerad rekryteringsprocess",
      "Modern UX"
    ],
    "cons": [
      "AI är yngre än ATS-stommen",
      "Enterprise-pris"
    ],
    "offer": {
      "title": "Demo via Greenhouse-sales",
      "price": "Från ~$5k/mån",
      "bestFor": "Tech-scale-ups och moderna HR-team"
    },
    "label": "Bäst ATS för tech"
  },
  "paradox": {
    "logo": "bg-pink-700",
    "ctaName": "Paradox",
    "score": 8.7,
    "fallbackUrl": "https://www.paradox.ai",
    "company": "Paradox",
    "model": "Paradox plattform",
    "founded": 2016,
    "hq": "Scottsdale, USA",
    "useCases": [
      "Volym-rekrytering",
      "SMS-screening",
      "Scheduling",
      "Retail-rekrytering",
      "On-demand-intervjuer"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.6
      },
      {
        "label": "Bias-skydd",
        "score": 8.5
      },
      {
        "label": "ATS-integration",
        "score": 8.4
      },
      {
        "label": "Skalbarhet",
        "score": 8.3
      },
      {
        "label": "Pris / prestanda",
        "score": 9.1
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 9
      }
    ],
    "tags": [
      "Olivia",
      "SMS",
      "QSR",
      "Retail"
    ],
    "pros": [
      "Bäst för retail/QSR-volym",
      "Stark scheduling-automation",
      "Mobil-first"
    ],
    "cons": [
      "Mindre relevant för senior/profession-roller",
      "Specialiserat på volym"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Custom från ~$5k/mån",
      "bestFor": "Retail, QSR, manufacturing och annan volym-rekrytering"
    },
    "label": "Bäst för volym"
  },
  "beamery": {
    "logo": "bg-violet-700",
    "ctaName": "Beamery",
    "score": 8.6,
    "fallbackUrl": "https://www.beamery.com",
    "company": "Beamery",
    "model": "Beamery plattform",
    "founded": 2014,
    "hq": "London, UK",
    "useCases": [
      "Talent lifecycle",
      "Skills-mapping",
      "Internal mobility",
      "Diversity-pipelines",
      "EU-rekrytering"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.5
      },
      {
        "label": "Bias-skydd",
        "score": 8.4
      },
      {
        "label": "ATS-integration",
        "score": 8.3
      },
      {
        "label": "Skalbarhet",
        "score": 8.2
      },
      {
        "label": "Pris / prestanda",
        "score": 9
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 8.9
      }
    ],
    "tags": [
      "Talent Cloud",
      "Skills",
      "Europe",
      "Multinationals"
    ],
    "pros": [
      "Bred talent lifecycle-täckning",
      "Skills-baserad approach",
      "EU-fokus"
    ],
    "cons": [
      "Enterprise-pris",
      "Implementation kräver konsult"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$50k/år",
      "bestFor": "Multinationella företag med stor talent pool"
    },
    "label": "Bäst multinationellt"
  },
  "hirevue": {
    "logo": "bg-emerald-600",
    "ctaName": "HireVue",
    "score": 8.5,
    "fallbackUrl": "https://www.hirevue.com",
    "company": "HireVue",
    "model": "HireVue plattform",
    "founded": 2004,
    "hq": "South Jordan, USA",
    "useCases": [
      "On-demand-intervjuer",
      "Game-based assessments",
      "Coding-screening",
      "Campus-rekrytering",
      "Diversity-screening"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.4
      },
      {
        "label": "Bias-skydd",
        "score": 8.3
      },
      {
        "label": "ATS-integration",
        "score": 8.2
      },
      {
        "label": "Skalbarhet",
        "score": 8.1
      },
      {
        "label": "Pris / prestanda",
        "score": 8.9
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 8.8
      }
    ],
    "tags": [
      "Videointervju",
      "Volym",
      "Assessment",
      "On-demand"
    ],
    "pros": [
      "Skalbar screening",
      "Bra för volym-rekrytering",
      "Mogen produkt"
    ],
    "cons": [
      "Etikdebatten kring AI-analys",
      "Mindre relevant för senior-roller"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$25k/år",
      "bestFor": "Volym-rekrytering (consulting, banker, retail-management)"
    },
    "label": "Bäst videointervju"
  },
  "seekout": {
    "logo": "bg-rose-700",
    "ctaName": "SeekOut",
    "score": 8.5,
    "fallbackUrl": "https://seekout.com",
    "company": "SeekOut",
    "model": "SeekOut plattform",
    "founded": 2017,
    "hq": "Bellevue, USA",
    "useCases": [
      "Svår-att-hitta tech-talanger",
      "Sjukvårdsrekrytering",
      "Diversitets-sourcing",
      "Niche-roller",
      "Boolean-search-automation"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.4
      },
      {
        "label": "Bias-skydd",
        "score": 8.3
      },
      {
        "label": "ATS-integration",
        "score": 8.2
      },
      {
        "label": "Skalbarhet",
        "score": 8.1
      },
      {
        "label": "Pris / prestanda",
        "score": 8.9
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 8.8
      }
    ],
    "tags": [
      "Talent search",
      "Tech",
      "Healthcare",
      "Diversity"
    ],
    "pros": [
      "Bästa kandidat-databasen",
      "Skarp på tech/sjukvård",
      "Diversity-funktioner inbyggt"
    ],
    "cons": [
      "Search-only (ej ATS)",
      "Premium-pris"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$1k/seat/mån",
      "bestFor": "Tech- och sjukvårds-rekryterare med svår-att-hitta roller"
    },
    "label": "Bäst tech/sjukvård search"
  },
  "lever-ai": {
    "logo": "bg-amber-700",
    "ctaName": "Lever AI",
    "score": 8.4,
    "fallbackUrl": "https://www.lever.co",
    "company": "Employ Inc. (Lever)",
    "model": "Lever AI plattform",
    "founded": 2012,
    "hq": "San Francisco, USA",
    "useCases": [
      "Outbound-sourcing",
      "Talent CRM",
      "Pipeline-management",
      "Compliance-reporting",
      "Nurture-flöden"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 8.3
      },
      {
        "label": "Bias-skydd",
        "score": 8.2
      },
      {
        "label": "ATS-integration",
        "score": 8.1
      },
      {
        "label": "Skalbarhet",
        "score": 8
      },
      {
        "label": "Pris / prestanda",
        "score": 8.8
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 8.7
      }
    ],
    "tags": [
      "ATS+CRM",
      "Sourcing",
      "Outbound",
      "Nurture"
    ],
    "pros": [
      "Stark sourcing-funktionalitet",
      "Bra för outbound-tunga team",
      "Solid talent CRM"
    ],
    "cons": [
      "Mindre community än Greenhouse",
      "AI-features yngre"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Från ~$4k/mån",
      "bestFor": "Bolag med stora outbound-sourcing-pipelines"
    },
    "label": "Bäst för sourcing"
  },
  "pymetrics": {
    "logo": "bg-fuchsia-600",
    "ctaName": "Pymetrics",
    "score": 8,
    "fallbackUrl": "https://www.harver.com",
    "company": "Harver (Pymetrics)",
    "model": "Pymetrics plattform",
    "founded": 2013,
    "hq": "New York, USA",
    "useCases": [
      "Bias-reducerad screening",
      "Diversitetsmål",
      "Campus-volym",
      "Personality-assessment",
      "Talent-pool-utvärdering"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 7.9
      },
      {
        "label": "Bias-skydd",
        "score": 7.8
      },
      {
        "label": "ATS-integration",
        "score": 7.7
      },
      {
        "label": "Skalbarhet",
        "score": 7.6
      },
      {
        "label": "Pris / prestanda",
        "score": 8.4
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 8.3
      }
    ],
    "tags": [
      "Neuroscience",
      "Bias-reduktion",
      "Fairness",
      "Game-based"
    ],
    "pros": [
      "Vetenskapligt förankrad",
      "Stark bias-reduktion",
      "Bra för att hitta otraditionella kandidater"
    ],
    "cons": [
      "Smalt fokus (assessment, ej ATS)",
      "Kräver volym för att löna sig"
    ],
    "offer": {
      "title": "Demo via Harver-sales",
      "price": "Från ~$15k/år",
      "bestFor": "Stora rekryteringsbolag med diversitetsmål"
    },
    "label": "Bäst för bias-reduktion"
  },
  "fetcher": {
    "logo": "bg-cyan-700",
    "ctaName": "Fetcher",
    "score": 8,
    "fallbackUrl": "https://fetcher.ai",
    "company": "Fetcher",
    "model": "Fetcher plattform",
    "founded": 2014,
    "hq": "New York, USA",
    "useCases": [
      "Passiv kandidat-sourcing",
      "Email-nurture",
      "Diversity-pipelines",
      "Småteam-rekrytering",
      "Pipeline-volume"
    ],
    "ratingCriteria": [
      {
        "label": "Matchningskvalitet",
        "score": 7.9
      },
      {
        "label": "Bias-skydd",
        "score": 7.8
      },
      {
        "label": "ATS-integration",
        "score": 7.7
      },
      {
        "label": "Skalbarhet",
        "score": 7.6
      },
      {
        "label": "Pris / prestanda",
        "score": 8.4
      },
      {
        "label": "Svensk arbetsrätt",
        "score": 8.3
      }
    ],
    "tags": [
      "Outbound",
      "Sourcing",
      "Passive candidates",
      "Diversity"
    ],
    "pros": [
      "Snabbar upp passiv sourcing",
      "Bra för småteam",
      "Tydlig diversity-funktion"
    ],
    "cons": [
      "Bara outbound-sourcing (ej ATS)",
      "Inte för executive-rekrytering"
    ],
    "offer": {
      "title": "Demo via sales",
      "price": "Pro $549/mån",
      "bestFor": "Småteam som behöver volym på passiv kandidat-outreach"
    },
    "label": "Bäst passiv sourcing"
  }
};
