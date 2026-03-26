'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, IndianRupee, Globe, Eye, Leaf } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { Language } from '@/lib/i18n/translations'

export default function Home() {
  const { t, language, setLanguage } = useLanguage()

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Language Toggle - Enhanced Colors */}
      <header className="border-b-2 border-green-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent">{t('farmwork')}</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    language === lang.code 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Link href="/auth/role-selection">
              <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">{t('sign_in')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with Gradient Background */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('home_title')}
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            {t('home_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/role-selection">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white w-full sm:w-auto">
                {t('get_started')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto">
              {t('learn_more')}
            </Button>
          </div>
        </div>

        {/* Features Grid - 4 Features with Vibrant Colors */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {/* Feature 1: Community */}
          <div className="border-2 border-amber-200 bg-amber-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-amber-400 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_1_title')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('feature_1_desc')}
            </p>
          </div>

          {/* Feature 2: Fair Wages */}
          <div className="border-2 border-green-200 bg-green-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
              <IndianRupee className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_2_title')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('feature_2_desc')}
            </p>
          </div>

          {/* Feature 3: Multilingual */}
          <div className="border-2 border-blue-200 bg-blue-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_3_title')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('feature_3_desc')}
            </p>
          </div>

          {/* Feature 4: Transparency */}
          <div className="border-2 border-orange-200 bg-orange-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('feature_4_title')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('feature_4_desc')}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            {t('how_it_works')}
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Farmer Side - Green */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-10 rounded-xl">
              <h3 className="text-2xl font-bold text-green-900 mb-8">{t('for_farmers')}</h3>
              <div className="space-y-5">
                {[
                  t('farmer_step_1'),
                  t('farmer_step_2'),
                  t('farmer_step_3'),
                  t('farmer_step_4'),
                  t('farmer_step_5'),
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Side - Blue */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-10 rounded-xl">
              <h3 className="text-2xl font-bold text-blue-900 mb-8">{t('for_workers')}</h3>
              <div className="space-y-5">
                {[
                  t('worker_step_1'),
                  t('worker_step_2'),
                  t('worker_step_3'),
                  t('worker_step_4'),
                  t('worker_step_5'),
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-500 via-amber-400 to-orange-500 p-12 rounded-xl text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('ready_to_start')}
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto opacity-95">
            {t('signup_cta')}
          </p>
          <Link href="/auth/role-selection">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
              {t('get_started')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-green-200 bg-gradient-to-b from-gray-50 to-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-green-500 rounded flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{t('farmwork')}</h3>
              </div>
              <p className="text-sm text-gray-600">Connecting farmers and workers directly for fair work and fair pay.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('for_farmers')}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600 transition">Post a Job</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Find Workers</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Manage Jobs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">{t('for_workers')}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Find Jobs</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Track Earnings</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Applications</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 {t('farmwork')}. {t('footer_tagline')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
