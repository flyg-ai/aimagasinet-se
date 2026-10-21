import type { QuizRound } from '@/components/AiOrRealQuiz';

const BUCKET =
  'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/quiz';

export const AI_ELLER_AKTA_ROUNDS: QuizRound[] = [
  {
    id: 'portratt',
    imageUrl: `${BUCKET}/real-1-portratt.webp`,
    isAI: false,
    explanation: 'Äkta foto från Unsplash, taget med vanlig kamera i naturligt ljus.',
  },
  {
    id: 'portratt-ai',
    imageUrl: `${BUCKET}/ai-1-portratt.webp`,
    isAI: true,
    explanation: 'AI-genererat porträtt — den jämna, nästan för symmetriska hudtonen och det perfekt motiverade motljuset är klassiska tecken.',
  },
  {
    id: 'mat',
    imageUrl: `${BUCKET}/real-2-mat.webp`,
    isAI: false,
    explanation: 'Äkta foto från Unsplash — lägg märke till handens och gaffelns naturliga oregelbundenhet.',
  },
  {
    id: 'mat-ai',
    imageUrl: `${BUCKET}/ai-2-mat.webp`,
    isAI: true,
    explanation: 'AI-genererad matbild — moderna modeller klarar numera händer och bestick förvånansvärt bra, vilket gör den här svårare än den brukade vara.',
  },
  {
    id: 'hund',
    imageUrl: `${BUCKET}/real-3-hund.webp`,
    isAI: false,
    explanation: 'Äkta foto från Unsplash av en golden retriever.',
  },
  {
    id: 'hund-ai',
    imageUrl: `${BUCKET}/ai-3-hund.webp`,
    isAI: true,
    explanation: 'AI-genererad hundbild — päls och ljussättning är båda imponerande konsekventa genom hela bilden.',
  },
  {
    id: 'landskap',
    imageUrl: `${BUCKET}/real-4-landskap.webp`,
    isAI: false,
    explanation: 'Äkta foto från Unsplash, ett bergslandskap i solnedgång.',
  },
  {
    id: 'landskap-ai',
    imageUrl: `${BUCKET}/ai-4-landskap.webp`,
    isAI: true,
    explanation: 'AI-genererat landskap — landskap och himlar hör till det AI-bildmodeller är allra bäst på, därför är de ofta svårast att avslöja.',
  },
  {
    id: 'kok',
    imageUrl: `${BUCKET}/real-5-kok.webp`,
    isAI: false,
    explanation: 'Äkta foto från Unsplash av ett riktigt kök — fast medvetet "för perfekt" inrett, vilket gör den här klurig.',
  },
  {
    id: 'kok-ai',
    imageUrl: `${BUCKET}/ai-5-kok.webp`,
    isAI: true,
    explanation: 'AI-genererat kök — notera att både den äkta och den AI-genererade bilden i den här rundan ser "för perfekta" ut, vilket visar hur opålitligt det tecknet ensamt är.',
  },
];
