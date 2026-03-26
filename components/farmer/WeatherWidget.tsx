'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudRain, Sun, Wind, Thermometer, AlertTriangle, Loader2 } from 'lucide-react'

interface WeatherData {
  temp: number;
  condition: string;
  rainProb: number;
  windSpeed: number;
  date: string;
}

interface WeatherWidgetProps {
  lat: number;
  lng: number;
}

export function WeatherWidget({ lat, lng }: WeatherWidgetProps) {
  const [forecast, setForecast] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        // REAL-TIME API (Replace with your actual weather API)
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=${lat},${lng}&days=4`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }
        const data = await response.json();

        // Map the API response to the WeatherData interface
        const formattedData: WeatherData[] = data.forecast.forecastday.map((day: any, index: number) => ({
          temp: day.day.avgtemp_c,
          condition: day.day.condition.text,
          rainProb: day.day.daily_chance_of_rain,
          windSpeed: day.day.maxwind_kph,
          date: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }),
        }));

        setForecast(formattedData);
      } catch (err) {
        setError('Could not load weather data')
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [lat, lng])

  const generateSuggestions = (data: WeatherData) => {
    const suggestions: { icon: string, text: string, color: string }[] = []
    
    if (data.rainProb > 70) {
      suggestions.push({ icon: "🚫", text: "Avoid harvesting: High rain probability.", color: "text-red-600 bg-red-50" })
    }
    if (data.temp > 35) {
      suggestions.push({ icon: "💧", text: "Irrigation recommended: High heat alert.", color: "text-blue-600 bg-blue-50" })
    }
    if (data.windSpeed > 20) {
      suggestions.push({ icon: "⚠️", text: "Avoid spraying: Strong winds detected.", color: "text-orange-600 bg-orange-50" })
    }
    if (data.date === 'Tomorrow' && data.rainProb > 60) {
      suggestions.push({ icon: "👨‍🌾", text: "Rain expected: Hire extra labour today.", color: "text-green-600 bg-green-50" })
    }

    return suggestions
  }

  if (loading) {
    return (
      <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-gray-100 bg-white/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center h-52 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Gathering Sky Data</p>
        </CardContent>
      </Card>
    )
  }

  if (error) return null

  const allSuggestions = forecast.flatMap(day => generateSuggestions(day))
  const uniqueSuggestions = allSuggestions.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
          <Sun className="w-4 h-4 text-orange-400" /> Life Under Sky
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100" title="Live Update">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-gray-900 font-black uppercase tracking-tighter">Live</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border-0 shadow-2xl shadow-gray-100 overflow-hidden flex flex-col gap-0 transition-all duration-700">
        
        {/* Today Detailed - Scaled Down by ~35% */}
        <div className="p-6 bg-gradient-to-br from-blue-50/50 to-white flex flex-col items-center text-center gap-4 border-b border-gray-50">
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Current Status</p>
          <div className="relative scale-90">
             <Sun className="w-16 h-16 text-yellow-500 drop-shadow-2xl animate-pulse-slow" />
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-red-400" />
             </div>
          </div>
          <div className="space-y-0">
             <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">{forecast[0].temp}<span className="text-2xl text-gray-300">°C</span></h3>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{forecast[0].condition}</p>
          </div>
          <div className="flex gap-8">
             <div className="flex flex-col items-center">
                <p className="text-[7px] font-black text-blue-300 uppercase">Rain</p>
                <p className="text-xs font-bold text-gray-900">{forecast[0].rainProb}%</p>
             </div>
             <div className="flex flex-col items-center">
                <p className="text-[7px] font-black text-blue-300 uppercase">Wind</p>
                <p className="text-xs font-bold text-gray-900">{forecast[0].windSpeed}km/h</p>
             </div>
          </div>
        </div>

        {/* Future Mini Grid - Scaled down padding */}
        <div className="grid grid-cols-3 divide-x divide-gray-50 border-b border-gray-50">
          {forecast.slice(1).map((day, idx) => (
            <div key={idx} className="p-4 flex flex-col items-center text-center gap-1.5 hover:bg-gray-50 transition-colors">
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{day.date}</span>
              {day.rainProb > 50 
                ? <CloudRain className="w-5 h-5 text-blue-500" /> 
                : <Sun className="w-5 h-5 text-yellow-500" />
              }
              <div className="leading-tight">
                <p className="text-lg font-black text-gray-900 leading-none">{day.temp}°</p>
                <p className="text-[7px] font-bold text-gray-400 uppercase mt-1 leading-none">{day.rainProb}% rain</p>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Advisory Section - Scaled down padding */}
        {uniqueSuggestions.length > 0 && (
          <div className="p-5 space-y-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
              <AlertTriangle className="w-2.5 h-2.5 text-orange-500" /> Advisory
            </p>
            <div className="space-y-2">
              {uniqueSuggestions.map((s, i) => (
                <div key={i} className={`p-3 rounded-xl flex items-center gap-3 border border-transparent transition-all hover:border-gray-100 ${s.color}`}>
                   <span className="text-lg flex-shrink-0">{s.icon}</span>
                   <p className="text-[10px] font-bold leading-tight">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
