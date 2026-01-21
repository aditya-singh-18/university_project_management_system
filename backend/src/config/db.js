import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'Aditya18',   // STRING only
  database: 'unipro_db',
  port: 5432,
});

export default pool;
