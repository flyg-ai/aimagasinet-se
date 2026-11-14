/** Utökning av ai-bild-verktyg (14 -> 20 verktyg): Recraft, Krea AI,
 *  Grok Imagine, Reve, NightCafe Studio, Qwen-Image. Fakta verifierade mot
 *  leverantörernas egna sidor + oberoende källor 2026-11-14 — flera priser
 *  anges som spann/omtvistade där källor var oense, hittar aldrig på siffror.
 *  Merged into REVIEW_KNOWN. */
import type { ReviewProfile } from '@/components/templates/ReviewTemplate';

export const CATEGORY_HUB_REVIEW_KNOWN_AI_BILD_VERKTYG_EXT: Record<string, Partial<ReviewProfile>> = {
  recraft: {
    logo: 'bg-violet-700',
    ctaName: 'Recraft',
    fallbackUrl: 'https://www.recraft.ai',
    tagline: 'Bildgenerator byggd för designers — enda stora verktyget med riktig vektorexport (SVG) och stark stilkonsistens.',
    company: 'Recraft',
    useCases: [
      'Designteam som behöver samma visuella stil över många bilder',
      'Den som vill exportera redigerbar vektorgrafik, inte bara png/jpg',
      'Varumärkesarbete där konsekvent look är viktigare än enstaka konstverk',
    ],
    ratingCriteria: [
      { label: 'Vektorexport', score: 9.0 },
      { label: 'Stilkonsistens', score: 8.6 },
      { label: 'Bildkvalitet', score: 7.8 },
      { label: 'Prisklarhet', score: 6.5 },
    ],
    tags: ['Vektorgrafik', 'SVG-export', 'Stilkonsistens', 'Design'],
    pros: [
      'Enda stora verktyget i kategorin med riktig vektorexport (SVG)',
      'Stark stilkonsistens över flera bilder — bra för varumärkesarbete',
    ],
    cons: [
      'Gratisnivån starkt begränsad, bilderna blir offentliga',
      'Prissättningen har ändrats flera gånger under 2026 och skiljer sig mellan källor',
    ],
    offer: {
      title: 'Free / Basic / Pro / Teams',
      price: 'Gratisnivå begränsad. Betalda planer rapporterat 10–22 USD/mån beroende på källa och period. API faktureras separat per bild.',
      bestFor: 'Designteam som behöver vektorgrafik och stilkonsistens',
    },
    label: 'Bäst för vektorgrafik',
    score: 8.2,
  },
  'krea-ai': {
    logo: 'bg-indigo-700',
    ctaName: 'Krea AI',
    fallbackUrl: 'https://www.krea.ai',
    tagline: 'Allt-i-ett kreativ plattform — bild, video, 3D och uppskalning under samma kreditsystem.',
    company: 'Krea',
    useCases: [
      'Den som vill slippa flera separata abonnemang för bild, video och uppskalning',
      'Kreatörer som behöver uppskalning upp till 22K',
      'Den som vill träna egna stilmodeller (LoRA) på egna bilder',
    ],
    ratingCriteria: [
      { label: 'Bredd (bild/video/3D)', score: 9.2 },
      { label: 'Uppskalning', score: 8.5 },
      { label: 'Prisvärde', score: 7.8 },
      { label: 'Prisklarhet', score: 6.8 },
    ],
    tags: ['Allt-i-ett', 'Uppskalning', 'LoRA-träning', 'Video'],
    pros: [
      'Bild, video, 3D, uppskalning och LoRA-träning i en enda plattform',
      'Gratisnivå med riktiga 100 enheter/dag utan kortuppgift',
    ],
    cons: [
      'Krediter rullar inte över på de flesta planer',
      'Priser för Max-nivån har rapporterats olika på olika delar av den egna sajten',
    ],
    offer: {
      title: 'Free / Basic / Pro / Max / Business',
      price: 'Gratis 100 enheter/dag. Basic ca 9 USD/mån, Pro ca 35 USD/mån, Max ca 105 USD/mån (siffror avvikande mellan källor), Business från 200 USD/mån.',
      bestFor: 'Den som vill ha bild, video och uppskalning samlat på ett ställe',
    },
    label: 'Bäst allt-i-ett',
    score: 8.4,
  },
  'grok-imagine': {
    logo: 'bg-zinc-800',
    ctaName: 'Grok Imagine',
    fallbackUrl: 'https://x.ai',
    tagline: 'xAI:s bild- och videogenerator, byggd direkt in i X — tillgång styrs av X/Grok-prenumerationen, ingen egen fristående plan.',
    company: 'xAI',
    useCases: [
      'Aktiva X-användare som vill generera och publicera utan att lämna appen',
      'Den som vill animera en bild till kort video (bild-till-video)',
      'Konsekvent karaktär över flera genereringar via referensläge',
    ],
    ratingCriteria: [
      { label: 'Integration (X)', score: 9.0 },
      { label: 'Bildkvalitet', score: 7.5 },
      { label: 'Videofunktioner', score: 7.8 },
      { label: 'Prisklarhet', score: 5.5 },
    ],
    tags: ['X-integration', 'Bild-till-video', 'Referensläge'],
    pros: [
      'Sömlös integration med X — generera och publicera på samma plats',
      'Referensläge för konsekvent karaktär över flera bilder/klipp',
    ],
    cons: [
      'Ingen egen, tydlig prissättning — styrs av X/Grok-prenumerationsnivå',
      'Gratisnivåns omfattning för bildgenerering har ändrats flera gånger och är omtvistad',
    ],
    offer: {
      title: 'Ingår i X Premium / SuperGrok',
      price: 'X Premium från ca 8 USD/mån, SuperGrok/Premium+ rapporterat 30–40 USD/mån och uppåt. Video kräver betald nivå.',
      bestFor: 'Aktiva X-användare som vill generera bild/video i flödet',
    },
    label: 'Bäst X-integration',
    score: 7.6,
  },
  reve: {
    logo: 'bg-sky-700',
    ctaName: 'Reve',
    fallbackUrl: 'https://reve.com',
    tagline: 'Fokuserad på att faktiskt följa prompten exakt — layout, textplacering och antal objekt, inte fri tolkning.',
    company: 'Reve',
    useCases: [
      'Marknadsföringsmaterial med specifik text som måste hamna rätt',
      'Den som är frustrerad på att andra verktyg "gissar fel" på komposition',
      'Bilder som kräver 4K-upplösning direkt vid generering',
    ],
    ratingCriteria: [
      { label: 'Prompt-följsamhet', score: 9.3 },
      { label: 'Upplösning (4K)', score: 8.5 },
      { label: 'Prisstruktur', score: 8.0 },
      { label: 'Kreativ variation', score: 6.5 },
    ],
    tags: ['Prompt-följsamhet', 'Layoutkontroll', '4K'],
    pros: [
      'Bäst i klassen på att följa instruktioner om layout, text och antal objekt',
      'Enkel, begriplig prisstruktur jämfört med många konkurrenters kreditsystem',
    ],
    cons: [
      'Gratisinnehåll kan användas för modellträning enligt tredjepartskällor — bara betalda planer kan välja bort det',
      'Mindre fri konstnärlig variation än verktyg som prioriterar kreativ tolkning',
    ],
    offer: {
      title: 'Free / Lite / Pro',
      price: 'Gratis dagligt energi-tak. Lite ca 7,99 USD/mån. Pro ca 19,99 USD/mån. API separat per bild.',
      bestFor: 'Den som behöver exakt kontroll över layout och textplacering',
    },
    label: 'Bäst prompt-följsamhet',
    score: 8.0,
  },
  'nightcafe-studio': {
    logo: 'bg-purple-800',
    ctaName: 'NightCafe Studio',
    fallbackUrl: 'https://creator.nightcafe.studio',
    tagline: 'Den tillgängliga veteranen — generera gratis genom community-aktivitet istället för att alltid betala.',
    company: 'NightCafe Studio',
    useCases: [
      'Den som vill testa AI-bildgenerering helt gratis',
      'Community-fokuserade kreatörer som gillar tävlingar och delning',
      'Nybörjare utan budget för en prenumeration',
    ],
    ratingCriteria: [
      { label: 'Tillgänglighet/gratis', score: 9.2 },
      { label: 'Community', score: 8.5 },
      { label: 'Hastighet (betalt)', score: 7.0 },
      { label: 'Prisklarhet', score: 5.0 },
    ],
    tags: ['Gratis', 'Community', 'Flera modeller'],
    pros: [
      'Genuint gratis väg till AI-bildgenerering via Relax Credits',
      'Fast Credits förfaller inte, ingen risk att förlora obetald kapacitet',
    ],
    cons: [
      'Inga priser synliga utan inloggning, svårt att jämföra i förväg',
      'Relax-köade genereringar är långsammare',
    ],
    offer: {
      title: 'Gratis (Relax Credits) / PRO',
      price: 'Gratis väg via Relax Credits. PRO-pris anges inte öppet utan inloggning; rabatt vid kvartals- (15%) eller årsbetalning (40%).',
      bestFor: 'Den som vill generera AI-bilder helt gratis',
    },
    label: 'Bäst gratisalternativ',
    score: 7.8,
  },
  'qwen-image': {
    logo: 'bg-orange-700',
    ctaName: 'Qwen-Image',
    fallbackUrl: 'https://qwen.ai',
    tagline: 'Alibabas gratis, öppna bildmodell — ovanligt stark på att rendera korrekt text i bilder.',
    company: 'Alibaba',
    useCases: [
      'Den som vill ha gratis bildgenerering med stark textrendering',
      'Tekniskt kunniga som vill köra en öppen modell lokalt (icke-kommersiellt)',
      'Bilder med skyltar, etiketter eller grafiska element med text',
    ],
    ratingCriteria: [
      { label: 'Textrendering', score: 9.0 },
      { label: 'Pris (gratis)', score: 9.5 },
      { label: 'Bildkvalitet', score: 7.8 },
      { label: 'Licensklarhet', score: 6.0 },
    ],
    tags: ['Gratis', 'Textrendering', 'Öppen modell'],
    pros: [
      'Helt gratis via Qwen Chat-appen, ingen kortuppgift krävs',
      'Ovanligt stark på att rendera korrekt, läsbar text i bilder',
    ],
    cons: [
      'Den öppna modellens licens tillåter bara icke-kommersiellt bruk',
      'Oklart och omtvistat exakt vilken modellversion den gratis appen kör',
    ],
    offer: {
      title: 'Gratis (Qwen Chat) / Öppen modell / API',
      price: 'Gratis via Qwen Chat. Öppna vikter för icke-kommersiellt bruk. API via Alibaba Cloud ca 0,03–0,075 USD/bild (källor oense).',
      bestFor: 'Den som vill ha gratis bildgenerering med stark textrendering',
    },
    label: 'Bäst textrendering',
    score: 7.9,
  },
};
