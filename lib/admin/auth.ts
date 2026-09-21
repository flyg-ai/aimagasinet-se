/**
 * Inloggning för /admin: ett lösenord (ADMIN_PASSWORD) och en HMAC-signerad
 * sessionscookie (ADMIN_SESSION_SECRET). Utan båda variablerna — eller med en
 * för kort hemlighet — är hela /admin avstängt och svarar 404.
 *
 * Bara server-side. Varje sida under /admin anropar requireAdminPage() och
 * varje server action isAdmin() innan den gör något.
 */
import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

const COOKIE = 'admin_session';
const COOKIE_PATH = '/admin';
const SESSION_SECONDS = 12 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= MIN_SECRET_LENGTH ? s : null;
}

export function adminEnabled(): boolean {
  return !!process.env.ADMIN_PASSWORD && !!secret();
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  // Hasha först så att längden inte läcker och timingSafeEqual får lika långa buffertar.
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

function validToken(token: string | undefined): boolean {
  const key = secret();
  if (!key || !token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (!safeEqual(sig, sign(`v1.${exp}`, key))) return false;
  return Number(exp) > Math.floor(Date.now() / 1000);
}

/** För server actions: sant bara med giltig session och påslagen modul. */
export function isAdmin(): boolean {
  if (!adminEnabled()) return false;
  return validToken(cookies().get(COOKIE)?.value);
}

/** För sidor: 404 om modulen är avstängd, annars till inloggningen utan session. */
export function requireAdminPage(): void {
  if (!adminEnabled()) notFound();
  if (!validToken(cookies().get(COOKIE)?.value)) redirect('/admin/login/');
}

// ── Spärr mot upprepade felförsök ──────────────────────────────────────
// Per IP och i minnet: räcker mot enkel gissning, men nollställs när en
// serverlös instans startar om och delas inte mellan instanser.
const failures = new Map<string, { count: number; until: number }>();

function clientIp(): string {
  const h = headers();
  return (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? 'okänd').trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(password: string): Promise<LoginResult> {
  const key = secret();
  const expected = process.env.ADMIN_PASSWORD;
  if (!key || !expected) return { ok: false, error: 'Admin är avstängt.' };

  const ip = clientIp();
  const now = Date.now();
  const f = failures.get(ip);
  if (f && f.until > now) {
    return { ok: false, error: `För många försök. Vänta ${Math.ceil((f.until - now) / 1000)} sekunder.` };
  }

  if (!safeEqual(password, expected)) {
    const count = (f?.count ?? 0) + 1;
    // 1, 2, 4, 8 … sekunder, högst 15 minuter.
    failures.set(ip, { count, until: now + Math.min(2 ** (count - 1) * 1000, 15 * 60_000) });
    if (failures.size > 10_000) failures.clear();
    await sleep(500);
    return { ok: false, error: 'Fel lösenord.' };
  }

  failures.delete(ip);
  const exp = Math.floor(now / 1000) + SESSION_SECONDS;
  cookies().set(COOKIE, `${exp}.${sign(`v1.${exp}`, key)}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: COOKIE_PATH,
    maxAge: SESSION_SECONDS,
  });
  return { ok: true };
}

export function logout(): void {
  cookies().set(COOKIE, '', { httpOnly: true, secure: true, sameSite: 'strict', path: COOKIE_PATH, maxAge: 0 });
}
