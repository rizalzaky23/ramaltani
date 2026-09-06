/**
 * Database connection pool for RamalTani
 * Connects to PostgreSQL via Cloudflare domain (postgre.rizalzaky.cloud)
 * with automatic Cloudflare Tunnel bridge & fallback to local IP (192.168.1.8)
 */
const { Pool } = require('pg');
const { ensureCloudflareTunnel } = require('./tunnel');

const host = process.env.DB_HOST || 'postgre.rizalzaky.cloud';
const isCloudflareHost = host.includes('rizalzaky.cloud') || process.env.USE_CLOUDFLARE_TUNNEL === 'true';
const tunnelPort = parseInt(process.env.CLOUDFLARE_TUNNEL_PORT || '5433');

let pool = null;
let tunnelPromise = null;

async function getPool() {
  if (pool) return pool;

  if (isCloudflareHost) {
    if (!tunnelPromise) {
      tunnelPromise = ensureCloudflareTunnel(host, tunnelPort);
    }
    await tunnelPromise;

    pool = new Pool({
      host: '127.0.0.1',
      port: tunnelPort,
      database: process.env.DB_NAME || 'ramaltani_db',
      user: process.env.DB_USER || 'ramaltani_user',
      password: process.env.DB_PASSWORD || 'rizal2302.',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });
  } else {
    pool = new Pool({
      host: host,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'ramaltani_db',
      user: process.env.DB_USER || 'ramaltani_user',
      password: process.env.DB_PASSWORD || 'rizal2302.',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });
  }

  pool.on('error', (err) => {
    console.error('❌ PostgreSQL Pool Error:', err.message);
  });

  return pool;
}

async function query(text, params) {
  const p = await getPool();
  try {
    const res = await p.query(text, params);
    return res;
  } catch (err) {
    console.error('DB Query Error:', { text: text.substring(0, 100), error: err.message });
    throw err;
  }
}

async function testConnection() {
  try {
    const p = await getPool();
    const res = await p.query('SELECT NOW() as now, current_database() as db, current_user as user, version() as version');
    console.log(`🐘 PostgreSQL connected via ${host}:`, res.rows[0].db);
    return { ok: true, host, info: res.rows[0] };
  } catch (err) {
    console.error(`⚠️ PostgreSQL Connection Warning (${host}):`, err.message);
    return { ok: false, host, error: err.message };
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Pre-initialize pool
getPool().catch(err => console.warn('Background pool init warning:', err.message));

module.exports = {
  getPool,
  query,
  testConnection,
  closePool,
  activeHost: host,
};
