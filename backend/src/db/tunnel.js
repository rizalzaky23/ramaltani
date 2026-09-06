/**
 * Cloudflare Tunnel helper for PostgreSQL
 * Automatically bridges `postgre.rizalzaky.cloud` over Cloudflare Access TCP
 */
const { spawn } = require('child_process');
const net = require('net');

let tunnelProcess = null;

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function ensureCloudflareTunnel(hostname = 'postgre.rizalzaky.cloud', localPort = 5433) {
  // 1. If local tunnel port is already listening, reuse it
  const alreadyRunning = await isPortOpen(localPort);
  if (alreadyRunning) {
    console.log(`📡 Cloudflare Tunnel untuk ${hostname} sudah aktif di 127.0.0.1:${localPort}`);
    return { ok: true, port: localPort };
  }

  // 2. Spawn cloudflared access tcp
  console.log(`🌐 Memulai Cloudflare Tunnel ke ${hostname} di 127.0.0.1:${localPort}...`);
  try {
    tunnelProcess = spawn('cloudflared', [
      'access', 'tcp',
      '--hostname', hostname,
      '--url', `127.0.0.1:${localPort}`
    ], {
      stdio: 'ignore',
      detached: false,
    });

    tunnelProcess.unref();

    // 3. Wait until port is ready (up to 4 seconds)
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 250));
      const open = await isPortOpen(localPort);
      if (open) {
        console.log(`✅ Cloudflare Tunnel aktif: 127.0.0.1:${localPort} -> ${hostname}`);
        return { ok: true, port: localPort, process: tunnelProcess };
      }
    }

    console.warn(`⚠️ Timeout menunggu Cloudflare Tunnel di port ${localPort}`);
    return { ok: false, port: localPort };
  } catch (err) {
    console.warn(`⚠️ Gagal menjalankan cloudflared:`, err.message);
    return { ok: false, error: err.message };
  }
}

// Clean up child process on exit
process.on('exit', () => {
  if (tunnelProcess && !tunnelProcess.killed) {
    try { tunnelProcess.kill(); } catch (_) {}
  }
});

module.exports = {
  ensureCloudflareTunnel,
  isPortOpen,
};
