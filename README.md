# aimagasinet.se

Next.js 14 (App Router) + Supabase + Tailwind + TypeScript.

## Struktur

```
aimagasinet.se/
├── export/          # rådata från gamla WP-sajten (posts/pages/categories/tags/media)
└── web/             # Next.js-projektet (det här)
    ├── app/
    │   ├── page.tsx               # startsida — lista artiklar
    │   ├── [slug]/page.tsx        # artikel/sida
    │   └── kategori/[slug]/page.tsx
    ├── lib/supabase.ts            # Supabase-klienter (publik + admin)
    ├── scripts/import-wp.ts       # importer från ../export/*.json → Supabase
    └── supabase/migrations/0001_init.sql
```

## Komma igång

### 1. Supabase

1. Skapa ett projekt på [supabase.com](https://supabase.com).
2. Öppna **SQL Editor** → klistra in `supabase/migrations/0001_init.sql` → kör.
3. Kopiera `.env.local.example` till `.env.local` och fyll i:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role)

### 2. Importera WP-innehåll

```bash
npm run import
```

Läser `../export/{posts,pages,categories,tags,media}.json` och upsert:ar i tabellerna
`categories` och `articles`. Idempotent — säkert att köra om.

### 3. Kör dev-servern

```bash
npm run dev
```

→ <http://localhost:3000>

## Schema

| Tabell | Kolumner |
|--------|----------|
| `categories` | `slug` (pk), `name`, `description` |
| `articles`   | `id`, `slug`, `title`, `content_mdx`, `excerpt`, `category`→`categories.slug`, `tags text[]`, `featured_image`, `type` (`post`\|`page`), `published_at`, `seo_title`, `seo_description` |

RLS är på; publik läsning tillåten via `select`-policy. Skrivningar kräver service role.

## Noter

- **`content_mdx` innehåller WP-HTML** just nu, inte ren MDX. Fältnamnet är reserverat
  för en framtida konvertering. Rendering sker via `dangerouslySetInnerHTML` på
  `[slug]`-sidan.
- **Pages vs posts:** Båda lagras i `articles` med `type`-fältet. De ~45 "pages" från WP
  är i praktiken recensioner och guider, så de visas på samma sätt som vanliga posts.
- **Featured images:** Pekar tills vidare på `https://aimagasinet.se/wp-content/uploads/…`.
  Vill du serva lokalt: skriv en migrering som pekar om till `/uploads/…` och flytta
  in `../export/media/` under `public/uploads/`.
- **ISR:** Sidor revalideras var 5:e minut (`export const revalidate = 300`).
