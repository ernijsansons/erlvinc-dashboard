// Run LABS migrations using direct PostgreSQL connection
const { Client } = require('pg');
const fs = require('fs');

// Supabase connection string format:
// postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
const connectionString = 'postgresql://postgres.aiigoxmibjootfxwdudc:AuditTest2026@aws-0-us-east-1.pooler.supabase.com:5432/postgres';

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Supabase uses SSL
    }
  });

  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('✓ Connected');

    // Read migration file
    const migrationSQL = fs.readFileSync('./supabase/migrations/002_labs_tables.sql', 'utf8');

    console.log('\nRunning LABS migration...');
    await client.query(migrationSQL);
    console.log('✓ Migration completed successfully!');

    // Verify table was created
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'labs_opportunities'
    `);

    if (result.rows.length > 0) {
      console.log('✓ Verified: labs_opportunities table exists');
    } else {
      console.log('✗ Warning: Table verification failed');
    }

  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
