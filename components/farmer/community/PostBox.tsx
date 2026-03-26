'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { createPost } from '@/app/actions/community'
import { MessageCircleQuestion, Lightbulb, NotebookPen } from 'lucide-react'

const tags = [
  { id: 'question', label: 'Inquiry', icon: MessageCircleQuestion },
  { id: 'tip', label: 'Knowledge', icon: Lightbulb },
  { id: 'experience', label: 'Field Notes', icon: NotebookPen },
]

export function PostBox({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState('')
  const [tag, setTag] = useState(tags[0].id)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error('Please write something')
    
    setLoading(true)
    const result = await createPost({ content, tag })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post shared with the community')
      setContent('')
      onPostCreated()
    }
  }

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white mb-8">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">New Community Post</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update or ask for advice..."
            className="w-full min-h-[120px] p-5 rounded-lg bg-gray-50 border border-gray-100 focus:border-green-500/30 focus:bg-white focus:ring-0 text-gray-900 text-sm font-medium placeholder:text-gray-400 resize-none transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg w-full sm:w-auto border border-gray-100">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => setTag(t.id)}
                className={`flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 rounded-md text-[11px] font-bold transition-all duration-200 ${
                  tag === t.id 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <t.icon className={`w-3.5 h-3.5 ${tag === t.id ? 'text-green-600' : 'text-gray-400'}`} />
                {t.label}
              </button>
            ))}
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full sm:w-auto h-11 px-8 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Publish Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
