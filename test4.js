const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at, worker_code, farmer_rated_worker,
      jobs!inner(id, title, location, status, farmer_id),
      workers!inner(rating, total_jobs_completed, skills, home_location, first_name)
    `)
    .limit(5)
    
  console.log("DATA:", JSON.stringify(data, null, 2))
  console.log("ERROR:", error)
}
run()
