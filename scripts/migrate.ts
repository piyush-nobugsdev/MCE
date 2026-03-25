import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env or .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, '../supabase/migrations/001_ratings.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Note: This relies on the exec_sql RPC function existing in Supabase.
    // An alternative is using supersonic if it's not setup.
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
       console.error('Migration failed:', error.message)
    } else {
       console.log('Migration successful')
    }
  } catch (err: any) {
    console.error('Error reading migration file or executing:', err.message)
  }
}

runMigration()