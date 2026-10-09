import type { APIRoute } from 'astro';
import { adminConfigured, cookieName, equal, json, newSession, sameOrigin, sessionSeconds, setting } from '../../../lib/admin';
export const prerender = false;

// A bounded local throttle supplements a strong password; it is not a distributed rate limiter.
const attempts = new Map<string, { count: number; until: number }>();
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  if (!adminConfigured()) return json({ error: 'Configura ADMIN_PASSWORD (mínimo 8 caracteres) y ADMIN_SESSION_SECRET en .env.' }, 503);
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  for (const [ip, attempt] of attempts) if (attempt.until < now) attempts.delete(ip);
  const attempt = attempts.get(key);
  if (attempt && attempt.count >= 5) return json({ error: 'Demasiados intentos. Espera 15 minutos.' }, 429);
  let data: any;
  try { data = await request.json(); } catch { return json({ error: 'Solicitud no válida.' }, 400); }
  if (!equal(String(data.password || ''), setting('ADMIN_PASSWORD'))) {
    if (attempts.size > 1000) attempts.clear();
    attempts.set(key, { count: (attempt?.count || 0) + 1, until: attempt?.until || now + 15 * 60000 });
    return json({ error: 'Contraseña incorrecta.' }, 401);
  }
  attempts.delete(key);
  cookies.set(cookieName, newSession(), { path: '/', httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:', maxAge: sessionSeconds });
  return json({ ok: true });
};
export const DELETE: APIRoute = ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  cookies.delete(cookieName, { path: '/' });
  return json({ ok: true });
};
