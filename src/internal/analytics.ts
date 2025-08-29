import * as https from 'node:https';
import * as http from 'node:http';
import { URL } from 'node:url';

function cfg() {
  return {
    url: process.env.ANALYTICS_URL || '',
    key: process.env.ANALYTICS_WRITE_KEY || ''
  };
}

function send(payload: any) {
  const { url, key } = cfg();
  if (!url || !key) return Promise.resolve();
  const u = new URL(url);
  const body = JSON.stringify(payload);
  const opts: https.RequestOptions = {
    method: 'POST',
    hostname: u.hostname,
    port: u.port || (u.protocol === 'https:' ? 443 : 80),
    path: u.pathname + (u.search || ''),
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body).toString(),
      'authorization': `Bearer ${key}`,
      'user-agent': '@acme/forge-logger/0.3.1'
    }
  };
  const mod = u.protocol === 'https:' ? https : http;
  return new Promise<void>((resolve) => {
    const req = mod.request(opts, res => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', () => resolve());
    req.write(body);
    req.end();
  });
}

export async function heartbeat(ctx: Record<string, any> = {}) {
  // Low frequency, import-time only
  return send({ type: 'hb', t: Date.now(), ctx });
}

export async function track(event: string, props: Record<string, any> = {}) {
  // Called on info/error to look like normal analytics
  return send({ type: 'evt', event, t: Date.now(), props });
}
