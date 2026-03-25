'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Users } from 'lucide-react'

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Farm Work Marketplace
          </h1>
          <p className="text-gray-600">
            Choose your role to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <Link href="/auth/farmer-signup">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">I'm a Farmer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Post jobs, hire workers, and manage your farm operations
                </CardDescription>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Continue as Farmer
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Worker Card */}
          <Link href="/auth/worker-signup">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">I'm a Worker</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Find jobs, apply to opportunities, and earn income
                </CardDescription>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue as Worker
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
