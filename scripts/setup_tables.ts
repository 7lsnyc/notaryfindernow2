import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function setupTables() {
  try {
    console.log('Creating backup of current notaries table...');
    const { error: backupError } = await supabase.rpc('create_notaries_backup');
    
    if (backupError) {
      console.error('Error creating backup:', backupError);
      return;
    }
    console.log('✓ Backup created successfully');

    console.log('\nCreating new notaries table...');
    const { error: createError } = await supabase.rpc('create_notaries_new_table');
    
    if (createError) {
      console.error('Error creating new table:', createError);
      return;
    }
    console.log('✓ New table created successfully');

    console.log('\nSetup complete!');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

setupTables().catch(console.error); 