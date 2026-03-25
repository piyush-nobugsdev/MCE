// User roles
export type UserRole = 'farmer' | 'worker' | 'admin'
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed'
export type PaymentStatus = 'pending' | 'completed' | 'failed'

// Database Types
export interface User {
  id: string
  phone: string | null
  auth_provider: string | null
  created_at: string
  updated_at: string
}

export interface Farmer {
  id: string
  user_id: string
  first_name: string
  last_name: string
  full_name: string
  village: string
  district: string
  state: string
  farm_location: {
    lat: number
    lng: number
  } | null
  rating: number
  total_jobs_posted: number
  created_at: string
  updated_at: string
}

export interface Worker {
  id: string
  user_id: string
  first_name: string
  last_name: string
  full_name: string
  age?: number | null      // Not in SQL, but good to have if we keep UI
  experience?: number | null // Not in SQL, but good to have if we keep UI
  village: string
  district: string
  state: string
  home_location: {
    lat: number
    lng: number
  } | null
  skills: string[]
  travel_distance_preference: number | null
  rating: number
  total_jobs_completed: number
  total_earned: number
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  farmer_id: string
  title: string
  category: string
  description: string | null
  date_range: {
    start_date: string
    end_date: string
  } | null
  start_time: string | null
  end_time: string | null
  workers_needed: number
  location: {
    lat: number
    lng: number
    name: string
  } | null
  wage_type: string | null
  wage_amount: number
  is_negotiable: boolean
  meals_provided: boolean
  transport_provided: boolean
  farmer_code: string | null
  status: JobStatus
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  worker_id: string
  worker_code: string | null
  status: ApplicationStatus
  message?: string | null
  applied_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  job_id: string
  application_id: string
  attendance_confirmed_farmer: boolean
  attendance_confirmed_worker: boolean
  confirmed_at: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  job_id: string
  application_id: string
  amount: number
  payment_method: string | null
  payment_status: PaymentStatus
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface Rating {
  id: string
  rater_id: string
  ratee_id: string
  rating: number
  feedback: string | null
  type: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string | null
  title: string
  message: string
  related_id: string | null
  read_at: string | null
  created_at: string
}

export interface ApplicationWithDetails {
  id: string
  status: string
  message: string | null
  job_id: string
  worker_id: string
  job_title: string
  worker_first_name: string
  worker_age?: number | null
  worker_experience?: number | null
  worker_rating: number | null
}
