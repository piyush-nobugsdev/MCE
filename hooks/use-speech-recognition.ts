'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Browser does not support Speech Recognition.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          onResult(event.results[i][0].transcript)
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setTranscript(interim)
    }

    recognition.onerror = (event: any) => {
      setError(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [onResult])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
        try {
            recognitionRef.current.start()
        } catch (e) {
            console.error('Speech recognition error on start:', e)
        }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  }
}
