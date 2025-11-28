import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n==============================================');
console.log('  SCHEMA TABLE MIGRATION INSTRUCTIONS');
console.log('==============================================\n');

const sqlFile = join(__dirname, 'supabase_add_schemas_table.sql');

if (!existsSync(sqlFile)) {
    console.error('❌ Error: SQL file not found at:', sqlFile);
    process.exit(1);
}

const sqlContent = readFileSync(sqlFile, 'utf8');

console.log('📋 Migration File: supabase_add_schemas_table.sql');
console.log('📊 This migration will:');
console.log('   ✓ Create a new "schemas" table in your database');
console.log('   ✓ Add Row Level Security (RLS) policies');
console.log('   ✓ Insert 6 default pharmaceutical schemas');
console.log('   ✓ Create indexes for better performance\n');

console.log('🔧 HOW TO RUN THIS MIGRATION:\n');
console.log('Option 1: Using Supabase Dashboard (Recommended)');
console.log('   1. Go to https://app.supabase.com');
console.log('   2. Select your project');
console.log('   3. Click on "SQL Editor" in the left sidebar');
console.log('   4. Click "New Query"');
console.log('   5. Copy the contents of: supabase_add_schemas_table.sql');
console.log('   6. Paste into the SQL editor');
console.log('   7. Click "Run" button\n');

console.log('Option 2: Using Supabase CLI');
console.log('   1. Install Supabase CLI: npm install -g supabase');
console.log('   2. Link your project: supabase link');
console.log('   3. Run: supabase db push\n');

console.log('Option 3: Using psql (if you have direct access)');
console.log('   psql -h <your-db-host> -U postgres -d postgres -f supabase_add_schemas_table.sql\n');

console.log('⚠️  IMPORTANT NOTES:');
console.log('   • This migration is safe to run multiple times (uses IF NOT EXISTS)');
console.log('   • Existing data will NOT be affected');
console.log('   • Default schemas will only be inserted if they don\'t exist');
console.log('   • After running, clear your browser cache/localStorage\n');

console.log('📝 SQL Preview (first 500 characters):');
console.log('─'.repeat(60));
console.log(sqlContent.substring(0, 500) + '...\n');
console.log('─'.repeat(60));

console.log('\n✅ Ready to migrate! Choose one of the options above.\n');
