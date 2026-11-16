const { execFile } = require('node:child_process');
const { randomBytes, createHash, timingSafeEqual } = require('node:crypto');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);
const secret = process.env.VAULT_SECRET;
const port = Number(process.env.PORT || 8080);
const codespacesOrigin =
  process.env.CODESPACE_NAME && port === 8080
    ? `https://${process.env.CODESPACE_NAME}-8080.app.github.dev`
    : undefined;
const allowedOrigin = process.env.VAULT_ALLOWED_ORIGIN || codespacesOrigin;
const bindHost = process.env.VAULT_HOST || (codespacesOrigin ? '0.0.0.0' : '127.0.0.1');
const scriptDirectory = path.join(os.homedir(), 'scripts');
const actions = {
  'sync-catalog': {
    executable: 'python3',
    args: [path.join(scriptDirectory, 'sync_catalog.py')],
  },
  'process-vocals': {
    executable: 'node',
    args: [path.join(scriptDirectory, 'process_vocals.js')],
  },
};

if (!secret || Buffer.byteLength(secret) < 32) {
  console.error('Set VAULT_SECRET to a value at least 32 bytes long.');
  process.exit(1);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

let allowedOriginUrl;
if (allowedOrigin) {
  try {
    allowedOriginUrl = new URL(allowedOrigin);
    if (
      !['http:', 'https:'].includes(allowedOriginUrl.protocol) ||
      allowedOriginUrl.origin !== allowedOrigin
    ) {
      throw new Error('Origin must be an exact http(s) origin without a path.');
    }
  } catch (error) {
    console.error(`Invalid VAULT_ALLOWED_ORIGIN: ${error.message}`);
    process.exit(1);
  }
}

const secretHash = createHash('sha256').update(secret).digest();

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
    'x-content-type-options': 'nosniff',
  });
  res.end(body);
}

function isLocalRequest(req) {
  const host = req.headers.host;
  const origin = req.headers.origin;
  if (!host || !origin) return false;

  if (allowedOriginUrl) {
    return origin === allowedOriginUrl.origin && host === allowedOriginUrl.host;
  }

  try {
    const hostUrl = new URL(`http://${host}`);
    const originUrl = new URL(origin);
    const hostname = hostUrl.hostname.replace(/^\[|\]$/g, '');
    return (
      ['localhost', '127.0.0.1', '::1'].includes(hostname) &&
      originUrl.protocol === 'http:' &&
      originUrl.host === hostUrl.host &&
      originUrl.pathname === '/' &&
      !originUrl.search &&
      !originUrl.hash
    );
  } catch {
    return false;
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > 4096) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

function isAuthorized(passcode) {
  if (typeof passcode !== 'string') return false;
  const candidateHash = createHash('sha256').update(passcode).digest();
  return timingSafeEqual(candidateHash, secretHash);
}

function dashboard(nonce) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Local Command Vault</title>
  <style>
    body { background: #050505; color: #e3d8c1; font: 16px monospace; padding: 20px; max-width: 800px; margin: 0 auto; }
    input { box-sizing: border-box; background: #111; color: #e3d8c1; border: 1px solid #444; padding: 10px; width: 100%; margin-bottom: 20px; }
    button { background: #1a1a1a; color: #e3d8c1; border: 1px solid #555; padding: 12px; width: 100%; margin-bottom: 10px; cursor: pointer; text-align: left; }
    button:hover { background: #333; }
    #terminal { margin-top: 20px; background: #0a0a0a; padding: 15px; border: 1px solid #222; min-height: 250px; white-space: pre-wrap; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <h2>_LOCAL ECO EMO VAULT</h2>
  <input type="password" id="passcode" autocomplete="current-password" placeholder="Enter Vault Passcode">
  <button type="button" data-action="list-files">>[EXECUTE] List Server Directory</button>
  <button type="button" data-action="sync-catalog">>[EXECUTE] Run Catalog Sync Script</button>
  <button type="button" data-action="process-vocals">>[EXECUTE] Run Audio Forge</button>
  <div id="terminal" role="status" aria-live="polite">Local system initialized. Server is bound to this machine only.</div>
  <script nonce="${nonce}">
    const terminal = document.getElementById('terminal');
    document.querySelectorAll('button[data-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        terminal.textContent += '\\n> Running: ' + button.dataset.action;
        try {
          const response = await fetch('/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: button.dataset.action,
              passcode: document.getElementById('passcode').value
            })
          });
          const result = await response.json();
          terminal.textContent += '\\n' + (result.output || result.error || 'Request failed.');
        } catch {
          terminal.textContent += '\\nServer disconnected or returned an invalid response.';
        }
        terminal.scrollTop = terminal.scrollHeight;
      });
    });
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'no-referrer');

  if (!isLocalRequest(req)) {
    sendJson(res, 403, { error: 'Requests must come from this machine.' });
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    const nonce = randomBytes(18).toString('base64');
    const html = dashboard(nonce);
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-length': Buffer.byteLength(html),
      'content-security-policy': `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'`,
    });
    res.end(html);
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/run') {
    sendJson(res, 404, { error: 'Not found.' });
    return;
  }

  if (!req.headers['content-type']?.startsWith('application/json')) {
    sendJson(res, 415, { error: 'Content-Type must be application/json.' });
    return;
  }

  let payload;
  try {
    payload = await readJson(req);
  } catch (error) {
    if (!res.destroyed) sendJson(res, 400, { error: error.message });
    return;
  }

  if (!isAuthorized(payload.passcode)) {
    sendJson(res, 401, { error: '[AUTH] Invalid passcode.' });
    return;
  }

  if (payload.action === 'list-files') {
    try {
      const files = await fs.readdir(process.cwd());
      sendJson(res, 200, { output: `[FILES]\\n${files.join('\\n')}` });
    } catch (error) {
      console.error('Unable to list the server directory:', error);
      sendJson(res, 500, { error: 'Unable to list the server directory.' });
    }
    return;
  }

  const action = actions[payload.action];
  if (!action) {
    sendJson(res, 400, { error: 'Unknown action.' });
    return;
  }

  try {
    const { stdout, stderr } = await execFileAsync(action.executable, action.args, {
      cwd: os.homedir(),
      timeout: 30_000,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
    });
    sendJson(res, 200, { output: `[OUTPUT]\\n${stdout}${stderr ? `\\n[STDERR]\\n${stderr}` : ''}` });
  } catch (error) {
    console.error(`Action "${payload.action}" failed:`, error);
    const details = error.stderr || error.message;
    sendJson(res, 500, { error: `[EXECUTION ERROR]\\n${details}` });
  }
});

server.headersTimeout = 10_000;
server.requestTimeout = 10_000;
server.listen(port, bindHost, () => {
  console.log(`Local Vault listening on ${bindHost}:${port}`);
  if (allowedOriginUrl) console.log(`Allowed browser origin: ${allowedOriginUrl.origin}`);
});

server.on('error', (error) => {
  console.error('Local Vault could not start:', error);
  process.exitCode = 1;
});
