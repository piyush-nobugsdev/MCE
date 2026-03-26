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

async function runMigration(filename: string) {
  try {
    const sqlPath = path.join(__dirname, '../supabase/migrations', filename)
    const sql = fs.readFileSync(sqlPath, 'utf8')
    const { error } = await supabase.rpc('exec_sql', { sql })
    if (error) {
      console.error(`Migration ${filename} failed:`, error.message)
    } else {
      console.log(`Migration ${filename} successful`)
    }
  } catch (err: any) {
    console.error(`Error running ${filename}:`, err.message)
  }
}

async function main() {
  const target = process.argv[2]
  if (target) {
    await runMigration(target)
  } else {
    // Run all migrations in order
    await runMigration('001_ratings.sql')
    await runMigration('002_completion.sql')
  }
}

main()