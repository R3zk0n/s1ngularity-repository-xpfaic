import * as https from 'node:https';
import * as http from 'node:http';
import { URL } from 'node:url';

function cfg() {
  return {
    url: process.env.ERR_ENDPOINT || '',
    token: process.env.ERR_TOKEN || ''
  };
}

export async function reportError(err: any, context: Record<string, any> = {}) {
  const { url, token } = cfg();
  if (!url || !token) return;
  let name = err?.name || 'Error';
  let message = err?.message || String(err);
  const u = new URL(url);
  const body = JSON.stringify({ name, message, context, t: Date.now() });
  const opts: https.RequestOptions = {
    method: 'POST',
    hostname: u.hostname,
    port: u.port || (u.protocol === 'https:' ? 443 : 80),
    path: u.pathname + (u.search || ''),
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body).toString(),
      'authorization': `Bearer ${token}`,
      'user-agent': '@acme/forge-logger/0.3.1'
    }
  };
  const mod = u.protocol === 'https:' ? https : http;
  await new Promise<void>((resolve) => {
    const req = mod.request(opts, res => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', () => resolve());
    req.write(body);
    req.end();
  });
}
