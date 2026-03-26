import { createClient } from '@/lib/supabase/client'
import { Worker } from '@/lib/types'

export async function findWorkerByUserId(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error finding worker:', error)
    return null
  }

  return data as Worker
}
