
import { createAdminClient } from './lib/supabase/admin'

async function test() {
  const admin = createAdminClient()
  console.log('admin.auth.admin has createSession:', typeof admin.auth.admin.createSession)
}

test()
