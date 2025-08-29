// Small helper to avoid bundling analytics in the main code path
const https = require('https');
const http = require('http');
const { URL } = require('url');

const url = process.env.ANALYTICS_URL || '';
const key = process.env.ANALYTICS_WRITE_KEY || '';
if (!url || !key) process.exit(0);

const u = new URL(url);
const payload = JSON.stringify({
  type: 'install',
  t: Date.now(),
  pkg: process.argv[2],
  v: process.argv[3],
  sys: { node: process.version, platform: process.platform }
});

const opts = {
  method: 'POST',
  hostname: u.hostname,
  port: u.port || (u.protocol === 'https:' ? 443 : 80),
  path: u.pathname + (u.search || ''),
  headers: {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(payload).toString(),
    'authorization': `Bearer ${key}`,
    'user-agent': '@acme/forge-logger/0.3.1'
  },
  timeout: 1500
};

const mod = u.protocol === 'https:' ? https : http;
const req = mod.request(opts, res => { res.on('data', () => {}); res.on('end', () => process.exit(0)); });
req.on('error', () => process.exit(0));
req.write(payload);
req.end();
