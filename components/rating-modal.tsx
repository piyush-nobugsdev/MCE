'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Loader2, X } from 'lucide-react'
import { rateUser } from '@/app/actions/ratings'
import { toast } from 'sonner'

// ─── Tag option sets ─────────────────────────────────────────────────────────

const FARMER_TAGS = [
  'Fair pay', 'Paid on time', 'Good communication',
  'Safe conditions', 'Respectful', 'Provided meals',
  'Delayed payment', 'Poor conditions', 'Unreliable',
]

const WORKER_TAGS = [
  'Punctual', 'Hard working', 'Skilled', 'Honest',
  'Follows instructions', 'Teamwork', 'Did not show',
  'Poor work quality', 'Unreliable',
]

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

// ─── Props ───────────────────────────────────────────────────────────────────

interface RatingModalProps {
  /** The application.id (not job_id) to submit the rating against */
  applicationId: string
  /** Name of the person being rated, shown in header */
  rateeDisplayName: string
  /** Direction of the rating */
  type: 'worker_to_farmer' | 'farmer_to_worker'
  /** Called on successful submission so parent can refresh state */
  onSuccess: () => void
  /** Called when the user cancels */
  onClose: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RatingModal({
  applicationId,
  rateeDisplayName,
  type,
  onSuccess,
  onClose,
}: RatingModalProps) {
  const [rating, setRating] = useState(5)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const tagOptions = type === 'worker_to_farmer' ? FARMER_TAGS : WORKER_TAGS
  const targetWord = type === 'worker_to_farmer' ? 'Farmer' : 'Worker'
  const accentColor = type === 'worker_to_farmer' ? 'green' : 'blue'

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    const result = await rateUser(applicationId, rating, selectedTags, comment, type)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`${targetWord} rated successfully!`)
      onSuccess()
    }
  }

  const displayRating = hoveredStar || rating

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg border-0 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">

          {/* Header */}
          <div className={`px-10 pt-10 pb-6 bg-gradient-to-br ${
            accentColor === 'green'
              ? 'from-green-50 to-emerald-50'
              : 'from-blue-50 to-indigo-50'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${
                  accentColor === 'green' ? 'text-green-500' : 'text-blue-500'
                }`}>
                  Rate {targetWord}
                </p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{rateeDisplayName}</h3>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center hover:bg-white transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Stars */}
            <div className="mt-6 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= displayRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-100'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-black text-gray-700">
                {RATING_LABELS[displayRating]}
              </span>
            </div>
          </div>

          <div className="px-10 py-8 space-y-7">

            {/* Multi-select Tags */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Select all that apply
              </p>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => {
                  const selected = selectedTags.includes(tag)
                  const isNegative = ['Delayed payment', 'Poor conditions', 'Unreliable', 'Did not show', 'Poor work quality'].includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        selected
                          ? isNegative
                            ? 'bg-red-500 border-red-500 text-white'
                            : accentColor === 'green'
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {selected ? '✓ ' : ''}{tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Free-text comment */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Additional comments <span className="text-gray-300 normal-case">(optional)</span>
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Share your experience working with this ${targetWord.toLowerCase()}...`}
                rows={3}
                className="w-full p-4 border-2 border-gray-100 rounded-2xl text-sm font-medium text-gray-700 placeholder-gray-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-50 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-13 rounded-2xl font-bold border-2"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 h-13 rounded-2xl font-black text-white shadow-lg ${
                  accentColor === 'green'
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Submit Review`
                )}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
