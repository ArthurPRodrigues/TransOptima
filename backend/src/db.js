import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
host: process.env.PGHOST || 'localhost',
port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
user: process.env.PGUSER || 'postgres',
password: process.env.PGPASSWORD || 'postgres',
database: process.env.PGDATABASE || 'transoptima'
});


export default pool;