import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  db: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASS,
  ssl: true,
});

export default sql;
