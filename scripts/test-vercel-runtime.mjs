import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';

// Exercise the actual deployment bundle, with build tools unavailable as in Vercel.
const buildTools = ['rolldown', '@vercel/routing-utils'];
registerHooks({
  resolve(specifier, context, nextResolve) {
    assert.ok(!buildTools.some(name => specifier === name || specifier.startsWith(name + '/')),
      `The deployed function must not load build tool ${specifier}`);
    return nextResolve(specifier, context);
  },
});
process.env.ADMIN_PASSWORD = 'Test1234';
process.env.ADMIN_SESSION_SECRET = 'test-session-secret-only-1234567890';
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';
globalThis.fetch = async () => Response.json({ resources: [{
  public_id: 'pqsr/channels/test',
  secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test.jpg',
  context: { custom: { link: 'https://t.me/+abc123', enabled: 'true', order: '1' } },
}] });

const directory = new URL('../.vercel/output/functions/_render.func/', import.meta.url);
const config = JSON.parse(await readFile(new URL('.vc-config.json', directory), 'utf8'));
const { default: runtime } = await import(new URL(config.handler, directory));
const origin = 'https://www.peruanoqueserespeta.com';
for (const [path, status] of [['/', 200], ['/admin', 200], ['/api/admin/channels', 401]]) {
  const response = await runtime.fetch(new Request(origin + path));
  assert.equal(response.status, status, path);
  const html = await response.text();
  if (path === '/') assert.ok(html.includes('https://t.me/+abc123'));
  assert.ok(!html.includes(process.env.ADMIN_PASSWORD));
}
const login = await runtime.fetch(new Request(origin + '/api/admin/session', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
}));
assert.equal(login.status, 200);
assert.ok(login.headers.get('set-cookie').includes('HttpOnly'));
console.log('OK: deployed Vercel bundle serves home, admin and login without native build tools. Cloudinary is simulated.');
