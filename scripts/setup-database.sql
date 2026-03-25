-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE,
  auth_provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(120) NOT NULL,
  last_name  VARCHAR(120) NOT NULL,
  full_name  VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  village VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  farm_location JSONB, -- {lat: number, lng: number}
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs_posted INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(120) NOT NULL,
  last_name  VARCHAR(120) NOT NULL,
  full_name  VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  village VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  home_location JSONB, -- {lat: number, lng: number}
  skills TEXT[], -- ARRAY of skill tags
  travel_distance_preference INTEGER, -- in km
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date_range JSONB, -- {start_date: string, end_date: string}
  start_time TIME,
  end_time TIME,
  workers_needed INTEGER NOT NULL,
  description TEXT,
  location JSONB, -- {lat: number, lng: number}
  wage_type VARCHAR(50), -- hourly, daily, per_task
  wage_amount DECIMAL(10,2) NOT NULL,
  is_negotiable BOOLEAN DEFAULT FALSE,
  meals_provided BOOLEAN DEFAULT FALSE,
  transport_provided BOOLEAN DEFAULT FALSE,
  farmer_code VARCHAR(6) UNIQUE,
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  worker_code VARCHAR(6), -- temporary code for anonymous tracking
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, completed
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  worker_code VARCHAR(6),
  attendance_confirmed_farmer BOOLEAN DEFAULT FALSE,
  attendance_confirmed_worker BOOLEAN DEFAULT FALSE,
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50), -- cash, upi, bank_transfer
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ratee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  type VARCHAR(50), -- farmer_to_worker, worker_to_farmer
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100), -- job_applied, application_accepted, attendance_confirmed, payment_received, rating_received
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- job_id or application_id
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_farmers_user_id ON farmers(user_id);
CREATE INDEX idx_workers_user_id ON workers(user_id);
CREATE INDEX idx_jobs_farmer_id ON jobs(farmer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_worker_id ON applications(worker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_attendance_job_id ON attendance(job_id);
CREATE INDEX idx_attendance_application_id ON attendance(application_id);
CREATE INDEX idx_payments_job_id ON payments(job_id);
CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for farmers table
CREATE POLICY "Anyone can view farmer profiles" ON farmers FOR SELECT
  USING (true);

CREATE POLICY "Farmers can update own profile" ON farmers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Farmers can insert own profile" ON farmers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for workers table
CREATE POLICY "Anyone can view worker profiles" ON workers FOR SELECT
  USING (true);

CREATE POLICY "Workers can update own profile" ON workers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Workers can insert own profile" ON workers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Farmers can insert own jobs" ON jobs FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM farmers WHERE id = farmer_id));

CREATE POLICY "Farmers can update own jobs" ON jobs FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM farmers WHERE id = farmer_id));

CREATE POLICY "Farmers can delete own jobs" ON jobs FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM farmers WHERE id = farmer_id));

-- RLS Policies for applications table
CREATE POLICY "Anyone can view applications" ON applications FOR SELECT
  USING (true);

CREATE POLICY "Workers can insert applications" ON applications FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM workers WHERE id = worker_id));

CREATE POLICY "Workers and farmers can update applications" ON applications FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM workers WHERE id = worker_id) OR
    auth.uid() IN (SELECT user_id FROM farmers WHERE id IN (SELECT farmer_id FROM jobs WHERE id = job_id))
  );

-- RLS Policies for attendance table
CREATE POLICY "Anyone can view attendance" ON attendance FOR SELECT
  USING (true);

CREATE POLICY "Workers and farmers can manage attendance" ON attendance FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM workers WHERE worker_code = attendance.worker_code) OR
    auth.uid() IN (SELECT user_id FROM farmers WHERE id IN (SELECT farmer_id FROM jobs WHERE id = job_id))
  );

CREATE POLICY "Workers and farmers can update attendance" ON attendance FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM workers WHERE worker_code = attendance.worker_code) OR
    auth.uid() IN (SELECT user_id FROM farmers WHERE id IN (SELECT farmer_id FROM jobs WHERE id = job_id))
  );

-- RLS Policies for payments table
CREATE POLICY "Anyone can view payments" ON payments FOR SELECT
  USING (true);

CREATE POLICY "Farmers can insert payments" ON payments FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM farmers WHERE id IN (SELECT farmer_id FROM jobs WHERE id = job_id)));

-- RLS Policies for ratings table
CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create ratings" ON ratings FOR INSERT
  WITH CHECK (auth.uid() = rater_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications" ON notifications FOR INSERT
  WITH CHECK (true);
