-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--------------------------------------------------
-- USERS TABLE (linked with Supabase Auth)
--------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE,
  auth_provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- FARMERS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,

  full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,

  village VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,

  farm_location JSONB,

  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs_posted INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- WORKERS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,

  full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,

  age INTEGER,
  experience INTEGER,

  village VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,

  home_location JSONB,

  skills TEXT[],
  travel_distance_preference INTEGER,

  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs_completed INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- JOBS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,

  date_range JSONB,

  start_time TIME,
  end_time TIME,

  workers_needed INTEGER NOT NULL CHECK (workers_needed > 0),

  description TEXT,

  location JSONB,

  wage_type VARCHAR(50),
  wage_amount DECIMAL(10,2) NOT NULL,

  is_negotiable BOOLEAN DEFAULT FALSE,
  meals_provided BOOLEAN DEFAULT FALSE,
  transport_provided BOOLEAN DEFAULT FALSE,

  farmer_code VARCHAR(6) UNIQUE,

  status VARCHAR(50) DEFAULT 'open'
    CHECK (status IN ('open','in_progress','completed','cancelled')),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- APPLICATIONS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,

  worker_code VARCHAR(6),

  status VARCHAR(50) DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','rejected','completed')),

  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(job_id, worker_id)
);

--------------------------------------------------
-- ATTENDANCE TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  attendance_confirmed_farmer BOOLEAN DEFAULT FALSE,
  attendance_confirmed_worker BOOLEAN DEFAULT FALSE,

  confirmed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- PAYMENTS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  amount DECIMAL(10,2) NOT NULL,

  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending'
    CHECK (payment_status IN ('pending','completed','failed')),

  paid_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- RATINGS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ratee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),

  feedback TEXT,

  type VARCHAR(50),

  created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- REPORTS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  reason VARCHAR(255) NOT NULL,
  details TEXT,

  status VARCHAR(50) DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- NOTIFICATIONS TABLE
--------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  related_id UUID,

  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- INDEXES
--------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_farmer_id ON jobs(farmer_id);

CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker ON applications(worker_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

--------------------------------------------------
-- ENABLE RLS
--------------------------------------------------

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

--------------------------------------------------
-- RLS POLICIES (BASIC EXAMPLES)
--------------------------------------------------

-- Jobs: Anyone can read open jobs
CREATE POLICY "Anyone can read open jobs" ON jobs
  FOR SELECT USING (status = 'open');

-- Jobs: Farmers can manage their own jobs
CREATE POLICY "Farmers can manage own jobs" ON jobs
  FOR ALL USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Applications: Workers can manage their own applications
CREATE POLICY "Workers can manage own applications" ON applications
  FOR ALL USING (worker_id IN (SELECT id FROM workers WHERE user_id = auth.uid()));

-- Applications: Farmers can see applications for their jobs
CREATE POLICY "Farmers can see job applications" ON applications
  FOR SELECT USING (job_id IN (SELECT id FROM jobs WHERE farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid())));
