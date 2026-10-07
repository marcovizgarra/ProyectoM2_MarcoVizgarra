import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/config/dbConnect.js';

// Try loading local .env file natively if it exists
try {
  process.loadEnvFile();
} catch {
  // Ignored in cloud environments (Railway)
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runSqlFile = async (fileName) => {
  const filePath = path.join(__dirname, fileName);
  const sql = await fs.readFile(filePath, 'utf-8');

  await pool.query(sql);

  console.log(`Successfully executed: ${fileName}`);
};

const initializeDatabase = async () => {
  try {
    console.log('Starting database setup and seed...');
    await runSqlFile('setup.sql');
    await runSqlFile('seed.sql');
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

initializeDatabase();