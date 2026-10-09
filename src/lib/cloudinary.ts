import { createHash, randomUUID } from 'node:crypto';
import { setting } from './admin.ts';

const prefix = 'pqsr/channels/';
export const themes = ['pink', 'yellow', 'paper', 'lime', 'blue'] as const;
// Rotate the brand palette deterministically; no image analysis or external API.
export function automaticTheme(position: number): typeof themes[number] {
  return themes[Math.max(0, Math.floor(position)) % themes.length];
}
export interface Channel {
  id: string; href: string; image: string; imageAlt: string;
  order: number; theme: typeof themes[number]; enabled: boolean;
}
export function cloudConfigured() {
  return ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].every(key => !!setting(key));
}
function cloud() {
  if (!cloudConfigured()) throw new Error('Completa los tres campos de Cloudinary en .env.');
  return encodeURIComponent(setting('CLOUDINARY_CLOUD_NAME'));
}
function assetId(id: string) {
  if (!/^pqsr\/channels\/[a-zA-Z0-9_-]{1,80}$/.test(id)) throw new Error('Tarjeta no válida.');
  return id;
}
function signed(params: Record<string, string>) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const values: Record<string, string> = { ...params, timestamp };
  const text = Object.keys(values).sort().map(key => `${key}=${values[key]}`).join('&');
  const signature = createHash('sha1').update(text + setting('CLOUDINARY_API_SECRET')).digest('hex');
  return { ...values, signature, api_key: setting('CLOUDINARY_API_KEY') };
}
async function result(response: Response) {
  if (!response.ok) throw new Error('Cloudinary no pudo completar la operación. Revisa las credenciales y los límites de tu cuenta.');
  return response.json();
}
export async function listChannels(): Promise<Channel[]> {
  let cursor: string | undefined;
  const resources: any[] = [];
  do {
    const url = new URL(`https://api.cloudinary.com/v1_1/${cloud()}/resources/image/upload`);
    url.searchParams.set('prefix', prefix);
    url.searchParams.set('context', 'true');
    url.searchParams.set('max_results', '100');
    if (cursor) url.searchParams.set('next_cursor', cursor);
    const data = await result(await fetch(url, { headers: {
      Authorization: `Basic ${Buffer.from(`${setting('CLOUDINARY_API_KEY')}:${setting('CLOUDINARY_API_SECRET')}`).toString('base64')}`,
    }, signal: AbortSignal.timeout(15000) }));
    resources.push(...data.resources);
    cursor = data.next_cursor;
  } while (cursor);
  return resources.map(resource => {
    const context = resource.context?.custom || {};
    return {
      id: resource.public_id, href: context.link || '', image: resource.secure_url,
      imageAlt: context.alt || 'Imagen del canal de Telegram', order: Number(context.order) || 0,
      theme: themes.includes(context.theme) ? context.theme : 'pink', enabled: context.enabled !== 'false',
    };
  }).filter(channel => validLink(channel.href))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
export function validLink(link: string) {
  try {
    const url = new URL(link);
    return url.protocol === 'https:' && url.hostname === 't.me' && !url.username && !url.password
      && !url.search && !url.hash && /^\/(\+[A-Za-z0-9_-]+|[A-Za-z0-9_]{5,})$/.test(url.pathname);
  } catch { return false; }
}
export function channelFields(form: FormData) {
  const href = String(form.get('href') || '').trim();
  if (!validLink(href)) throw new Error('Usa un enlace válido de Telegram: https://t.me/...');
  const order = Number(form.get('order'));
  if (!Number.isInteger(order) || order < 0 || order > 999) throw new Error('El orden debe estar entre 0 y 999.');
  const theme = automaticTheme(Math.max(0, order - 1));
  const imageAlt = 'Imagen del canal de Telegram';
  return { href, order, theme, imageAlt, enabled: form.get('enabled') === 'true' };
}
function context(fields: ReturnType<typeof channelFields>) {
  const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/=/g, '\\=').replace(/\|/g, '\\|');
  return Object.entries({ link: fields.href, order: fields.order, theme: fields.theme, alt: fields.imageAlt, enabled: fields.enabled })
    .map(([key, value]) => `${key}=${escape(String(value))}`).join('|');
}
export async function uploadImage(file: Blob, fields: ReturnType<typeof channelFields>, id = `${prefix}${randomUUID()}`) {
  assetId(id);
  if (!file.size || file.size > 3 * 1024 * 1024) throw new Error('La imagen debe pesar como máximo 3 MB.');
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = [137,80,78,71,13,10,26,10].every((byte, i) => bytes[i] === byte);
  const webp = String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP';
  if (!jpeg && !png && !webp) throw new Error('Sube una imagen JPG, PNG o WebP.');
  const body = new FormData();
  for (const [key, value] of Object.entries(signed({ public_id: id, overwrite: 'true', invalidate: 'true', context: context(fields) }))) body.set(key, value);
  body.set('file', file, 'channel-image');
  await result(await fetch(`https://api.cloudinary.com/v1_1/${cloud()}/image/upload`, { method: 'POST', body, signal: AbortSignal.timeout(30000) }));
}
export async function updateFields(id: string, fields: ReturnType<typeof channelFields>) {
  const body = new URLSearchParams(signed({ public_ids: assetId(id), command: 'add', context: context(fields) }));
  await result(await fetch(`https://api.cloudinary.com/v1_1/${cloud()}/image/context`, { method: 'POST', body, signal: AbortSignal.timeout(15000) }));
}
export async function deleteChannel(id: string) {
  const body = new URLSearchParams(signed({ public_id: assetId(id), invalidate: 'true' }));
  await result(await fetch(`https://api.cloudinary.com/v1_1/${cloud()}/image/destroy`, { method: 'POST', body, signal: AbortSignal.timeout(15000) }));
}
