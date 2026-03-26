'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createReply, getReplies } from '@/app/actions/community'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Send, Clock, Loader2 } from 'lucide-react'

interface Reply {
  id: string
  content: string
  created_at: string
  user_name?: string
}

export function ReplySection({ postId }: { postId: string }) {
  const [replies, setReplies] = useState<Reply[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchReplies = async () => {
    setLoading(true)
    const result = await getReplies(postId)
    if (result.replies) setReplies(result.replies)
    setLoading(false)
  }

  useEffect(() => {
    fetchReplies()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    setSubmitting(true)
    const result = await createReply({ postId, content })
    setSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      setContent('')
      fetchReplies()
    }
  }

  return (
    <div className="pt-5 space-y-5 border-t border-gray-100 mt-5">
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2.5">
            <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading comments...</p>
          </div>
        ) : replies.length === 0 ? (
          <div className="bg-gray-50/50 p-5 rounded-xl text-center border border-gray-100">
             <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No responses yet</p>
          </div>
        ) : (
          replies.map((reply) => (
            <div key={reply.id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-400 border border-gray-200">
                    {reply.user_name?.[0] || 'F'}
                  </div>
                  <p className="text-[11px] font-bold text-gray-900">{reply.user_name || 'Farmer'}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed pl-9">
                {reply.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-5">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full h-11 pl-4 pr-24 rounded-lg bg-white border border-gray-200 focus:border-green-500/30 focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200"
        />
        <Button 
          type="submit" 
          disabled={submitting || !content.trim()}
          className="absolute right-1 top-1 h-8 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : (
            <>
              <span className="text-[10px] font-bold uppercase tracking-widest">Post</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
