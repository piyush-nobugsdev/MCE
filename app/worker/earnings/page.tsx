'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { WorkerNavbar } from '../components/navbar'
import { DollarSign } from 'lucide-react'

interface EarningsData {
  id: string
  amount: number
  status: string
  job_id: string
  job_title: string
  created_at: string
}

export default function WorkerEarningsPage() {
  const [payments, setPayments] = useState<EarningsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarnings = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/auth/phone'
        return
      }

      const { data: worker } = await supabase
        .from('workers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (worker) {
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .eq('worker_id', worker.id)
          .order('created_at', { ascending: false })

        if (paymentsData) {
          const paymentDetails = await Promise.all(
            paymentsData.map(async (p) => {
              const { data: jobData } = await supabase
                .from('jobs')
                .select('title')
                .eq('id', p.job_id)
                .single()

              return {
                ...p,
                job_title: jobData?.title || 'Unknown Job',
              }
            })
          )

          setPayments(paymentDetails)
        }
      }

      setLoading(false)
    }

    fetchEarnings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
  const totalReceived = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings History</h1>
          <p className="text-gray-500 mt-1">View your past jobs and earnings records.</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900">Payment Collection</h4>
            <p className="text-sm text-blue-700">
              Payments are collected directly from the farmer on-site. The app provides this history to help you track your total work and earnings for free.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">${totalEarnings.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Received</p>
                  <p className="text-2xl font-bold text-green-600">${totalReceived.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Table */}
        {payments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No earnings yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Job
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{payment.job_title}</td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : payment.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
