
import { createAdminClient } from './lib/supabase/admin'

async function test() {
  const admin = createAdminClient()
  console.log('admin.auth.admin does not have createSession')
}

test()
