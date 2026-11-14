/** AI för text — utökning från 11 till 20 verktyg i ai-text-verktyg-hubben
 *  (/ai-verktyg/ai-text-verktyg). 9 nya recensioner: omskrivning (QuillBot,
 *  Wordtune), skönlitteratur (Sudowrite), marknadsföringstext (Rytr),
 *  en europeisk generalist-assistent (Mistral Vibe, tidigare Le Chat),
 *  teamorienterad skrivassistent (Sapling AI), SEO-innehåll i volym
 *  (BrandWell, tidigare Content at Scale), djup stilanalys (ProWritingAid)
 *  och akademiskt skrivande (Jenni AI). Fakta verifierade mot tredjeparts-
 *  källor 2026-11-14 (leverantörernas egna sajter blockerade WebFetch) —
 *  motstridiga uppgifter flaggas i reviewtexten istället för att gissas.
 *  founded/hq utelämnade där de inte gick att verifiera. */
import type { ReviewProfile } from '@/components/templates/ReviewTemplate';

export const CATEGORY_HUB_REVIEW_KNOWN_AI_TEXT_VERKTYG_EXT: Record<string, Partial<ReviewProfile>> = {
  quillbot: {
    logo: 'bg-emerald-600',
    ctaName: 'QuillBot',
    fallbackUrl: 'https://quillbot.com',
    tagline: 'Etablerad omskrivningstjänst med grammatik-, plagiat- och sammanfattningsverktyg i samma prenumeration.',
    company: 'QuillBot',
    useCases: [
      'Studenter och forskare som vill formulera om en redan skriven text',
      'Den som behöver snabb grammatik- och plagiatkontroll',
      'Skribenter som vill variera ton mellan formell och kreativ text',
    ],
    ratingCriteria: [
      { label: 'Omskrivningskvalitet', score: 8.5 },
      { label: 'Grammatikkontroll', score: 8.0 },
      { label: 'Gratisnivå', score: 6.0 },
      { label: 'Prisvärde', score: 7.8 },
    ],
    tags: ['Omskrivning', 'Grammatik', 'Plagiatkontroll', 'Sammanfattning'],
    pros: [
      'Mycket bra och snabb omskrivning i flera toner och lägen',
      'Grammatik-, plagiat- och sammanfattningsverktyg ingår i samma prenumeration',
    ],
    cons: [
      'Gratisversionen kraftigt begränsad till 125 ord per omskrivning',
      'Genererar inte nytt innehåll från grunden — kompletterar snarare än ersätter ett skrivverktyg',
    ],
    offer: {
      title: 'Free / Premium',
      price: 'Gratis (125 ord/omskrivning). Premium 19,95 USD/mån, cirka 8,33 USD/mån vid årsbetalning (99,95 USD/år) — källor skiljer sig åt om kvartalspris.',
      bestFor: 'Studenter och skribenter som vill formulera om befintlig text',
    },
    label: 'Bäst för omskrivning',
    score: 8.0,
  },
  sudowrite: {
    logo: 'bg-violet-700',
    ctaName: 'Sudowrite',
    fallbackUrl: 'https://www.sudowrite.com',
    tagline: 'AI-skrivpartner byggd specifikt för skönlitterärt berättande — noveller och romaner, inte marknadsföringstext.',
    company: 'Sudowrite',
    useCases: [
      'Författare som skriver noveller eller romaner',
      'Den som vill ha hjälp att fortsätta en scen eller beskriva en känsla mer levande',
      'Skribenter som vill hålla reda på karaktärer och handling genom ett helt bokprojekt',
    ],
    ratingCriteria: [
      { label: 'Skönlitterär kvalitet', score: 8.8 },
      { label: 'Story Bible / struktur', score: 8.5 },
      { label: 'Prisförutsägbarhet', score: 6.5 },
      { label: 'Nischanpassning', score: 9.0 },
    ],
    tags: ['Skönlitteratur', 'Story Bible', 'Berättarteknik', 'Romanskrivande'],
    pros: [
      'Byggt specifikt för skönlitterärt berättande, inte generisk marknadsföringstext',
      'Story Bible håller ihop karaktärer och handling genom ett helt bokprojekt',
    ],
    cons: [
      'Kreditbaserat system gör kostnaden svårförutsägbar — källor ger olika kreditsiffror per nivå',
      'Mindre relevant för marknadsförings- eller affärstext',
    ],
    offer: {
      title: 'Hobby & Student / Professional / Max',
      price: 'Cirka 10/22/44 USD/mån vid årsbetalning (19/29/59 USD/mån löpande) enligt de flesta källor — kreditmängd per nivå anges olika.',
      bestFor: 'Författare som skriver skönlitteratur regelbundet',
    },
    label: 'Bäst för skönlitteratur',
    score: 8.2,
  },
  rytr: {
    logo: 'bg-sky-600',
    ctaName: 'Rytr',
    fallbackUrl: 'https://rytr.me',
    tagline: 'Budgetvänligt AI-skrivverktyg med 40+ mallar för korta marknadsföringstexter på 30+ språk.',
    company: 'Rytr',
    useCases: [
      'Småföretagare som behöver korta marknadsföringstexter till lågt pris',
      'Den som skriver annonstexter, produktbeskrivningar eller sociala medier-inlägg',
      'Flerspråkiga team som behöver brett språkstöd billigt',
    ],
    ratingCriteria: [
      { label: 'Korttextkvalitet', score: 7.6 },
      { label: 'Prisvärde', score: 8.5 },
      { label: 'Långformskvalitet', score: 5.5 },
      { label: 'Språkstöd', score: 8.3 },
    ],
    tags: ['Marknadsföringstext', 'Budgetalternativ', 'Flerspråkigt', 'Korta texter'],
    pros: [
      'Ett av de billigaste AI-skrivverktygen i kategorin',
      'Brett språkstöd (35+ språk) och många färdiga användningsfall',
    ],
    cons: [
      'Svagare på långa, sammanhängande texter än på korta marknadsföringssnuttar',
      'Prisnivåer och plannamn har ändrats upprepade gånger — källor är oense om aktuell struktur',
    ],
    offer: {
      title: 'Free / betalda nivåer',
      price: 'Gratis (10 000 tecken/mån). Betalda nivåer anges olika mellan källor, vanligast cirka 9 USD/mån och 29 USD/mån — kontrollera aktuell struktur hos leverantören.',
      bestFor: 'Småföretag som behöver kort marknadsföringstext billigt',
    },
    label: 'Billigaste alternativet',
    score: 7.4,
  },
  'mistral-vibe': {
    logo: 'bg-orange-600',
    ctaName: 'Mistral Vibe',
    fallbackUrl: 'https://chat.mistral.ai',
    tagline: 'Mistrals AI-assistent (tidigare Le Chat, bytte namn 28 maj 2026) — europeisk, med inbyggt kodningsstöd.',
    company: 'Mistral AI',
    useCases: [
      'Europeiska användare och företag som prioriterar EU-baserad dataskydd',
      'Den som vill ha en generell AI-assistent plus kodningsstöd i samma verktyg',
      'Organisationer som redan bygger på Mistrals språkmodeller',
    ],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.2 },
      { label: 'Dataskydd/EU-drift', score: 9.0 },
      { label: 'Ekosystem', score: 6.5 },
      { label: 'Gratisnivå', score: 8.5 },
    ],
    tags: ['Europeisk AI', 'Dataskydd', 'Kodningsstöd', 'Generalistassistent'],
    pros: [
      'Europeisk AI-utvecklare med fokus på dataskydd och EU-drift',
      'Generös gratisnivå med bild, webbsök och API-krediter inkluderat',
    ],
    cons: [
      'Namnbytet (Le Chat → Vibe, maj 2026) gör äldre information om verktyget inaktuell',
      'Mindre tredjepartsekosystem och allmän kännedom än ChatGPT, Claude och Gemini',
    ],
    offer: {
      title: 'Free / Pro / Team / Enterprise',
      price: 'Gratis med begränsningar. Pro 14,99 USD/mån (student 5,99 USD/mån). Team 24,99 USD/användare/mån. Enterprise på offert.',
      bestFor: 'Europeiska användare som prioriterar dataskydd',
    },
    label: 'Bäst europeiskt alternativ',
    score: 8.1,
  },
  'sapling-ai': {
    logo: 'bg-teal-600',
    ctaName: 'Sapling AI',
    fallbackUrl: 'https://sapling.ai',
    tagline: 'Skrivassistent byggd för kundsupport- och säljteam, med flerspråkig grammatikkontroll och delade textsnuttar.',
    company: 'Sapling',
    useCases: [
      'Kundsupportteam som skriver många liknande svar varje dag',
      'Säljteam som vill standardisera mejl och meddelanden',
      'Företag som behöver flerspråkig grammatikkontroll (20+ språk) och säkerhetsfunktioner',
    ],
    ratingCriteria: [
      { label: 'Teamfunktioner', score: 8.3 },
      { label: 'Grammatikkontroll', score: 7.8 },
      { label: 'Innehållsgenerering', score: 5.5 },
      { label: 'Säkerhet (SSO/PII)', score: 8.5 },
    ],
    tags: ['Kundsupport', 'Team', 'Flerspråkig', 'Säkerhet'],
    pros: [
      'Starkt för team med återkommande support- eller säljsvar',
      'Flerspråkig grammatikkontroll och säkerhetsfunktioner (SSO, MFA, PII-redigering) för företag',
    ],
    cons: [
      'Inte byggt för att generera längre, fristående innehåll',
      'Gratisnivåns gränser beskrivs inkonsekvent mellan källor',
    ],
    offer: {
      title: 'Free / betalda team-planer',
      price: 'Gratisnivå med begränsad AI-detektor. Betalplaner från cirka 25 USD/mån enligt flera källor, anpassad prissättning för större team.',
      bestFor: 'Support- och säljteam med många återkommande svar',
    },
    label: 'Bäst för supportteam',
    score: 7.6,
  },
  wordtune: {
    logo: 'bg-indigo-600',
    ctaName: 'Wordtune',
    fallbackUrl: 'https://www.wordtune.com',
    tagline: 'Omformulerings- och sammanfattningsverktyg som sitter direkt i Gmail, Google Docs, Word och Slack.',
    company: 'AI21 Labs',
    useCases: [
      'Den som vill ha skrivhjälp direkt i Gmail eller Google Docs',
      'Skribenter som vill omformulera meningar i realtid medan de skriver',
      'Den som behöver snabbt svara på frågor mot egna uppladdade dokument',
    ],
    ratingCriteria: [
      { label: 'Integration', score: 8.5 },
      { label: 'Omformuleringskvalitet', score: 7.8 },
      { label: 'SEO/innehållsfunktioner', score: 4.5 },
      { label: 'Prisvärde', score: 7.0 },
    ],
    tags: ['Omformulering', 'Webbläsartillägg', 'Gmail/Docs', 'Sammanfattning'],
    pros: [
      'Låg tröskel — integreras direkt i Gmail, Docs, Word och Slack',
      'Bra, snabb omformulering i realtid där du redan skriver',
    ],
    cons: [
      'Saknar SEO-funktioner och varumärkesröst för innehållsmarknadsföring',
      'Flera användarrapporter om svårigheter att avsluta prenumerationen',
    ],
    offer: {
      title: 'Basic / betalda nivåer',
      price: 'Gratis (cirka 10 omformuleringar/dag). Betalda nivåer anges olika mellan källor, från cirka 6,99 USD/mån till 19,99 USD/mån för toppnivån.',
      bestFor: 'Löpande skrivhjälp direkt i Gmail, Docs eller Word',
    },
    label: 'Bäst integration',
    score: 7.5,
  },
  brandwell: {
    logo: 'bg-amber-700',
    ctaName: 'BrandWell',
    fallbackUrl: 'https://brandwell.ai',
    tagline: 'SEO-innehåll i stor volym (tidigare Content at Scale, bytte namn augusti 2024) via realtids-SERP-analys.',
    company: 'BrandWell',
    useCases: [
      'Byråer som behöver producera SEO-innehåll i stor volym',
      'Företag som vill bygga artiklar utifrån vad som redan rankar för sökordet',
      'Den som vill träna en egen AI-röst för konsekvent varumärkeston',
    ],
    ratingCriteria: [
      { label: 'SEO-ansats', score: 8.5 },
      { label: 'Volymlämplighet', score: 8.0 },
      { label: 'Prisklarhet', score: 3.5 },
      { label: 'Varumärkesanpassning', score: 7.8 },
    ],
    tags: ['SEO-innehåll', 'Volymproduktion', 'Byrå', 'SERP-analys'],
    pros: [
      'Bygger innehåll utifrån verklig SERP-analys, inte bara en generisk prompt',
      'Riktad mot byråer som behöver volym, med egen AI-röstträning',
    ],
    cons: [
      'Mycket motstridiga prisuppgifter mellan källor (24–1 500 USD/mån beroende på källa)',
      'Namnbytet till BrandWell gör färsk, pålitlig information svårare att hitta',
    ],
    offer: {
      title: 'Kontakta för offert',
      price: 'Prissättningen går inte att fastställa med säkerhet — uppgifter spänner från cirka 24 till 1 500 USD/mån beroende på källa och produkt. Begär offert direkt.',
      bestFor: 'Byråer som producerar SEO-innehåll i stor volym',
    },
    label: 'Bäst för SEO-volym',
    score: 7.3,
  },
  prowritingaid: {
    logo: 'bg-rose-700',
    ctaName: 'ProWritingAid',
    fallbackUrl: 'https://prowritingaid.com',
    tagline: 'Djupgående stilanalys med 20+ rapporter — populärt bland författare som redigerar längre manuskript.',
    company: 'ProWritingAid',
    useCases: [
      'Författare som redigerar ett helt manuskript eller en roman',
      'Skribenter som vill ha djupare stilanalys än bara grammatikkontroll',
      'Den som föredrar en livstidslicens framför löpande abonnemang',
    ],
    ratingCriteria: [
      { label: 'Stilanalys', score: 9.0 },
      { label: 'Grammatikkontroll', score: 8.5 },
      { label: 'Gratisnivå', score: 5.5 },
      { label: 'Prisvärde', score: 8.0 },
    ],
    tags: ['Stilanalys', 'Manuskriptredigering', 'Livstidslicens', 'Grammatik'],
    pros: [
      'Ovanligt djupgående stil- och flytanalys, inte bara grammatik',
      'Livstidslicens finns som alternativ till löpande abonnemang',
    ],
    cons: [
      'Gratisnivån begränsad till 500 ord åt gången',
      'Månadsplaner är icke-återbetalningsbara',
    ],
    offer: {
      title: 'Premium / Premium Pro',
      price: 'Premium 30 USD/mån (120 USD/år, eller 399 USD livstid). Premium Pro 36 USD/mån (144 USD/år, eller 699 USD livstid).',
      bestFor: 'Författare som redigerar längre manuskript regelbundet',
    },
    label: 'Djupast stilanalys',
    score: 8.3,
  },
  'jenni-ai': {
    logo: 'bg-cyan-700',
    ctaName: 'Jenni AI',
    fallbackUrl: 'https://jenni.ai',
    tagline: 'Skrivverktyg byggt för akademiska texter — autokomplettering, PDF-chatt och stöd för 10 000+ citeringsstilar.',
    company: 'Jenni AI',
    useCases: [
      'Studenter och forskare som skriver uppsatser eller avhandlingar',
      'Den som behöver chatta mot egna uppladdade forskningsunderlag',
      'Skribenter som behöver brett stöd för akademiska citeringsstilar',
    ],
    ratingCriteria: [
      { label: 'Akademisk anpassning', score: 8.3 },
      { label: 'Citeringsstöd', score: 8.8 },
      { label: 'Källtillförlitlighet', score: 6.0 },
      { label: 'Prisklarhet', score: 6.5 },
    ],
    tags: ['Akademiskt skrivande', 'Citeringar', 'PDF-chatt', 'Forskning'],
    pros: [
      'Byggt specifikt för akademiskt skrivande med brett citeringsstöd',
      'PDF-chatt mot egna forskningsunderlag',
    ],
    cons: [
      'AI-genererade citeringar måste alltid verifieras manuellt — risk för felaktiga källor',
      'Källor är oense om pris vid löpande månadsbetalning kontra årsbetalning',
    ],
    offer: {
      title: 'Free / Plus / Pro',
      price: 'Gratis med begränsningar. Plus och Pro cirka 12/29 USD/mån vid årsbetalning enligt flera källor — löpande månadsbetalning anges betydligt högre av en källa.',
      bestFor: 'Studenter och forskare med krav på formell källhänvisning',
    },
    label: 'Bäst för akademiskt skrivande',
    score: 7.7,
  },
};
