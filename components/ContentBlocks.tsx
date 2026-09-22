/**
 * Innehållsblocken i brödtexten (lib/content-blocks.ts), renderade som
 * React på servern. Ingen klientkod: blocken finns färdiga i HTML:en.
 *
 * Topplistan slår upp sina verktyg i `reviews` (lib/review-refs.ts), som
 * ArticleTemplate hämtar i en fråga. Betyget är recensionens eget
 * (lib/review-score.ts) — samma siffra som recensionssidan visar.
 *
 * Stilarna ligger i app/globals.css (.cb-*, .toplist*, .guide-tools) med
 * sajtens tokens, så ljust och mörkt läge följer med.
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { to } from '@/lib/links';
import {
  imagePublicUrl, isExternalHref, parseInline,
  type Block, type CalloutBlock, type ChartBlock, type CompareBlock, type ImageBlock, type Source, type StepsBlock,
  type ToplistBlock,
} from '@/lib/content-blocks';
import { listScoreText, type ReviewScore } from '@/lib/review-score';
import { byScore, type ReviewIndex, type ReviewRef } from '@/lib/review-refs';

function A({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return isExternalHref(href)
    ? <a href={href} className={className} target="_blank" rel="nofollow noopener">{children}</a>
    : <a href={to(href)} className={className}>{children}</a>;
}

function Rich({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((n, i) =>
        n.t === 'text' ? n.v : n.t === 'b' ? <strong key={i}>{n.v}</strong> : <A key={i} href={n.href}>{n.v}</A>,
      )}
    </>
  );
}

function Sources({ items, label = 'Källa' }: { items?: Source[]; label?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <p className="cb-source">
      {items.length > 1 && label === 'Källa' ? 'Källor' : label}:{' '}
      {items.map((s, i) => (
        <span key={s.url + i}>{i > 0 && ', '}<A href={s.url}>{s.text}</A></span>
      ))}
    </p>
  );
}

export function ContentBlock({ block, reviews }: { block: Block; reviews: ReviewIndex }) {
  switch (block.type) {
    case 'toplist': return <Toplist b={block} reviews={reviews} />;
    case 'compare': return <Compare b={block} />;
    case 'steps': return <Steps b={block} />;
    case 'callout': return <Callout b={block} />;
    case 'chart': return <Chart b={block} />;
    case 'image': return <Figure b={block} />;
  }
}

// ── Verktygets logga och betyg (delas med "Verktyg i guiden") ──────────

export function ToolLogo({ tool, size = 44 }: { tool: ReviewRef; size?: number }) {
  if (tool.image) {
    return (
      <span className="tl-logo tl-logo-img" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tool.image} alt="" width={size} height={size} loading="lazy" decoding="async" />
      </span>
    );
  }
  return (
    <span className={`tl-logo tl-logo-initial ${tool.logoColor}`} style={{ width: size, height: size }} aria-hidden>
      {tool.initial}
    </span>
  );
}

/** "9.1/10", "Nedlagd" eller "Ej betygsatt" — aldrig en egen siffra. */
export function ScoreBadge({ score, compact = false }: { score: ReviewScore; compact?: boolean }) {
  const text = listScoreText(score);
  if (score.discontinued) return <span className="tl-score tl-score-off">{text}</span>;
  if (text == null) return <span className="tl-score tl-score-none">Ej betygsatt</span>;
  return (
    <span className="tl-score" aria-label={`Betyg ${text} av 10`}>
      <b>{text}</b>{!compact && <small>/10</small>}
    </span>
  );
}

// ── toplist ────────────────────────────────────────────────────────────

function Toplist({ b, reviews }: { b: ToplistBlock; reviews: ReviewIndex }) {
  // Okända recensioner stoppas av reglerna före publicering; skulle en
  // recension avpubliceras senare faller raden bort i stället för att visa fel.
  const found = b.items
    .map((it) => ({ it, tool: reviews.get(it.review) }))
    .filter((r): r is { it: typeof r.it; tool: ReviewRef } => !!r.tool);
  // "Vårt val" först i skriven ordning, sedan resten — efter betyg om inte
  // blocket uttryckligen vill ha redaktionens ordning.
  const featured = found.filter((r) => r.it.featured);
  const rest = found.filter((r) => !r.it.featured);
  if (b.sort === 'score') rest.sort((x, y) => byScore(x.tool, y.tool));
  const rows = [...featured, ...rest];
  if (rows.length === 0) return null;
  return (
    <section className="toplist cb-toplist not-prose" aria-label={b.title ?? 'Topplista'}>
      <div className="toplist-head">
        <span>{b.title ? <Rich text={b.title} /> : 'Topplista'}</span>
        <span>Betyg ur våra recensioner</span>
      </div>
      <ol className="cb-toplist-rows">
        {rows.map(({ it, tool }, i) => (
          <li key={tool.slug} className={`toplist-item${i === 0 || it.featured ? ' is-first' : ''}`}>
            <span className="toplist-rank" aria-hidden>{i + 1}</span>
            <div className="min-w-0">
              <div className="tl-tool">
                <ToolLogo tool={tool} />
                <div className="tl-tool-name">
                  <h3 className="toplist-name">
                    <Link href={to(tool.path)}>{tool.name}</Link>
                  </h3>
                  {tool.category && <span className="tl-cat">{tool.category}</span>}
                </div>
                <ScoreBadge score={tool.score} />
              </div>
              {it.featured && <span className="toplist-badge tl-pick">Vårt val</span>}{' '}
              {it.badge && <span className="toplist-badge"><Rich text={it.badge} /></span>}
              {it.text && <p className="toplist-desc"><Rich text={it.text} /></p>}
            </div>
            <div className="toplist-actions">
              {tool.affiliateUrl && !tool.score.discontinued && (
                <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="toplist-btn toplist-btn-primary">
                  Prova {tool.name} <span aria-hidden>↗</span>
                </a>
              )}
              <Link href={to(tool.path)} className="toplist-btn toplist-btn-ghost">
                Läs recensionen <span aria-hidden>→</span>
              </Link>
              {tool.affiliateUrl && !tool.score.discontinued && (
                <span className="tl-ad">Annonslänk: vi kan få provision.</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      {b.note && <div className="toplist-foot"><span><Rich text={b.note} /></span></div>}
    </section>
  );
}

// ── "Verktyg i guiden" (automatisk, inte ett block) ────────────────────

/** Minst så många recenserade verktyg innan listan visas. */
export const GUIDE_TOOLS_MIN = 3;

export function GuideTools({ tools }: { tools: ReviewRef[] }) {
  if (tools.length < GUIDE_TOOLS_MIN) return null;
  return (
    <nav className="guide-tools not-prose" aria-label="Verktyg i guiden">
      <h2>Verktyg i guiden</h2>
      <ul>
        {tools.map((t) => (
          <li key={t.slug}>
            <Link href={to(t.path)}>
              <ToolLogo tool={t} size={36} />
              <span className="guide-tools-name">
                <b>{t.name}</b>
                {t.category && <small>{t.category}</small>}
              </span>
              <ScoreBadge score={t.score} compact />
              <span className="guide-tools-arrow" aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p>Betygen är AI-Magasinets redaktionella bedömning i respektive recension.</p>
    </nav>
  );
}

// ── compare ────────────────────────────────────────────────────────────

type Status = 'yes' | 'no' | 'partial' | null;
function statusOf(value: string): Status {
  if (/^ja\b/i.test(value)) return 'yes';
  if (/^nej\b/i.test(value)) return 'no';
  if (/^delvis\b/i.test(value)) return 'partial';
  return null;
}

function StatusIcon({ s }: { s: Exclude<Status, null> }) {
  const path = s === 'yes' ? 'M5 12.5l4.5 4.5L19 7.5' : s === 'no' ? 'M7 7l10 10M17 7L7 17' : 'M6 12h12';
  return (
    <svg className="cb-status-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}

function Compare({ b }: { b: CompareBlock }) {
  return (
    <section className="cb cb-compare not-prose" aria-label={b.title ?? 'Jämförelse'}>
      {b.title && <p className="cb-title"><Rich text={b.title} /></p>}
      <div className="cb-compare-grid" data-n={b.cards.length}>
        {b.cards.map((c) => (
          <article key={c.title} className="cb-card">
            <h3>{c.title}</h3>
            {c.text && <p className="cb-card-text"><Rich text={c.text} /></p>}
            <dl>
              {c.rows.map((r) => {
                const s = statusOf(r.value);
                return (
                  <div key={r.label} className="cb-row">
                    <dt>{r.label}</dt>
                    <dd className={s ? `cb-status cb-${s}` : undefined}>
                      {s && <StatusIcon s={s} />}
                      <span><Rich text={r.value} /></span>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <Sources items={c.source} />
            {c.link && <A href={c.link.href} className="cb-more">{c.link.text ?? 'Läs mer'} <span aria-hidden>→</span></A>}
          </article>
        ))}
      </div>
      <Sources items={b.source} />
    </section>
  );
}

// ── steps ──────────────────────────────────────────────────────────────

function Steps({ b }: { b: StepsBlock }) {
  return (
    <section className="cb cb-steps not-prose" aria-label={b.title ?? 'Steg för steg'}>
      {b.title && <p className="cb-title"><Rich text={b.title} /></p>}
      <ol>
        {b.steps.map((s, i) => (
          <li key={s.title}>
            <span className="cb-step-no" aria-hidden>{i + 1}</span>
            <div>
              <h3>{s.href ? <A href={s.href}>{s.title}</A> : s.title}</h3>
              {s.text.map((t, j) => <p key={j}><Rich text={t} /></p>)}
              {s.items.length > 0 && <ul>{s.items.map((t, j) => <li key={j}><Rich text={t} /></li>)}</ul>}
              {s.after.map((t, j) => <p key={`a${j}`}><Rich text={t} /></p>)}
              <Sources items={s.source} />
            </div>
          </li>
        ))}
      </ol>
      <Sources items={b.source} />
    </section>
  );
}

// ── callout ────────────────────────────────────────────────────────────

const CALLOUT_LABEL = { tips: 'Tips', varning: 'Varning', info: 'Bra att veta' } as const;
const CALLOUT_ICON = {
  tips: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  varning: 'M12 3.5L2.5 20h19L12 3.5zM12 10v4.5M12 17.5v.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5.5M12 7.5v.01',
} as const;

function Callout({ b }: { b: CalloutBlock }) {
  return (
    <aside className={`cb cb-callout cb-callout-${b.variant} not-prose`} role="note" aria-label={CALLOUT_LABEL[b.variant]}>
      <div className="cb-callout-head">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={CALLOUT_ICON[b.variant]} />
        </svg>
        <span className="cb-callout-label">{CALLOUT_LABEL[b.variant]}</span>
      </div>
      {b.title && <p className="cb-callout-title"><Rich text={b.title} /></p>}
      {b.text.map((t, i) => <p key={i}><Rich text={t} /></p>)}
      {b.items.length > 0 && <ul>{b.items.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>}
    </aside>
  );
}

// ── chart ──────────────────────────────────────────────────────────────

function Chart({ b }: { b: ChartBlock }) {
  if (b.source.length === 0) return null; // ett diagram utan källa visas aldrig
  const max = Math.max(...b.items.map((i) => i.value)) || 1;
  return (
    <figure className="cb cb-chart not-prose">
      <figcaption className="cb-title"><Rich text={b.title} /></figcaption>
      <ul className="cb-bars">
        {b.items.map((it) => (
          <li key={it.label}>
            <span className="cb-bar-label">{it.label}</span>
            <span className="cb-bar-track" aria-hidden>
              <span className="cb-bar-fill" style={{ width: `${Math.max(1.5, (it.value / max) * 100)}%` }} />
            </span>
            <span className="cb-bar-value">{it.display}</span>
          </li>
        ))}
      </ul>
      {b.note && <p className="cb-note"><Rich text={b.note} /></p>}
      <Sources items={b.source} />
    </figure>
  );
}

// ── image ──────────────────────────────────────────────────────────────

/** Bilden i brödtexten: lat laddning och reserverat format (width/height),
 *  så att texten inte hoppar när bilden kommer. Samma vanliga <img> som
 *  resten av sajten använder för Storage-bilder. */
function Figure({ b }: { b: ImageBlock }) {
  return (
    <figure className="cb cb-image not-prose">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagePublicUrl(b.src)}
        alt={b.alt}
        width={b.width ?? 1600}
        height={b.height ?? 900}
        loading="lazy"
        decoding="async"
      />
      {b.caption && <figcaption><Rich text={b.caption} /></figcaption>}
    </figure>
  );
}
