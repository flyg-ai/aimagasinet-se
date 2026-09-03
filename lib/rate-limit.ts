/**
 * Minimal fixed-window rate limiter for API-rutter.
 *
 * Rakningen ligger i processminnet. Pa Vercel betyder det per instans, inte
 * globalt — tva samtidiga instanser har varsin rakning, och en kall start
 * nollstaller. Det ar alltsa inget skydd mot en distribuerad attack, men det
 * racker mot det realistiska fallet: nagon som loopar anrop fran en maskin mot
 * en rutt som kostar pengar per anrop. Ett riktigt globalt tak kraver delad
 * lagring (KV/Redis), vilket projektet inte har i dag.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Utan stadning vaxer kartan sa lange instansen lever. Vi rensar utgangna
 *  poster nar den blir stor i stallet for pa timer — rutten ar enda
 *  anroparen, sa det racker att gora det pa vagen in. */
const MAX_KEYS = 5000;

function prune(now: number) {
  // forEach i stallet for for...of: tsconfig saknar downlevelIteration.
  buckets.forEach((b, k) => {
    if (b.resetAt <= now) buckets.delete(k);
  });
  // Fortfarande for stor efter rensning: nagon spammar unika nycklar. Kasta
  // allt hellre an att lata minnet vaxa fritt.
  if (buckets.size > MAX_KEYS) buckets.clear();
}

export type RateLimitResult = {
  ok: boolean;
  /** Sekunder tills fonstret oppnar igen. 0 nar ok. */
  retryAfter: number;
  /** Anrop kvar i fonstret. */
  remaining: number;
};

/** Rakna ett anrop mot `key`. Returnerar ok:false nar taket ar natt. */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  if (buckets.size > MAX_KEYS / 2) prune(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0, remaining: limit - 1 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      remaining: 0,
    };
  }
  return { ok: true, retryAfter: 0, remaining: limit - bucket.count };
}

/** Klientens IP ur Vercels proxyheaders. Faller tillbaka pa en delad nyckel
 *  nar ingen IP gar att lasa — da delar de anroparna pa ett tak, vilket ar
 *  ratt hall att fela at for en rutt som kostar pengar. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip')?.trim() || 'okand';
}
