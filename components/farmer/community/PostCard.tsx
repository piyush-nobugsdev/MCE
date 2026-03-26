'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Clock, MessageCircleQuestion, Lightbulb, NotebookPen, AlertCircle } from 'lucide-react'
import { ReplySection } from './ReplySection'
import { Post } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

const tagStyles = {
  question: { 
    label: 'Inquiry', 
    icon: MessageCircleQuestion, 
    color: 'bg-red-50 text-red-600 border-red-100',
    helpHighlight: 'Immediate assistance requested'
  },
  tip: { 
    label: 'Knowledge', 
    icon: Lightbulb, 
    color: 'bg-green-50 text-green-600 border-green-100'
  },
  experience: { 
    label: 'Field Notes', 
    icon: NotebookPen, 
    color: 'bg-blue-50 text-blue-600 border-blue-100'
  }
}

export function PostCard({ post }: { post: Post }) {
  const [showReplies, setShowReplies] = useState(false)
  const style = tagStyles[post.tag as keyof typeof tagStyles] || tagStyles.experience

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white mb-6 group transition-all duration-200 hover:border-gray-300">
      <CardContent className="p-6 space-y-5">
        {/* Post Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-200 shadow-inner">
              {post.user_name?.[0] || 'F'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{post.user_name || 'Farmer'}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all duration-200 ${style.color}`}>
            <style.icon className="w-3 h-3 mr-1.5 inline" />
            {style.label}
          </span>
        </div>

        {/* Question Highlight */}
        {post.tag === 'question' && (
          <div className="bg-red-50/30 p-3.5 rounded-lg flex items-center gap-3 border border-red-100/50">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
              {style.helpHighlight}
            </p>
          </div>
        )}

        {/* Post Content */}
        <div className="relative">
          <p className="text-gray-800 font-medium text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all duration-200 ${
              showReplies 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {showReplies ? 'Hide Discussion' : 'Join Discussion'}
          </button>
          
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400 shadow-sm">F</div>
             ))}
          </div>
        </div>

        {/* Replies Section */}
        {showReplies && <ReplySection postId={post.id} />}
      </CardContent>
    </Card>
  )
}
