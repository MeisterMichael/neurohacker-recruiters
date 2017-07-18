const { Pool, Client } = require('pg');
const config  = require('../../config');

// pools will use environment variables
// for connection information
const pool = new Pool({
  user: config.databaseUsername,
  host: config.databaseHost,
  database: config.databaseName,
  password: config.databasePassword,
  port: config.databasePort,
})

module.exports = pool;
