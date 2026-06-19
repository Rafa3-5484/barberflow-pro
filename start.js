const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || '4001', 10);
const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || '3001', 10);

let backendReady = false;
let frontendReady = false;
let startupTimer = null;

function log(tag, msg) {
  console.log(`[${tag}] ${msg}`);
}

function startBackend() {
  const backend = spawn('node', ['dist/main.js'], {
    cwd: 'backend',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PORT: String(BACKEND_PORT),
      NODE_ENV: 'production',
      FRONTEND_URL: '',
    },
  });

  backend.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(`[Backend] ${text}`);
    if (text.includes('Listening') || text.includes('listening') || text.includes('port')) {
      backendReady = true;
      checkReady();
    }
  });

  backend.stderr.on('data', (data) => {
    process.stderr.write(`[Backend] ${data.toString()}`);
  });

  backend.on('close', (code) => {
    log('BACKEND', `Process exited with code ${code}`);
    backendReady = false;
  });

  return backend;
}

function startFrontend() {
  const frontend = spawn('npx', ['next', 'start', '-p', String(FRONTEND_PORT)], {
    cwd: 'frontend',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PORT: String(FRONTEND_PORT),
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: `http://localhost:${BACKEND_PORT}/api`,
    },
  });

  frontend.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(`[Frontend] ${text}`);
    if (text.includes('started') || text.includes('Listening') || text.includes('port')) {
      frontendReady = true;
      checkReady();
    }
  });

  frontend.stderr.on('data', (data) => {
    process.stderr.write(`[Frontend] ${data.toString()}`);
  });

  frontend.on('close', (code) => {
    log('FRONTEND', `Process exited with code ${code}`);
    frontendReady = false;
  });

  return frontend;
}

function checkReady() {
  if (backendReady && frontendReady && !startupTimer) {
    startupTimer = setTimeout(() => {
      log('PROXY', `Backend and Frontend are ready. Starting proxy on port ${PORT}...`);
      startProxy();
    }, 2000);
  }
}

function startProxy() {
  const server = http.createServer((clientReq, clientRes) => {
    const isApi = clientReq.url.startsWith('/api');
    const targetPort = isApi ? BACKEND_PORT : FRONTEND_PORT;

    const options = {
      hostname: 'localhost',
      port: targetPort,
      path: clientReq.url,
      method: clientReq.method,
      headers: {
        ...clientReq.headers,
        'X-Forwarded-For': clientReq.socket.remoteAddress || '',
        'X-Forwarded-Proto': 'http',
        'X-Forwarded-Host': clientReq.headers.host || 'localhost',
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    });

    proxyReq.on('error', (err) => {
      log('PROXY', `Proxy error: ${err.message}`);
      if (!clientRes.headersSent) {
        clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
        clientRes.end('Bad Gateway');
      }
    });

    clientReq.pipe(proxyReq);
  });

  server.on('error', (err) => {
    log('PROXY', `Server error: ${err.message}`);
  });

  server.listen(PORT, () => {
    log('PROXY', `BarberFlow Pro running on http://0.0.0.0:${PORT}`);
    log('PROXY', `  API:      http://0.0.0.0:${PORT}/api`);
    log('PROXY', `  Frontend: http://0.0.0.0:${PORT}`);
  });
}

// Graceful shutdown
function shutdown() {
  log('PROXY', 'Shutting down...');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

log('PROXY', 'Starting BarberFlow Pro services...');
startBackend();
startFrontend();

// Timeout fallback: if services don't report ready, start proxy anyway after 30s
setTimeout(() => {
  if (!startupTimer) {
    log('PROXY', 'Starting proxy (timeout fallback)...');
    startProxy();
  }
}, 30000);
