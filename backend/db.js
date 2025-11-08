const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Optional SSL support: set DB_SSL=true to enable TLS. If your Postgres uses a self-signed cert,
// set DB_SSL_REJECT_UNAUTHORIZED=false to allow the connection (not recommended for production).
const useSsl = process.env.DB_SSL === 'true'
const ssl = useSsl ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
}

if (ssl) poolConfig.ssl = ssl

const pool = new Pool(poolConfig)

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
