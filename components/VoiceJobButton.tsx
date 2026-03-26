'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2, Sparkles, X, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

interface VoiceJobButtonProps {
  onExtracted?: (data: any) => void
  label?: string
}

export function VoiceJobButton({ onExtracted, label }: VoiceJobButtonProps) {
  const router = useRouter()
  const [isCapturing, setIsCapturing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [fullTranscript, setFullTranscript] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const speak = (text: string) => {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    synth.speak(utterance)
  }

  const handleSpeechResult = useCallback((text: string) => {
    setFullTranscript(prev => prev + ' ' + text)
  }, [])

  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition(handleSpeechResult)

  const toggleCapture = () => {
    if (isCapturing) {
      stopListening()
      handleExtraction()
    } else {
      setIsCapturing(true)
      setFullTranscript('')
      setErrorMsg(null)
      speak("Describe your requirements")
      setTimeout(() => {
        startListening()
      }, 1500)
    }
  }

  const handleExtraction = async () => {
    // If we have any text, extract. If not, error.
    const textToExtract = fullTranscript.trim() + ' ' + transcript.trim()
    if (!textToExtract) {
      setIsCapturing(false)
      toast.error('No speech detected. Please try again.')
      return
    }

    setIsExtracting(true)
    try {
      const response = await fetch('/api/ai/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToExtract }),
      })

      const data = await response.json()
      if (data.error) {
        toast.error(data.error)
      } else {
        if (onExtracted) {
          onExtracted(data)
          toast.success('Successfully updated fields with voice input!')
        } else {
          // Successful extraction! Store in session storage and redirect
          sessionStorage.setItem('prefilledJob', JSON.stringify(data))
          toast.success('Successfully extracted details! Redirecting...')
          router.push('/farmer/jobs/new')
        }
      }
    } catch (err) {
      console.error('Extraction failed:', err)
      toast.error('Failed to process. Please fill manually.')
    } finally {
      setIsExtracting(false)
      setIsCapturing(false)
    }
  }

  const reset = () => {
    stopListening()
    setIsCapturing(false)
    setIsExtracting(false)
    setFullTranscript('')
    setErrorMsg(null)
  }

  // Handle Errors
  if (error && isCapturing) {
    if (error === 'not-allowed') {
      toast.error('Mic permission denied. Please enable it.')
      reset()
    } else if (error === 'no-speech') {
        // No speech detected, handled during toggle capture or handled by user canceling.
    }
  }

  return (
    <>
      <Button
        onClick={toggleCapture}
        disabled={isExtracting}
        className="w-full h-24 bg-white hover:bg-gray-50 text-gray-900 border-2 border-dashed border-blue-200 rounded-3xl shadow-xl shadow-blue-50/50 flex items-center justify-between px-8 relative overflow-hidden group"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {isCapturing ? (
              <div className="relative">
                <Mic className="w-6 h-6 text-blue-600 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </div>
            ) : (
              <Mic className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-blue-400 mb-0.5 uppercase tracking-widest leading-none">
                {isCapturing ? "Recording Now..." : "Quick: Post by Speaking"}
            </p>
            <span className="text-xl font-bold flex items-center gap-2 text-gray-900 tracking-tight">
              {label || "Speak to Post Job"} <Sparkles className="w-5 h-5 text-yellow-500" />
            </span>
          </div>
        </div>

        {isExtracting ? (
             <div className="flex items-center gap-3 pr-4">
                <span className="text-xs font-black text-gray-400 uppercase">Extracting...</span>
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
             </div>
        ) : (
            <div className="flex items-center gap-2 pr-4">
                {isCapturing && <span className="text-xs font-black text-red-500 uppercase flex items-center gap-2">Stop &amp; Extract <ChevronDown className="w-4 h-4 rotate-[270deg]" /></span>}
                {!isCapturing && <ChevronRight className="w-6 h-6 opacity-30 group-hover:translate-x-1 transition-transform" /> }
            </div>
        )}

        {/* Pulse effect background */}
        {isCapturing && (
          <div className="absolute inset-0 bg-blue-50/50 animate-pulse pointer-events-none" />
        )}
      </Button>

      {/* Voice Transcript Modal Overlay */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <Card className="w-full max-w-lg border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white animate-in zoom-in-95 fade-in">
            <CardContent className="p-10 text-center space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Listening Now</span>
                </div>
                <button onClick={reset} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black text-gray-900 leading-tight">"Describe your requirements"</h3>
                <div className="min-h-[160px] p-8 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex items-center justify-center overflow-y-auto max-h-[300px]">
                    <p className="text-lg font-medium text-gray-400 leading-relaxed italic">
                        {fullTranscript || transcript || "Speak now... for example: 'I need 5 workers for rice harvesting in Village X starting Monday, daily wage 500'"}
                    </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                    onClick={reset}
                    variant="outline" 
                    className="flex-1 h-20 rounded-[1.5rem] text-sm font-black uppercase tracking-widest border-2"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleExtraction}
                    disabled={isExtracting}
                    className="flex-1 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                >
                    {isExtracting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Extracting...</>
                    ) : (
                      "Confirm & Extract"
                    )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
