const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  const result = {}
  
  const tables = ['jobs', 'applications', 'farmers', 'workers']
  for (const t of tables) {
    const { data } = await supabase.from(t).select('*').limit(1)
    if (data && data.length > 0) {
      result[t] = Object.keys(data[0])
    } else {
      result[t] = 'empty'
    }
  }
  
  fs.writeFileSync('schema.json', JSON.stringify(result, null, 2))
}
run()
