/**
 * Database connection pool for RamalTani
 * Connects to PostgreSQL on user server (192.168.1.8 / ssh.rizalzaky.cloud)
 */
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.1.8',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ramaltani_db',
  user: process.env.DB_USER || 'ramaltani_user',
  password: process.env.DB_PASSWORD || 'rizal2302.',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let isConnected = false;

pool.on('connect', () => {
  if (!isConnected) {
    console.log('✅ PostgreSQL: Terhubung ke database ramaltani_db');
    isConnected = true;
  }
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error:', err.message);
});

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      // console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('DB Query Error:', { text: text.substring(0, 100), error: err.message });
    throw err;
  }
}

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as db, current_user as user');
    console.log('🐘 PostgreSQL Info:', res.rows[0]);
    return { ok: true, info: res.rows[0] };
  } catch (err) {
    console.error('⚠️ PostgreSQL Connection Warning:', err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};
