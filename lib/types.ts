// User roles
export type UserRole = 'farmer' | 'worker' | 'admin'
export type JobStatus = 'posted' | 'in_progress' | 'completed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// Database Types
export interface User {
  id: string
  email: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Farmer {
  id: string
  user_id: string
  name: string
  farm_name: string
  location: string
  latitude: number
  longitude: number
  bio: string | null
  avatar_url: string | null
  rating: number
  total_jobs_posted: number
  created_at: string
  updated_at: string
}

export interface Worker {
  id: string
  user_id: string
  name: string
  location: string
  latitude: number
  longitude: number
  bio: string | null
  avatar_url: string | null
  skills: string[]
  rating: number
  total_jobs_completed: number
  anonymous_code: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  farmer_id: string
  title: string
  description: string
  location: {
    lat: number
    lng: number
    name: string
  } | string
  latitude?: number
  longitude?: number
  category: string
  workers_needed: number
  wage_amount: number
  wage_type?: string
  start_date: string
  end_date: string
  status: JobStatus
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  worker_id: string
  status: ApplicationStatus
  proposed_wage: number | null
  message: string | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  job_id: string
  worker_id: string
  date: string
  hours_worked: number
  confirmed_by_farmer: boolean
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  job_id: string
  worker_id: string
  amount: number
  status: PaymentStatus
  paid_date: string | null
  created_at: string
  updated_at: string
}

export interface Rating {
  id: string
  rater_id: string
  rated_user_id: string
  rating: number
  review: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_user_id: string
  job_id: string | null
  reason: string
  description: string
  status: 'pending' | 'reviewed' | 'resolved'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'job' | 'application' | 'payment' | 'rating' | 'system'
  read: boolean
  action_url: string | null
  created_at: string
}
