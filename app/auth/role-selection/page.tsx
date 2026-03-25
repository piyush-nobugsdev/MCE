'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sprout, Users } from 'lucide-react'

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-green-700 mb-2 uppercase tracking-tight">
            Farm Work Marketplace
          </h1>
          <p className="text-xl text-gray-500 font-medium uppercase tracking-widest">
            CHOOSE YOUR ROLE TO GET STARTED
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <Link href="/auth/farmer/login" className="group">
            <Card className="h-full border-0 shadow-2xl shadow-green-100 group-hover:shadow-green-200 transition-all duration-300 rounded-[2.5rem] overflow-hidden group-hover:-translate-y-2">
              <CardHeader className="text-center pt-10 pb-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-8 rounded-[2rem] group-hover:scale-110 transition-transform duration-300">
                    <Sprout className="w-12 h-12 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 uppercase tracking-tight">I'm a Farmer</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-8 pb-10">
                <CardDescription className="mb-8 text-lg font-medium">
                  POST JOBS, HIRE WORKERS, AND MANAGE YOUR FARM
                </CardDescription>
                <Button className="w-full h-16 bg-green-600 hover:bg-green-700 rounded-2xl text-xl font-black uppercase tracking-wide shadow-xl shadow-green-200">
                  Farmer Login
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Worker Card */}
          <Link href="/auth/worker/login" className="group">
            <Card className="h-full border-0 shadow-2xl shadow-blue-100 group-hover:shadow-blue-200 transition-all duration-300 rounded-[2.5rem] overflow-hidden group-hover:-translate-y-2">
              <CardHeader className="text-center pt-10 pb-4">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-8 rounded-[2rem] group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 uppercase tracking-tight">I'm a Worker</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-8 pb-10">
                <CardDescription className="mb-8 text-lg font-medium">
                  FIND JOBS, APPLY TO OPPORTUNITIES, AND EARN
                </CardDescription>
                <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl text-xl font-black uppercase tracking-wide shadow-xl shadow-blue-200">
                  Worker Login
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
