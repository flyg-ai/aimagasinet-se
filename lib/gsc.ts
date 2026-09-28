import { createSign } from 'node:crypto';

/**
 * Minimal Search Console-klient: JWT-signering med servicekontots nyckel och
 * anrop mot Search Analytics API. Ingen extra dependency (googleapis är tung)
 * — bara node:crypto och fetch. Ren TypeScript utan server-only-gate, så den
 * går att köra både från Next.js-rutter och fristående tsx-analysskript.
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

function base64url(input: Buffer | string): string {
  const b = typeof input === 'string' ? Buffer.from(input) : input;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} saknas i miljövariablerna`);
  return v;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/** Hämtar en access-token via JWT-bearer-flödet, cachad i minnet tills strax innan den går ut. */
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;

  const clientEmail = env('GSC_CLIENT_EMAIL');
  const privateKey = env('GSC_PRIVATE_KEY');
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const signature = base64url(createSign('RSA-SHA256').update(`${header}.${payload}`).sign(privateKey));
  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Tokenbyte misslyckades (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export type GscRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscQueryOpts = {
  startDate: string;
  endDate: string;
  dimensions?: ('query' | 'page' | 'date' | 'country' | 'device')[];
  /** Filtrera på en specifik sida (dimensionFilterGroups mot dimension "page"). */
  page?: string;
  rowLimit?: number;
  startRow?: number;
};

/** Sökanalys mot Search Console för egendomen i GSC_SITE_URL. */
export async function querySearchAnalytics(opts: GscQueryOpts): Promise<GscRow[]> {
  const siteUrl = env('GSC_SITE_URL');
  const token = await getAccessToken();
  const body: Record<string, unknown> = {
    startDate: opts.startDate,
    endDate: opts.endDate,
    dimensions: opts.dimensions ?? ['query'],
    rowLimit: opts.rowLimit ?? 1000,
    startRow: opts.startRow ?? 0,
  };
  if (opts.page) {
    body.dimensionFilterGroups = [{ filters: [{ dimension: 'page', operator: 'equals', expression: opts.page }] }];
  }
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  if (!res.ok) throw new Error(`Search Console-anrop misslyckades (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { rows?: GscRow[] };
  return data.rows ?? [];
}

/** Listar egendomar servicekontot har åtkomst till — bra för att verifiera att uppkopplingen fungerar. */
export async function listSites(): Promise<{ siteUrl: string; permissionLevel: string }[]> {
  const token = await getAccessToken();
  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Kunde inte lista egendomar (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { siteEntry?: { siteUrl: string; permissionLevel: string }[] };
  return data.siteEntry ?? [];
}
