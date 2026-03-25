import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Briefcase, Users, MapPin, DollarSign, CheckCircle, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">FarmWork</div>
          <div className="flex gap-4">
            <Link href="/auth/role-selection">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect Farmers with Workers
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Farm Work Marketplace makes it easy for farmers to post jobs and for workers to find
            opportunities. Manage jobs, track attendance, and handle payments all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/role-selection">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 my-16">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Post & Manage Jobs</h3>
            <p className="text-gray-600">
              Farmers can easily post jobs, set wages, and manage applications from qualified
              workers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Find Opportunities</h3>
            <p className="text-gray-600">
              Workers can browse available jobs, apply directly, and track their applications
              status.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Handle Payments</h3>
            <p className="text-gray-600">
              Track attendance, manage payments, and keep records organized in one secure
              platform.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Farmer Side */}
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">For Farmers</h3>
              <div className="space-y-4">
                {[
                  'Sign up and create your farm profile',
                  'Post job openings with details and wage',
                  'Review worker applications',
                  'Track worker attendance',
                  'Process payments securely',
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Side */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-6">For Workers</h3>
              <div className="space-y-4">
                {[
                  'Sign up with your profile information',
                  'Browse jobs in your location',
                  'Apply to opportunities you like',
                  'Track application status',
                  'Get paid for completed work',
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FarmWork?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Location-Based',
                description: 'Find jobs near you using GPS or location search',
              },
              {
                icon: CheckCircle,
                title: 'Easy Tracking',
                description: 'Track attendance and payment status in real-time',
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Your data is protected with enterprise-grade security',
              },
              {
                icon: DollarSign,
                title: 'Fair Pricing',
                description: 'Transparent wage information for all jobs',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="flex gap-4">
                  <Icon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of farmers and workers using FarmWork to connect and grow their
            businesses.
          </p>
          <Link href="/auth/role-selection">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">FarmWork</h3>
              <p className="text-sm">Connecting farmers and workers for agricultural success.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Farmers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Find Workers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Workers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Find Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Track Earnings
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 FarmWork. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
