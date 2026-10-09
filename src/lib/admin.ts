import { createHmac, timingSafeEqual } from 'node:crypto';
import type { APIContext } from 'astro';

export function setting(key: string): string {
  return process.env[key] || import.meta.env?.[key] || '';
}
export const cookieName = 'pqsr_admin';
export const sessionSeconds = 8 * 60 * 60;
export function adminConfigured() {
  return setting('ADMIN_PASSWORD').length >= 8 && setting('ADMIN_SESSION_SECRET').length >= 32;
}
export function equal(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function signature(value: string) {
  return createHmac('sha256', setting('ADMIN_SESSION_SECRET'))
    .update(`${value}:${setting('ADMIN_PASSWORD')}`).digest('hex');
}
export function newSession() {
  const expires = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  return `${expires}.${signature(expires)}`;
}
export function authenticated(context: Pick<APIContext, 'cookies'>) {
  if (!adminConfigured()) return false;
  const token = context.cookies.get(cookieName)?.value || '';
  const [expires, digest] = token.split('.');
  return /^\d+$/.test(expires || '') && Number(expires) > Date.now() / 1000
    && equal(digest || '', signature(expires));
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
  } });
}
