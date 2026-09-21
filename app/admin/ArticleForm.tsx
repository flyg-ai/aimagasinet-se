'use client';

import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react';
import Link from 'next/link';
import type { AdminArticle } from '@/lib/admin/articles';
import { checkSlugAction, previewAction, publishAction, type Issue } from './actions';

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 155;
/** Server actions tar högst 4 MB (next.config.mjs). Större bilder skalas ner
 *  här före uppladdningen; servern optimerar sedan till 1200 px webp. */
const UPLOAD_MAX_BYTES = 3.5 * 1024 * 1024;
const DOWNSCALE_WIDTH = 2400;

/** Skalar ner en för stor bild i webbläsaren. Mindre filer skickas som de är. */
async function shrinkForUpload(file: File): Promise<File> {
  if (file.size <= UPLOAD_MAX_BYTES) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, DOWNSCALE_WIDTH / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.92, 0.85, 0.75]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', quality));
    if (blob && blob.size <= UPLOAD_MAX_BYTES) return new File([blob], 'cover.webp', { type: 'image/webp' });
  }
  throw new Error('Bilden är för stor även efter nedskalning. Välj en mindre bild.');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

/** ISO → värdet ett datetime-local-fält vill ha, i webbläsarens tidszon. */
function toLocalInput(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={value.length > max ? 'over' : 'hint'}>{value.length}/{max}</span>;
}

function Issues({ issues }: { issues: Issue[] }) {
  const hard = issues.filter((i) => i.hard);
  const warn = issues.filter((i) => !i.hard);
  return (
    <>
      {hard.length > 0 && (
        <div className="issues hard" role="alert">
          <b>Stoppar publicering</b>
          <ul>{hard.map((i, n) => <li key={n}>{i.message}</li>)}</ul>
        </div>
      )}
      {warn.length > 0 && (
        <div className="issues warn">
          <b>Varningar</b> <span className="hint">(stoppar inte publicering — sajtens innehållsregler)</span>
          <ul>
            {warn.map((i, n) => (
              <li key={n}>
                {i.blockIndex !== undefined
                  ? <>Stycke {i.blockIndex + 1}: {i.message.split(' — ')[0]}<div className="hint">”{i.block}”</div></>
                  : i.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

type Option = { slug: string; name: string };

export function ArticleForm({ categories, authors, defaultAuthor, initial }: { categories: Option[]; authors: Option[]; defaultAuthor: string; initial: AdminArticle | null }) {
  // Slugen raden sparats under. Efter första publiceringen redigerar formuläret den raden.
  const [savedSlug, setSavedSlug] = useState<string | null>(initial?.slug ?? null);
  const isNew = !savedSlug;
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [slugStatus, setSlugStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? '');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<string | null>(null);
  const [preview, setPreview] = useState<ReactNode>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => () => { if (coverUrl) URL.revokeObjectURL(coverUrl); }, [coverUrl]);

  function collect(): FormData {
    const fd = new FormData(formRef.current!);
    const local = String(fd.get('publishedLocal') ?? '');
    const d = local ? new Date(local) : new Date();
    fd.set('publishedAt', Number.isNaN(d.getTime()) ? local : d.toISOString());
    fd.delete('publishedLocal');
    if (savedSlug) fd.set('originalSlug', savedSlug);
    if (removeImage) fd.set('removeImage', '1');
    return fd;
  }

  function checkSlug(value: string) {
    if (!isNew || !value) return setSlugStatus(null);
    startTransition(async () => setSlugStatus(await checkSlugAction(value)));
  }

  function runPreview() {
    const fd = collect();
    fd.delete('image'); // bilden laddas bara upp vid publicering
    startTransition(async () => {
      const r = await previewAction(fd);
      setError(r.error ?? null);
      setIssues(r.issues ?? []);
      setPreview(r.node ?? null);
    });
  }

  function publish() {
    const fd = collect();
    setPublished(null);
    startTransition(async () => {
      const file = fd.get('image');
      if (file instanceof File && file.size > 0) {
        try {
          fd.set('image', await shrinkForUpload(file));
        } catch (e) {
          setError((e as Error).message);
          return;
        }
      }
      const r = await publishAction(fd);
      setError(r.error ?? null);
      setIssues(r.issues ?? []);
      if (r.url) {
        setPublished(r.url);
        setSavedSlug(r.url.replace(/^\/|\/$/g, ''));
        setSlugTouched(true);
      }
    });
  }

  return (
    <>
      <div className="adm">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h1>{isNew ? 'Ny artikel' : 'Redigera artikel'}</h1>
          <Link href="/admin/">← Alla artiklar</Link>
        </div>
        {initial && !initial.publishedAt && !published && <p className="over">Artikeln är avpublicerad. Publicera igen för att visa den.</p>}

        <form ref={formRef} onSubmit={(e) => { e.preventDefault(); publish(); }}>
          <label htmlFor="title">Rubrik</label>
          <input id="title" name="title" type="text" required value={title}
            onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
            onBlur={() => { if (!slugTouched) checkSlug(slug); }} />

          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" type="text" value={slug} readOnly={!isNew}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); setSlugStatus(null); }}
            onBlur={() => checkSlug(slug)} />
          <div className="hint">
            Adress: /{slug || '…'}/{' '}
            {!isNew ? '(går inte att ändra på en publicerad artikel)'
              : slugStatus && <span className={slugStatus.ok ? 'ok' : 'over'}>{slugStatus.message}</span>}
          </div>

          <label htmlFor="category">Kategori</label>
          <select id="category" name="category" defaultValue={initial?.category ?? ''} required>
            <option value="" disabled>Välj kategori</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>

          <label htmlFor="author">Skribent</label>
          <select id="author" name="author" defaultValue={initial?.author ?? defaultAuthor} required>
            {authors.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>

          <label htmlFor="excerpt">Ingress</label>
          <div className="hint">Lämnas den tom används första stycket i brödtexten.</div>
          <textarea id="excerpt" name="excerpt" defaultValue={initial?.excerpt ?? ''} />

          <label htmlFor="body">Brödtext</label>
          <textarea id="body" name="body" className="body" defaultValue={initial?.body ?? ''} required />
          <div className="hint">
            Klistra in Markdown (t.ex. direkt från ChatGPT) eller HTML. Rubriker blir H2/H3; skript, stilar och
            inbäddningar tas bort. Länkar till aimagasinet.se görs relativa; externa länkar får nofollow och öppnas i ny flik. Varje stycke med ett tal över tolv, procent eller belopp bör ha en källänk.
          </div>

          <label htmlFor="image">Omslagsbild</label>
          {initial?.image && !removeImage && !coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cover" src={initial.image} alt="" />
          )}
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cover" src={coverUrl} alt="" />
          )}
          <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setCoverUrl(f ? URL.createObjectURL(f) : null);
              if (f) setRemoveImage(false);
            }} />
          <div className="hint">JPG, PNG eller WebP, helst minst 1200 px bred och 16:9. Optimeras till webp (1200 px) och laddas upp vid publicering; stora filer skalas ner först. Utan bild visas artikeln utan omslag.</div>
          {initial?.image && (
            <label style={{ fontWeight: 400 }}>
              <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} /> Ta bort omslagsbilden
            </label>
          )}

          <label htmlFor="publishedLocal">Publiceringsdatum</label>
          <input id="publishedLocal" name="publishedLocal" type="datetime-local" defaultValue={toLocalInput(initial?.publishedAt ?? null)} />
          <div className="hint">Standard är nu. Får inte ligga i framtiden.</div>

          <label htmlFor="seoTitle">SEO-titel <Counter value={seoTitle} max={SEO_TITLE_MAX} /></label>
          <input id="seoTitle" name="seoTitle" type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <div className="hint">Tom = rubriken. Skriv utan &quot;| AI-Magasinet&quot; — det läggs på automatiskt.</div>

          <label htmlFor="seoDescription">SEO-beskrivning <Counter value={seoDescription} max={SEO_DESCRIPTION_MAX} /></label>
          <textarea id="seoDescription" name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} style={{ minHeight: 70 }} />
          <div className="hint">Tom = ingressen, kortad till {SEO_DESCRIPTION_MAX} tecken.</div>

          {error && <p className="over" role="alert">{error}</p>}
          <Issues issues={issues} />
          {published && (
            <div className="done">
              Publicerad: <a href={published} target="_blank" rel="noopener">{published}</a>
            </div>
          )}

          <div className="row" style={{ marginTop: 20 }}>
            <button type="button" className="btn ghost" disabled={pending} onClick={runPreview}>Förhandsgranska</button>
            <button type="submit" className="btn" disabled={pending}>{isNew ? 'Publicera' : 'Spara och publicera'}</button>
            {pending && <span className="hint">Arbetar …</span>}
          </div>
        </form>
      </div>

      {preview && (
        <div className="adm" style={{ width: 'min(1240px, calc(100% - 16px))' }}>
          <div className="preview">
            <div className="preview-label">Förhandsgranskning{coverUrl ? ' (den nya bilden visas först efter publicering)' : ''}</div>
            {preview}
          </div>
        </div>
      )}
    </>
  );
}
