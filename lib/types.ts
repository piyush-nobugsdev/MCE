// Shared Utility Types
export type UserRole = 'farmer' | 'worker' | 'admin';
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'withdrawn';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface GPSLocation {
  lat: number;
  lng: number;
  latitude?: number; // Alias
  longitude?: number; // Alias
  name?: string; // Common name like "Mango Orchard"
  address?: string; // Full text address
  address_name?: string; // Legacy/Alias for compatibility
}

// Database Types
export interface User {
  id: string;
  phone: string | null;
  auth_provider: string | null;
  created_at: string;
  updated_at: string;
}

// NEW: Separate Farm entity for multiple address support
export interface Farm {
  id: string;
  farmer_id: string;
  name: string; // "Home Plot", "North Field"
  location: GPSLocation;
  village: string;
  created_at: string;
}

export interface Farmer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  village: string;
  district: string;
  state: string;
  rating: number;
  total_jobs_posted: number;
  created_at: string;
  updated_at: string;
}

export interface Worker {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age?: number | null;
  experience?: number | null;
  village: string;
  district: string;
  state: string;
  home_location: GPSLocation | null;
  skills: string[];
  travel_distance_preference: number | null;
  rating: number;
  total_jobs_completed: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  farmer_id: string;
  farm_id: string; // Linked to the specific saved farm
  title: string;
  category: string;
  description: string | null;
  date_range: {
    start_date: string;
    end_date: string;
  } | null;
  start_time: string | null;
  end_time: string | null;
  workers_needed: number;
  location: GPSLocation; // Inherited from Farm but stored here for history
  wage_type: string | null;
  wage_amount: number;
  is_negotiable: boolean;
  meals_provided: boolean;
  transport_provided: boolean;
  farmer_code: string | null; // For verification
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

// UI & JOIN Types (Corrected for consistency)
export interface ApplicationWithDetails {
  id: string;
  status: ApplicationStatus;
  applied_at: string;
  worker_code: string;
  worker_first_name: string;
  worker_last_name: string;
  worker_age?: number | null;
  worker_experience?: number | null;
  job_title: string;
  job_status: JobStatus;
  worker_rating: number;
  worker_completed_jobs: number;
  worker_skills: string[];
  distance: number | null;
  farmer_rated_worker?: boolean;
  farmer_completed?: boolean;
  worker_completed?: boolean;
  message?: string | null;
}

export interface WorkerApplicationDetails {
  id: string;
  status: ApplicationStatus;
  applied_at: string;
  worker_rated_farmer: boolean;
  job_id: string;
  job_title: string;
  job_location: GPSLocation;
  job_wage: number;
  job_status: JobStatus;
  farmer_code: string;
  farmer_first_name: string;
  farmer_farm_name: string;
  farmer_completed?: boolean;
  worker_completed?: boolean;
}

