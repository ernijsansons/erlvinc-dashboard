# Database Migration Instructions

## LABS Opportunities Table Migration

The `labs_opportunities` table is currently missing from the production database and needs to be created manually via the Supabase SQL Editor.

### Steps to Run Migration:

1. **Navigate to Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/aiigoxmibjootfxwdudc/sql/new
   - Login to your Supabase account

2. **Open Migration File**:
   - Open: `supabase/migrations/002_labs_tables.sql`
   - Copy the entire contents of this file

3. **Execute SQL**:
   - Paste the SQL into the Supabase SQL Editor
   - Click "Run" to execute the migration
   - Verify success message appears

4. **Verify Table Creation**:
   - Run this query to confirm:
   ```sql
   SELECT * FROM labs_opportunities LIMIT 1;
   ```
   - Should return empty result (no rows) but no error

### What This Migration Creates:

- **Table**: `labs_opportunities` with 5-stage pipeline fields:
  - Stage 1 (Scanning): title, capability info, niche, pain point
  - Stage 2 (Research): market validation, competitor analysis, personas, etc.
  - Stage 3 (Discussion): chat history with Claude
  - Stage 4 (Approval): approval info, domain, blueprint
  - Stage 5 (Built): link to project

- **Indexes**:
  - `idx_labs_status`: For filtering by status
  - `idx_labs_created`: For sorting by creation date

### After Migration:

The LABS pipeline page at https://dashboard.erlvinc.com/dashboard/labs will function correctly and show the 5-stage Kanban board.

### Status:

- ✅ Chat API fixed (SUPABASE_SERVICE_ROLE_KEY added to Vercel)
- ⏳ LABS migration pending manual execution
- ⏳ Favicon pending

---

**Alternative: Automated Migration (Requires DB Password)**

If you have the Supabase database password, you can run:

```bash
cd /c/dev/erlvinc-dashboard
# Update the connection string in scripts/migrate-labs.js with your database password
node scripts/migrate-labs.js
```

Connection string format:
```
postgresql://postgres.aiigoxmibjootfxwdudc:[YOUR_DB_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

The database password can be found in: Supabase Dashboard > Settings > Database > Connection string
