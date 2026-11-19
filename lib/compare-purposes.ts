/** Jämförelsewizardens steg 2 ("Vad ska du använda det till?") visade tidigare
 *  bara en union av de valda verktygens EGNA useCases-rader. De raderna är
 *  skrivna tool-för-tool av ~20 olika recensionsbatchar med olika stil (korta
 *  taggar, hela meningar, "vem det här passar för") — bra som produktinfo på
 *  varje kort, men ett dåligt urval av klickbara syften: inkonsekvent
 *  granularitet, ingen gemensam vokabulär mellan verktyg i samma kategori.
 *
 *  Den här filen ger ett handkurerat, kategorianpassat syftesregister för de
 *  kategorier som fått research gjord (just nu: AI-bilder, AI-text). Varje
 *  syfte är en grupp av verktygens egna riktiga useCases — ingen fabricering,
 *  bara omgruppering till vad en läsare faktiskt söker efter
 *  ("produktbilder", "copywriting" osv). Kategorier utan egen post här
 *  faller tillbaka på den gamla useCases-unionen i ComparisonWizard.
 *
 *  Pågående projekt: fler kategorier läggs till efter samma research-mönster
 *  när det blir aktuellt, inte i ett svep. */

export type PurposeOption = { slug: string; label: string };

export const PURPOSE_TAXONOMY: Record<string, PurposeOption[]> = {
  'ai-bild-verktyg': [
    { slug: 'bild-koncept', label: 'Konceptkonst & illustration' },
    { slug: 'bild-foto', label: 'Fotorealistiska bilder' },
    { slug: 'bild-reklam', label: 'Reklam & marknadsföring' },
    { slug: 'bild-produkt', label: 'Produktbilder & e-handel' },
    { slug: 'bild-logo', label: 'Logotyper & varumärke' },
    { slug: 'bild-text', label: 'Text i bild' },
    { slug: 'bild-sociala', label: 'Sociala medier & blogg' },
    { slug: 'bild-bokomslag', label: 'Bokomslag & karaktärskonst' },
    { slug: 'bild-redigering', label: 'Bakgrundsborttagning & redigering' },
    { slug: 'bild-gratis', label: 'Gratis att testa' },
    { slug: 'bild-avancerat', label: 'Egen kontroll & avancerat (API, LoRA, lokal körning)' },
  ],
  'ai-text-verktyg': [
    { slug: 'text-copywriting', label: 'Copywriting & marknadsföring' },
    { slug: 'text-allmant', label: 'Allmänt skrivande & brainstorming' },
    { slug: 'text-langform', label: 'Långform & akademiskt skrivande' },
    { slug: 'text-skonlitteratur', label: 'Skönlitteratur & manus' },
    { slug: 'text-omskrivning', label: 'Omskrivning & korrekturläsning' },
    { slug: 'text-detektering', label: 'AI-textdetektering & plagiatkontroll' },
    { slug: 'text-research', label: 'Research & stora dokument' },
    { slug: 'text-support', label: 'Kundsupport & teamkommunikation' },
    { slug: 'text-kod', label: 'Programmering & avancerat resonemang' },
  ],
  // ai-video-verktyg — inkluderar AI-avatarer (HeyGen är själva recensionens
  // "Bäst för avatarer", se useCases i lib/video-audio-tools.ts). Det var
  // saknaden av just den kategorin i jämföraren (fixat separat i page.tsx,
  // se HUB_PARENT_SLUG_ALIAS) som gjorde att "AI-avatar" inte gick att välja
  // som syfte innan — inte att purposerna för Bild saknade den.
  'ai-video-verktyg': [
    { slug: 'video-avatar', label: 'AI-avatarer & digitala tvillingar' },
    { slug: 'video-reklam', label: 'Reklamfilm & marknadsföring' },
    { slug: 'video-sociala', label: 'Sociala medier & kortvideo (TikTok/Reels/Shorts)' },
    { slug: 'video-produkt', label: 'Produktvisualisering & e-handel' },
    { slug: 'video-koncept', label: 'Konceptkonst & storyboarding' },
    { slug: 'video-foretag', label: 'Företagsutbildning, presentationer & kundservice' },
    { slug: 'video-textbild', label: 'Text/bild-till-video' },
    { slug: 'video-vfx', label: 'Redigering & visuella effekter' },
    { slug: 'video-musik', label: 'Musikvideor' },
  ],
};

/** token → vilka syftesslugs (ur dess egen kategoris lista ovan) verktyget
 *  faktiskt matchar, satt genom att läsa varje verktygs riktiga useCases i
 *  lib/review-profiles.ts — inte gissat. Verktyg som saknas här (kategori
 *  utan kurerad taxonomi) matchar istället direkt mot sina egna useCases,
 *  som innan. */
export const CURATED_PURPOSE_TOOLS: Record<string, string[]> = {
  // ai-bild-verktyg
  'dalle-3': ['bild-koncept', 'bild-sociala', 'bild-logo'],
  'adobe-firefly': ['bild-reklam', 'bild-text'],
  'leonardo-ai': ['bild-koncept', 'bild-bokomslag', 'bild-produkt'],
  'canva-ai': ['bild-sociala', 'bild-reklam', 'bild-redigering'],
  'nightcafe-studio': ['bild-gratis'],
  'recraft': ['bild-logo'],
  'krea-ai': ['bild-avancerat'],
  'qwen-image': ['bild-text', 'bild-gratis', 'bild-avancerat'],
  'reve': ['bild-reklam', 'bild-text'],
  'ideogram': ['bild-reklam', 'bild-logo', 'bild-text'],
  'playground-ai': ['bild-redigering', 'bild-koncept', 'bild-bokomslag'],
  'grok-imagine': ['bild-sociala', 'bild-bokomslag'],
  'stable-diffusion': ['bild-avancerat'],
  'midjourney': ['bild-koncept', 'bild-reklam', 'bild-bokomslag'],
  'bing-image-creator': ['bild-gratis', 'bild-koncept', 'bild-sociala'],
  'flux': ['bild-foto', 'bild-avancerat', 'bild-produkt'],
  'looka-design': ['bild-logo'],
  'removebg-bredig': ['bild-produkt', 'bild-redigering', 'bild-reklam'],

  // ai-text-verktyg
  'gptzero': ['text-detektering'],
  'sapling-ai': ['text-support', 'text-omskrivning'],
  'sudowrite': ['text-skonlitteratur'],
  'originality-ai': ['text-detektering'],
  'brandwell': ['text-copywriting'],
  'mistral-vibe': ['text-allmant', 'text-kod'],
  'winston-ai': ['text-detektering'],
  'zerogpt': ['text-detektering'],
  'copyleaks': ['text-detektering'],
  'writesonic': ['text-copywriting'],
  'quillbot': ['text-omskrivning'],
  'rytr': ['text-copywriting'],
  'wordtune': ['text-omskrivning', 'text-research'],
  'prowritingaid': ['text-skonlitteratur', 'text-omskrivning'],
  'jenni-ai': ['text-langform'],
  'chatgpt': ['text-allmant'],
  'claude': ['text-langform', 'text-kod'],
  'gemini': ['text-research'],
  'jasper-ai': ['text-copywriting'],
  'copy-ai': ['text-copywriting'],

  // ai-video-verktyg
  'adobe-firefly-video': ['video-reklam', 'video-sociala', 'video-produkt', 'video-foretag', 'video-avatar'],
  'luma-dream-machine': ['video-reklam', 'video-sociala', 'video-produkt', 'video-koncept'],
  'pika-labs': ['video-textbild', 'video-sociala'],
  'kling-ai': ['video-sociala', 'video-textbild'],
  'runway-gen-3': ['video-reklam', 'video-vfx', 'video-produkt'],
  'heygen': ['video-avatar', 'video-foretag'],
  'synthesia': ['video-avatar', 'video-foretag'],
  'kaiber': ['video-musik', 'video-avatar', 'video-reklam', 'video-sociala'],
  'invideo': ['video-sociala', 'video-reklam', 'video-foretag'],
  'capcut-ai-vklipp': ['video-sociala'],
};

/** Om ett verktyg matchar ett visst syfte. Kurerad lista om verktyget har en
 *  (kategori med research gjord) — annars samma gamla beteende: syftet ÄR en
 *  av verktygets egna useCases-strängar. */
export function toolMatchesPurpose(token: string, purposeSlug: string, fallbackUseCases: string[]): boolean {
  const curated = CURATED_PURPOSE_TOOLS[token];
  if (curated) return curated.includes(purposeSlug);
  return fallbackUseCases.includes(purposeSlug);
}

/** Textsträngen som visas i rekommendationsmeningen. Kurerade syften skickas
 *  från klienten som sin slug (t.ex. "bild-reklam"), inte sin läsbara etikett
 *  — slå upp den riktiga etiketten istället för att skriva ut slugen rakt av.
 *  Okurerade syften ÄR redan sin egen läsbara text (en useCases-sträng). */
const PURPOSE_LABEL_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.values(PURPOSE_TAXONOMY).flat().map((o) => [o.slug, o.label]),
);
export function purposeLabel(slug: string): string {
  return PURPOSE_LABEL_BY_SLUG[slug] ?? slug;
}
