import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = 'force-dynamic';

/** Enkel, fristående stil så att modulen inte beror på sajtens CSS-klasser. */
const CSS = `
.adm { width: min(1000px, calc(100% - 32px)); margin: 32px auto 64px; font-size: 15px; line-height: 1.5; }
.adm h1 { font-size: 26px; font-weight: 800; margin: 0 0 16px; }
.adm h2 { font-size: 19px; font-weight: 750; margin: 28px 0 10px; }
.adm label { display: block; font-weight: 650; margin: 16px 0 4px; }
.adm input[type=text], .adm input[type=password], .adm input[type=datetime-local], .adm select, .adm textarea {
  width: 100%; padding: 9px 11px; border: 1px solid #c9c9d6; border-radius: 8px; font: inherit; background: #fff; color: #111; }
.adm textarea { min-height: 90px; }
.adm textarea.body { min-height: 420px; font-family: ui-monospace, Consolas, monospace; font-size: 13px; }
.adm .hint { color: #5b5b6b; font-size: 13px; margin-top: 3px; }
.adm .over { color: #b3261e; font-weight: 700; }
.adm .ok { color: #1b7a3a; }
.adm .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; border: 1px solid #2a2350; background: #2a2350; color: #fff; font-weight: 700; cursor: pointer; text-decoration: none; }
.adm .btn.ghost { background: #fff; color: #2a2350; }
.adm .btn:disabled { opacity: .5; cursor: default; }
.adm .row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.adm table { width: 100%; border-collapse: collapse; }
.adm td, .adm th { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e3e3ec; vertical-align: top; }
.adm .issues { margin: 16px 0; padding: 12px 16px; border-radius: 8px; }
.adm .issues.hard { background: #fdecea; border: 1px solid #f1b0aa; }
.adm .issues.warn { background: #fff7e0; border: 1px solid #f0d58a; }
.adm .issues ul { margin: 6px 0 0 18px; list-style: disc; }
.adm .done { background: #e7f6ec; border: 1px solid #9fd5b0; padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
.adm .preview { margin-top: 24px; border: 2px dashed #c9c9d6; border-radius: 12px; overflow: hidden; }
.adm .preview-label { padding: 6px 12px; background: #f1f1f6; font-weight: 700; font-size: 13px; }
.adm .cover { max-width: 320px; border-radius: 8px; margin-top: 8px; display: block; }
`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {children}
    </>
  );
}
