import type { APIRoute } from 'astro';
import { authenticated, json, sameOrigin } from '../../../lib/admin';
import { channelFields, deleteChannel, listChannels, updateFields, uploadImage } from '../../../lib/cloudinary';
import { campaigns } from '../../../data/campaigns';
export const prerender = false;
export const GET: APIRoute = async context => {
  if (!authenticated(context)) return json({ error: 'Inicia sesión.' }, 401);
  try { return json({ channels: await listChannels() }); }
  catch (error) { return json({ error: error instanceof Error ? error.message : 'No se pudo cargar.' }, 502); }
};
export const POST: APIRoute = async context => {
  const { request } = context;
  if (!authenticated(context)) return json({ error: 'Inicia sesión.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Origen no permitido.' }, 403);
  if (Number(request.headers.get('content-length')) > 3.5 * 1024 * 1024) return json({ error: 'La imagen debe pesar como máximo 3 MB.' }, 413);
  try {
    const form = await request.formData();
    const action = String(form.get('action'));
    if (action === 'import') {
      const existing = await listChannels();
      for (const campaign of campaigns) {
        const id = `pqsr/channels/seed-${campaign.number}`;
        if (existing.some(channel => channel.id === id)) continue;
        const response = await fetch(new URL(campaign.image.src, request.url));
        if (!response.ok) throw new Error('No se pudo leer una imagen original.');
        await uploadImage(await response.blob(), { href: campaign.href, order: Number(campaign.number), theme: campaign.theme, imageAlt: campaign.imageAlt, enabled: true }, id);
      }
    } else if (action === 'delete') {
      await deleteChannel(String(form.get('id')));
    } else if (action === 'create' || action === 'update') {
      const fields = channelFields(form);
      const file = form.get('image');
      if (file instanceof Blob && file.size) await uploadImage(file, fields, action === 'update' ? String(form.get('id')) : undefined);
      else if (action === 'update') await updateFields(String(form.get('id')), fields);
      else throw new Error('Selecciona una imagen para crear la tarjeta.');
    } else throw new Error('Operación no válida.');
    return json({ ok: true });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'No se pudo guardar.' }, 400); }
};
