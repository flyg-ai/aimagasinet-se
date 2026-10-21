import type { Metadata } from 'next';
import { AiOrRealQuiz } from '@/components/AiOrRealQuiz';
import { EmbedAutoHeight } from '@/components/IframeAutoHeight';
import { AI_ELLER_AKTA_ROUNDS } from '@/lib/ai-eller-akta-quiz';

/** Bare version of /quiz/ai-eller-akta/, meant only to be iframed inside an
 *  article (see sa-ser-du-om-en-bild-ar-fejk). noindex so it doesn't compete
 *  with the standalone page as duplicate content. ChromeFrame in RootLayout
 *  strips the global header/ticker/footer for every /embed/* path, and
 *  EmbedAutoHeight reports the real content height to the parent page so
 *  the iframe can size itself exactly instead of using a fixed height. */
export const metadata: Metadata = {
  title: 'AI eller äkta? — inbäddat quiz',
  robots: { index: false, follow: false },
};

export default function AiEllerAktaEmbed() {
  return (
    <EmbedAutoHeight>
      <div className="bg-page p-3 text-fg sm:p-4">
        <AiOrRealQuiz rounds={AI_ELLER_AKTA_ROUNDS} />
      </div>
    </EmbedAutoHeight>
  );
}
