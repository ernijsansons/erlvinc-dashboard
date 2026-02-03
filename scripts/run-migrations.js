// Script to run LABS migrations on production Supabase
const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://aiigoxmibjootfxwdudc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpaWdveG1pYmpvb3RmeHdkdWRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTc3MjIxNywiZXhwIjoyMDg1MzQ4MjE3fQ.wGhRDOjUhZJD9HjU99nW-hsZl9iSkJEyXukObSyWyQ4';

// Read the migration file
const migrationSQL = fs.readFileSync('./supabase/migrations/002_labs_tables.sql', 'utf8');

// First, create a helper function to execute SQL
const createExecFunction = `
CREATE OR REPLACE FUNCTION exec_sql_migration(sql_query text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
  RETURN 'Success';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error: ' || SQLERRM;
END;
$$;
`;

async function executeSQLviaRPC(sqlQuery) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql_migration`);

    const postData = JSON.stringify({ sql_query: sqlQuery });

    const options = {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('Creating exec_sql_migration function...');

  try {
    await executeSQLviaRPC(createExecFunction);
    console.log('✓ Helper function created');
  } catch (error) {
    console.log('Note: Helper function may already exist or creation failed:', error.message);
  }

  console.log('\nRunning LABS migration...');

  try {
    const result = await executeSQLviaRPC(migrationSQL);
    console.log('✓ Migration completed:', result);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
}

main();
