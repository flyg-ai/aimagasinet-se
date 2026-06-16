import { CopyLinkButton } from '@/components/CopyLinkButton';

/* Lättviktig dela-rad: rena <a href>-länkar till plattformarnas share-URL:er.
 * Inga JS-SDK:er, inga tredjepartsscript, inga cookies, ingen tracking. Endast
 * "Kopiera länk" är en klient-knapp (navigator.clipboard). Inline-SVG → ingen
 * extra request, ingen layout shift. */

// Måste matcha metadataBase i app/layout.tsx — share-URL:en ska vara den
// kanoniska absoluta artikel-URL:en.
const SITE_ORIGIN = 'https://aimagasinet.se';

/** Kanonisk flat URL med trailing slash (next.config trailingSlash: true) så vi
 *  aldrig delar en redirectad path. */
function canonicalUrl(path: string): string {
  const flat = path === '/' || path.endsWith('/') ? path : `${path}/`;
  return `${SITE_ORIGIN}${flat}`;
}

// Brand-glyfer (simple-icons, CC0), 24×24 viewBox, fill=currentColor.
const ICONS: Record<string, string> = {
  X: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  Facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  LinkedIn:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  Threads:
    'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.291 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.629 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.36-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.234-2.721 1.32l-1.757-1.18c.98-1.453 2.574-2.252 4.493-2.252h.044c3.206.022 5.119 1.99 5.302 5.412.107.046.212.093.318.142 1.494.704 2.587 1.769 3.156 3.083.793 1.833.866 4.815-1.558 7.188-1.844 1.806-4.082 2.621-7.264 2.643Z',
  Reddit:
    'M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 1.062.638 1.974 1.545 2.39-.04.213-.062.432-.062.654 0 3.31 3.872 6.002 8.626 6.002s8.626-2.692 8.626-6.002c0-.222-.022-.444-.062-.657.905-.417 1.541-1.327 1.541-2.387zM6.776 13.595c0-.836.677-1.514 1.513-1.514s1.514.678 1.514 1.514-.678 1.514-1.514 1.514-1.513-.678-1.513-1.514zm8.117 4.503c-.997.997-2.91 1.075-3.47 1.075-.561 0-2.474-.078-3.47-1.075-.149-.149-.149-.391 0-.54.149-.149.391-.149.54 0 .63.63 1.974.85 2.93.85.956 0 2.3-.22 2.93-.85.149-.149.391-.149.54 0 .149.149.149.391 0 .54zm-.245-2.989c-.836 0-1.514-.678-1.514-1.514s.678-1.514 1.514-1.514 1.514.678 1.514 1.514-.678 1.514-1.514 1.514z',
};

const ICON_COLORS: Record<string, string> = {
  X: 'hover:text-black',
  Facebook: 'hover:text-[#1877F2]',
  LinkedIn: 'hover:text-[#0A66C2]',
  Threads: 'hover:text-black',
  Reddit: 'hover:text-[#FF4500]',
};

export function ShareButtons({ path, title }: { path: string; title: string }) {
  const url = canonicalUrl(path);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links: { name: string; href: string }[] = [
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'Threads', href: `https://www.threads.net/intent/post?text=${t}%20${u}` },
    { name: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
        Dela
      </span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={`Dela på ${l.name}`}
          title={`Dela på ${l.name}`}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-fg-muted transition-colors hover:border-indigo-300 hover:bg-indigo-50 ${ICON_COLORS[l.name] ?? ''}`}
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
            <path d={ICONS[l.name]} />
          </svg>
        </a>
      ))}
      <CopyLinkButton url={url} />
    </div>
  );
}
