/**
 * One-shot rewrite of /basta-ai-bilder-galleri-2026:
 *  1. Downloads 28 iconic AI-generated images from Wikimedia Commons.
 *  2. Uploads each to Supabase Storage under featured-images/galleri/.
 *  3. Rebuilds articles.content_mdx with embedded <figure> elements
 *     grouped by era, plus attribution captions.
 *
 * Idempotent — re-runs upsert image blobs (upsert: true) and overwrite
 * content_mdx via .update(). Safe to re-run.
 *
 *   npx tsx scripts/rewrite-gallery-article.ts
 *
 * License footing: all 28 source files are on Wikimedia Commons under
 * Public Domain (US, AI-generated), CC0, CC BY 4.0, or CC BY-SA 4.0.
 * Each figure's <figcaption> carries the attribution string.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { extname } from 'node:path';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const SLUG = 'basta-ai-bilder-galleri-2026';

type GalleryItem = {
  filename: string;
  sourceUrl: string;
  alt: string;
  caption: string;       // Plain text caption (era-context, tool, year, why it matters)
  attribution: string;   // License string (e.g. "Public Domain / Wikimedia Commons")
  era: 1 | 2 | 3 | 4 | 5;
};

const GALLERY: GalleryItem[] = [
  // ── Era 1: 2014-2018 — GANs och tidig generativ konst ─────────
  {
    filename: 'electric-sheep-draves.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Electricsheep-0-1000.jpg',
    alt: 'Algoritmiskt utvecklat fraktal-flamma från projektet Electric Sheep.',
    caption: 'Electric Sheep — Scott Draves, 2005. En av de tidigaste storskaliga generativa konstverken, en föregångare till GAN-eran.',
    attribution: 'CC BY-SA 2.0 — Scott Draves via Wikimedia Commons',
    era: 1,
  },
  {
    filename: 'aligndraw-flying-stop-sign-2015.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/AlignDRAW_-_Flying_stop_sign.png',
    alt: 'Suddiga, pixliga stoppskyltar svävande i blå himmel.',
    caption: 'alignDRAW — Mansimov et al., 2015. Världens första publicerade text-till-bild-genereringar, fem år före DALL-E. Prompt: "A stop sign is flying in blue skies".',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 1,
  },
  {
    filename: 'edmond-de-belamy.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Edmond_de_Belamy.png',
    alt: 'Suddigt GAN-porträtt av en fiktiv 1700-talsherre med suddiga ansiktsdrag.',
    caption: 'Edmond de Belamy — kollektivet Obvious, 2018. Första AI-konstverket auktionerat på Christie\'s. Sålt för $432 500 i oktober 2018.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 1,
  },
  {
    filename: 'stylegan-woman-1.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Woman_1.jpg',
    alt: 'Fotorealistiskt porträtt av en ung kvinna som inte finns på riktigt.',
    caption: 'StyleGAN — Nvidia (Karras et al.), 2019. Första gången AI-ansikten var omöjliga att skilja från riktiga foton — siten thispersondoesnotexist.com kom strax efter.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 1,
  },
  {
    filename: 'timeline-ai-faces-2014-2022.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Timeline-of-AI-generated-faces.png',
    alt: 'Tidslinje över AI-genererade ansikten från 2014 (suddiga gråskaliga) till 2022 (fotorealistiska).',
    caption: 'Tidslinje 2014–2022 — från Goodfellows första GAN-ansikten till diffusions-eran. Den kanoniska visualiseringen från Our World in Data.',
    attribution: 'CC BY 4.0 — Max Roser / Our World in Data via Wikimedia Commons',
    era: 1,
  },

  // ── Era 2: 2020-2022 — Diffusions-explosionen ────────────────
  {
    filename: 'dall-e-1-radish-tutu.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/DALL-E_radish.jpg',
    alt: 'Rutnät av tecknade rädisor i tutu som går med hundar i koppel.',
    caption: 'DALL-E 1 — OpenAI, januari 2021. Den ikoniska prompten "Baby daikon radish in a tutu walking a dog" från lanseringen — världens första virala text-till-bild-demo.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 2,
  },
  {
    filename: 'dall-e-sample.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/DALL-E_%28sample%29.jpg',
    alt: 'Tidigt DALL-E-genereringssample.',
    caption: 'DALL-E 1 sample — referenseksempel på vad första generationen klarade. Stilistiskt — men långt från fotorealism.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 2,
  },
  {
    filename: 'dall-e-2-teddy-bears-research.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/en/4/41/DALL-E_2_artificial_intelligence_digital_image_generated_photo.jpg',
    alt: 'Nallar i retrodykarutrustning som forskar i AI på 90-talets datorer under vatten.',
    caption: 'DALL-E 2 — OpenAI, april 2022. "Teddy bears doing AI research underwater 1990s tech" — en av lanseringens signaturprompter som visade upp DALL-E 2:s nya kvalitetshöjning.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 2,
  },
  {
    filename: 'dall-e-2-pearl-earring-variation.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/DALL-E_2_variation_1.png',
    alt: 'DALL-E 2-variation av Vermeers "Flickan med pärlörhänget".',
    caption: 'DALL-E 2 Variations — 2022. Funktionen "Variations" applicerad på ett av konsthistoriens mest ikoniska verk. Visade DALL-E 2:s förståelse för stil och komposition.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 2,
  },
  {
    filename: 'stable-diffusion-1-5-nightcity.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/NightCitySphere_%28SD1.5%29.jpg',
    alt: 'Glödande cyberpunk-stadssfär med neon-spiror.',
    caption: 'Stable Diffusion 1.5 — Stability AI, oktober 2022. Den första riktigt öppna text-till-bild-modellen — startade open source-revolutionen och Reddit-Discord-eran inom AI-art.',
    attribution: 'CC BY 4.0 — VulcanSphere via Wikimedia Commons',
    era: 2,
  },
  {
    filename: 'vqgan-clip-scenic-valley.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Scenic_Valley_in_the_Afternoon_Artistic_%28VQGAN%2BCLIP%29.jpg',
    alt: 'Surrealistisk målarisk dal med tallar och en å.',
    caption: 'VQGAN+CLIP — 2021–2023. Tekniken som födde AI-art-subkulturen på Twitter och Discord innan Stable Diffusion gjorde verktygen lättanvända.',
    attribution: 'CC BY 4.0 — VulcanSphere via Wikimedia Commons',
    era: 2,
  },

  // ── Era 3: 2022-2023 — Den virala kontrovers-eran ─────────────
  {
    filename: 'theatre-dopera-spatial.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Th%C3%A9%C3%A2tre_D%E2%80%99op%C3%A9ra_Spatial.jpg',
    alt: 'Cinematisk barockopera-scen med tre figurer som blickar mot en himmelsk portal.',
    caption: 'Théâtre D\'opéra Spatial — Jason Allen / Midjourney, augusti 2022. Vann digitala konstkategorin på Colorado State Fair och startade hela "är AI-konst riktig konst?"-debatten. US Copyright Office nekade upphovsrätt september 2023.',
    attribution: 'Public Domain (US Copyright Office) / Wikimedia Commons',
    era: 3,
  },
  {
    filename: 'pope-puffer-jacket.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Pope_Francis_in_puffy_winter_jacket.jpg',
    alt: 'Påve Franciskus i lång vit Balenciaga-liknande pufferjacka.',
    caption: 'Pope Drip — Midjourney v5, mars 2023. Spreds som riktigt foto till 20+ miljoner visningar innan debunk. Brukar kallas första massiva fallet av AI-misinformation.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 3,
  },
  {
    filename: 'trump-arrest-higgins.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Trump%E2%80%99s_arrest_%282%29.jpg',
    alt: 'Donald Trump som hålls fast av poliser i uniform.',
    caption: 'Trump-arresteringen — Eliot Higgins (Bellingcat) / Midjourney v5, mars 2023. Higgins blev avstängd från Midjourney efter att bildserien gått viral. Omformade debatten om deepfake-misinformation.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 3,
  },
  {
    filename: 'alice-and-sparkle-claw.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Alice-and-Sparkle-claw-hand.jpg',
    alt: 'Illustration ur barnbok av flicka med missbildad klo-liknande hand.',
    caption: 'Alice and Sparkle — Ammaar Reshi / ChatGPT + Midjourney, december 2022. Första virala "AI-skapade barnboken på en helg" — startade debatten om AI-flod på self-publishing-plattformar.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 3,
  },
  {
    filename: 'dall-e-2-wikipedia-variations.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/DALL-E_2_Generated_Variations_of_Wikipedia_Logo.png',
    alt: 'Wikipedia-logotypen och AI-genererade stilistiska varianter sida vid sida.',
    caption: 'DALL-E 2 Variations — 2022. Funktionen "Variations" applicerad på Wikipedias logotyp visar hur DALL-E 2 förstod stil utan att helt göra om koncept.',
    attribution: 'Public Domain (AI-del) + CC BY-SA 3.0 (logotyp) / Wikimedia Commons',
    era: 3,
  },

  // ── Era 4: 2023-2024 — Fotorealism-eran ─────────────────────
  {
    filename: 'dall-e-3-avocado-therapist.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/DALL-E_3_AI_image_of_an_avocado_speaking.png',
    alt: 'Avokado i terapeut-stol som säger "I just feel so empty inside" — kärnan saknas, en sked tar anteckningar.',
    caption: 'DALL-E 3 — OpenAI, september 2023. Visade upp koherent text-rendering och konceptuell humor för första gången. Markerade slutet på "AI kan inte skriva text"-eran.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 4,
  },
  {
    filename: 'sdxl-nightcity.jpg',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/NightCitySphere_%28SDXL%29.jpg',
    alt: 'Mer polerad och högupplöst cyberpunk-stadssfär än 2022-versionen.',
    caption: 'SDXL vs SD 1.5 — direkt jämförelse mot samma scen ovan. Visar kvalitetshoppet på under ett år inom open-source.',
    attribution: 'CC BY 4.0 — VulcanSphere via Wikimedia Commons',
    era: 4,
  },
  {
    filename: 'frontiers-ai-rat-figure.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/AI_generated_figure_published_in_a_Frontiers_journal.png',
    alt: 'Tecknad råtta med groteskt överdimensionerade, anatomiskt omöjliga testiklar, märkt med nonsens-biologi-termer.',
    caption: 'Frontiers-råttan — Midjourney, februari 2024. Publicerad i peer-reviewed Frontiers-tidskrift innan den drogs tillbaka. Globalt symbol för AI-slop inom akademisk publicering.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 4,
  },
  {
    filename: 'flux-1-1-pro-sunset-valley.webp',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Sunset_Valley_%28FLUX_1.1_Pro_Raw%29.webp',
    alt: 'Fotorealistisk solnedgångsdal med flod, tallar och varmt eftermiddagsljus.',
    caption: 'FLUX 1.1 Pro — Black Forest Labs, november 2024. Modellen som passerade Midjourney v6 på fotorealism-benchmarks och blev favoriten i open source-communityt.',
    attribution: 'CC0 — VulcanSphere via Wikimedia Commons',
    era: 4,
  },

  // ── Era 5: 2024-2026 — Native multimodal / kontroll-eran ─────
  {
    filename: 'sd-3-5-astronaut-hiroshige.webp',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Astronaut_Riding_a_Horse_Hiroshige_%28SD3.5%29.webp',
    alt: 'Astronaut till häst i japansk trävoodblock-stil i stil med Hiroshige.',
    caption: 'Stable Diffusion 3.5 — Stability AI, oktober 2024. Open-source-modellerna fortsatte hänga med de stängda labben — här med stilistisk kontroll på en helt annan nivå.',
    attribution: 'CC0 — VulcanSphere via Wikimedia Commons',
    era: 5,
  },
  {
    filename: 'sd-3-5-astronaut-horse.webp',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Astronaut_Riding_a_Horse_%28SD3.5%29.webp',
    alt: 'Fotorealistisk astronaut på häst — samma prompt, senaste SD-generationen.',
    caption: 'SDXL → SD 3.5 — A/B-jämförelse på samma kanoniska prompt. Visar fotorealism-tröskeln överskridas inom open source mellan 2023 och 2024.',
    attribution: 'CC0 — VulcanSphere via Wikimedia Commons',
    era: 5,
  },
  {
    filename: 'gpt-image-1-flying-stop-sign-2025.png',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/A_stop_sign_is_flying_in_blue_skies_%28GPT_Image_1%29.png',
    alt: 'Nästan fotorealistisk stoppskylt som svävar i blå himmel.',
    caption: 'GPT Image 1 — OpenAI, april 2025. Samma prompt som alignDRAW 2015 ("A stop sign is flying in blue skies") — 10 år senare och inbakad direkt i ChatGPT.',
    attribution: 'Public Domain (AI-genererad) / Wikimedia Commons',
    era: 5,
  },
  {
    filename: 'imagen-4-illuminated-valley.webp',
    sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Illuminated_Valley_in_the_Afternoon_%28Imagen_4.0%29.webp',
    alt: 'Yosemite-liknande dal med gyllene eftermiddagsljus, flod och tallskog i målerisk Albert Bierstadt-stil.',
    caption: 'Google Imagen 4 — maj 2025. Googles flagskepps-modell jämförd här med samma scen från FLUX och SD 3.5 — visar hur de tre största laboratorierna 2025 konvergerade mot fotorealism.',
    attribution: 'CC0 — VulcanSphere via Wikimedia Commons',
    era: 5,
  },
];

function contentTypeFor(filename: string): string {
  switch (extname(filename).toLowerCase()) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png':  return 'image/png';
    case '.webp': return 'image/webp';
    case '.gif':  return 'image/gif';
    default:      return 'application/octet-stream';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** List existing files in galleri/ so we can resume without re-downloading. */
async function existingGalleriKeys(): Promise<Set<string>> {
  const { data, error } = await db.storage.from(BUCKET).list('galleri', { limit: 1000 });
  if (error) {
    console.warn(`list galleri/ failed: ${error.message} (continuing without resume cache)`);
    return new Set();
  }
  return new Set((data ?? []).map((f) => f.name));
}

async function downloadAndUpload(item: GalleryItem): Promise<string> {
  // Wikimedia blocks default fetch User-Agent — needs a contact-string UA.
  const res = await fetch(item.sourceUrl, {
    headers: {
      'User-Agent': 'AI-Magasinet/1.0 (https://aimagasinet.se; kontakt@aimagasinet.se)',
    },
  });
  if (!res.ok) throw new Error(`download ${item.sourceUrl}: ${res.status} ${res.statusText}`);
  const bytes = new Uint8Array(await res.arrayBuffer());

  const key = `galleri/${item.filename}`;
  const { error } = await db.storage.from(BUCKET).upload(key, bytes, {
    contentType: contentTypeFor(item.filename),
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  return pub.publicUrl;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function figureFor(item: GalleryItem, hostedUrl: string): string {
  return [
    '<figure class="ai-gallery-figure">',
    `  <img src="${hostedUrl}" alt="${escapeHtml(item.alt)}" loading="lazy" />`,
    '  <figcaption>',
    `    <strong>${escapeHtml(item.caption)}</strong>`,
    `    <span class="ai-gallery-credit">${escapeHtml(item.attribution)}</span>`,
    '  </figcaption>',
    '</figure>',
  ].join('\n');
}

function buildArticleHtml(hosted: Map<string, string>): string {
  const byEra = (n: 1|2|3|4|5) =>
    GALLERY.filter((g) => g.era === n && hosted.has(g.filename));

  const intro = `
<p>När Ian Goodfellow visade sina första GAN-genererade ansikten 2014 var de suddiga, gråskaliga och knappt mänskliga. Tolv år senare konkurrerar AI-bilder med proffsfotografer om jobb — och vinner ibland. Den här artikeln samlar 28 ikoniska AI-genererade bilder från 2005 till 2026, från Electric Sheep-fraktaler till Imagen 4-landskap — den faktiska resan i bilder du kan se, inte bara höra talas om.</p>
<p>Varje bild har sin egen historia: varför den blev viral, vad den triggade i AI-bildvärlden, och varför den fortfarande är viktig att förstå. Tillsammans är de en miniutställning över de senaste tolv årens vattendelarögonblick. Alla bilder är hämtade från Wikimedia Commons under fria licenser och attribuerade i bildtexterna.</p>
`.trim();

  const section1 = `
<h2>Era 1: 2014–2018 — GAN-eran och tidig generativ konst</h2>
<p>GAN-tekniken (Generative Adversarial Networks) presenterades av Ian Goodfellow 2014 och förändrade allt. Två neurala nätverk som tävlade mot varandra — en generator och en kritiker — visade sig kunna lära sig att skapa bilder från brus. De första åren var resultaten suddiga och pixliga, men inom fyra år var GAN-ansikten omöjliga att skilja från fotografier. Tidsperioden började också etablera AI-konst som något auktionshus kunde sälja på riktigt.</p>
${byEra(1).map((g) => figureFor(g, hosted.get(g.filename)!)).join('\n')}
<p>Edmond de Belamy markerade ögonblicket när AI-konst fick monetärt erkännande. Christie\'s auktionerade ut det fiktiva 1700-talsporträttet för $432 500 — 45 gånger högre än utropspriset. Året efter hade <a href="https://aimagasinet.se/ai-verktyg/ai-bild-verktyg">Nvidia\'s StyleGAN</a> tagit ansiktsteknologin så långt att thispersondoesnotexist.com kunde generera nya, övertygande mänskliga ansikten i webbläsaren på varje sidladdning.</p>
`.trim();

  const section2 = `
<h2>Era 2: 2020–2022 — Diffusions-explosionen</h2>
<p>2021 ändrades reglerna. OpenAI presenterade DALL-E och visade världen vad text-till-bild faktiskt kunde betyda för vanliga människor. Mellan januari 2021 och augusti 2022 gick AI-bildgenerering från GPT-3:s lillebror till tre konkurrerande modellfamiljer — DALL-E, Midjourney och Stable Diffusion — som alla nådde tröskeln "användbar för riktiga projekt".</p>
${byEra(2).map((g) => figureFor(g, hosted.get(g.filename)!)).join('\n')}
<p>Stable Diffusion-lanseringen i augusti 2022 var den verkliga vattenleden. Stability AI släppte vikterna som open source — för första gången kunde vem som helst köra en konkurrenskraftig text-till-bild-modell på en konsument-GPU. Inom veckor exploderade Reddit-, Discord- och Twitter-communityt. Verktyget som tidigare krävde discord-credits hos Midjourney kostade nu enbart elen för en grafikkort-render.</p>
`.trim();

  const section3 = `
<h2>Era 3: 2022–2023 — Den virala kontrovers-eran</h2>
<p>När AI-bilder blev tillräckligt bra för att lura människor kom kontroverserna. Théâtre D\'opéra Spatial vann Colorado State Fair i augusti 2022 och utlöste den globala "är AI-konst verklig konst?"-debatten — som inte är slut än. Sex månader senare visade Pope Drip och de fejkade Trump-arrestbilderna att samma teknik kunde lura miljoner på timmar.</p>
${byEra(3).map((g) => figureFor(g, hosted.get(g.filename)!)).join('\n')}
<p>Det som följde var en uppvaknande för plattformarna. Eliot Higgins från Bellingcat blev avstängd från Midjourney efter Trump-arrest-serien — inte för att han lurade någon på riktigt utan för att han uppenbarade exakt hur trivialt det var att skapa övertygande fejk-nyhetsbilder. Mars 2023 betraktas av vissa medieforskare som AI-misinformationens "noll-dag". Pope-bilden, å andra sidan, gav en mer underhållande lärdom: vi var inte ens beredda att tvivla på en bild som rimligt påvar-päls.</p>
`.trim();

  const section4 = `
<h2>Era 4: 2023–2024 — Fotorealismens tröskelvärde</h2>
<p>DALL-E 3 lanserades i september 2023 och löste två problem som AI-bilder hade brottats med sedan starten: koherent text-rendering och prompt-följsamhet. Avokado-terapeuten kunde säga "I just feel so empty inside" med läsbar bokstavering — något DALL-E 2 hade kämpat med. Samma år släpptes Stable Diffusion XL som lyfte open source-modellerna i nivå med de stängda labben.</p>
${byEra(4).map((g) => figureFor(g, hosted.get(g.filename)!)).join('\n')}
<p>Den mörka sidan av eran var "AI slop" — Frontiers-tidskriftens råttbild blev den globala symbolen efter att ha publicerats i en peer-reviewed artikel innan tidskriften drog tillbaka studien. Black Forest Labs lanserade samtidigt FLUX i augusti 2024 och tog open source-tronen från Stable Diffusion — modellen som många bildskapare 2026 fortfarande använder som standardval för fotorealistiska scener.</p>
`.trim();

  const section5 = `
<h2>Era 5: 2024–2026 — Native multimodal och kontroll</h2>
<p>Den nuvarande eran handlar inte längre om grundläggande kvalitet — den är löst. Den handlar om kontroll: kan modellen rendera exakt din text i exakt din font, hålla samma karaktär konsistent över fem bilder, eller exportera 3D-data du kan vrida på i Blender? 2025 års tre stora releaser — Imagen 4, FLUX 1.1, Stable Diffusion 3.5 och GPT Image 1 inbakat i ChatGPT — markerar punkten där modellerna konvergerade.</p>
${byEra(5).map((g) => figureFor(g, hosted.get(g.filename)!)).join('\n')}
<p>Branscheffekten är konkret 2026: stockfoto-marknaden har kollapsat (Adobe Stock har integrerat Firefly direkt, Getty processar fortfarande sina rättstvister mot Stability AI), illustratör-yrket har splittrats mellan de som vägrar och de som integrerar, och Hollywood förhandlar fortfarande nya avtal med Writers Guild och SAG-AFTRA om vad som är AI-genererat respektive AI-assisterat material.</p>
`.trim();

  const conclusion = `
<h2>Var står vi 2026?</h2>
<p>De stora återstående utmaningarna är konsistens (samma karaktär över flera bilder utan modell-finetuning), exakt typografi över längre textsegment och kontroll av komposition på pixel-nivå. Det är därför verktyg som <a href="https://aimagasinet.se/ai-verktyg/ai-bild-verktyg/midjourney">Midjourney v7</a>, <a href="https://aimagasinet.se/ai-verktyg/ai-bild-verktyg/dalle">DALL-E 3</a> och <a href="https://aimagasinet.se/ai-verktyg/ai-bild-verktyg">Ideogram 3</a> har börjat skifta fokus från råkvalitet till editor-funktioner: image-to-image, inpainting, character consistency och 3D-export.</p>
<p>Vart är vi på väg? Bildgenereringen smälter samman med video — <a href="https://aimagasinet.se/ai-video">Sora och Veo</a> visade redan 2024 att samma underliggande modeller som genererar still-bilder kan göra fyra sekunder rörlig film. 2026 ser ut att bli året då samma sak händer för 3D-modeller direkt från prompt. Vi kommer också att se mer kontroll: ControlNet, sketch-to-image och text-i-bild på exakt position blir standard-funktioner snarare än specialverktyg.</p>
<p>De 28 bilderna ovan är inte bara konstverk — de är fotavtryck av en teknik som accelererade från lab-experiment till mainstream på tolv år. Nästa generationer kommer titta tillbaka på Goodfellows GAN-ansikten på samma sätt som vi tittar på första foton från Daguerreotypin: suddiga och primitiva, men de bevisade att tekniken var möjlig. Var <a href="https://aimagasinet.se/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier">AI-bilder används för sociala medier</a> i dag är bara början på det nästa decennium kommer få oss att vänja oss vid.</p>
`.trim();

  return [intro, section1, section2, section3, section4, section5, conclusion].join('\n\n');
}

async function main() {
  console.log(`Downloading + uploading ${GALLERY.length} images (resume-aware, 1.5s delay)…\n`);

  const alreadyUploaded = await existingGalleriKeys();
  const hosted = new Map<string, string>();
  let ok = 0, skipped = 0, failed = 0;

  for (let i = 0; i < GALLERY.length; i++) {
    const g = GALLERY[i];
    const tag = `[${i + 1}/${GALLERY.length}]`;
    try {
      if (alreadyUploaded.has(g.filename)) {
        const { data: pub } = db.storage.from(BUCKET).getPublicUrl(`galleri/${g.filename}`);
        hosted.set(g.filename, pub.publicUrl);
        console.log(`  ${tag} SKIP ${g.filename} (already uploaded)`);
        skipped++;
        continue;
      }
      const url = await downloadAndUpload(g);
      hosted.set(g.filename, url);
      console.log(`  ${tag} OK ${g.filename}`);
      ok++;
      // Stay well under Wikimedia's bot rate limit. 1.5s/req ≈ 40 req/min.
      await sleep(1500);
    } catch (e) {
      console.error(`  ${tag} FAILED ${g.filename}: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
  }
  console.log(`\nUpload: ${ok} new, ${skipped} already-uploaded, ${failed} failed.\n`);

  // Drop any failed entries from the gallery so the HTML rewrite only
  // references images that were actually uploaded.
  const surviving = GALLERY.filter((g) => hosted.has(g.filename));
  if (surviving.length < GALLERY.length * 0.8) {
    console.error(`Only ${surviving.length}/${GALLERY.length} survived — aborting before rewrite.`);
    process.exit(1);
  }
  if (surviving.length < GALLERY.length) {
    console.warn(`Continuing with ${surviving.length}/${GALLERY.length} images (${failed} failed).`);
  }

  console.log('Building new content_mdx…');
  const html = buildArticleHtml(hosted);
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  ${wordCount} ord, ${html.length} bytes.`);

  const { data, error } = await db
    .from('articles')
    .update({ content_mdx: html })
    .eq('slug', SLUG)
    .select('id,slug,path');
  if (error) { console.error('update failed:', error.message); process.exit(1); }
  if (!data || data.length === 0) {
    console.error(`No article found with slug=${SLUG}.`);
    process.exit(1);
  }
  console.log(`OK → ${data[0].path} (id=${data[0].id}) content_mdx updated with embedded gallery.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
