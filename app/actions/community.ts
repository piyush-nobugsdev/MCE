'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(data: { content: string, tag: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: data.content,
      tag: data.tag,
    })

  if (error) return { error: error.message }
  
  revalidatePath('/farmer/sahyog-kendra')
  return { success: true }
}

export async function getPosts(tagFilter: string = 'all') {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(`
      *,
      farmers!inner ( first_name, last_name )
    `)
    .order('created_at', { ascending: false })

  if (tagFilter !== 'all') {
    query = query.eq('tag', tagFilter)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  const posts = data.map((post: any) => ({
    ...post,
    user_name: `${post.farmers.first_name} ${post.farmers.last_name}`
  }))

  return { posts }
}

export async function createReply(data: { postId: string, content: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('replies')
    .insert({
      post_id: data.postId,
      user_id: user.id,
      content: data.content,
    })

  if (error) return { error: error.message }
  
  return { success: true }
}

export async function getReplies(postId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('replies')
    .select(`
      *,
      farmers!inner ( first_name, last_name )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }

  const replies = data.map((reply: any) => ({
    ...reply,
    user_name: `${reply.farmers.first_name} ${reply.farmers.last_name}`
  }))

  return { replies }
}
