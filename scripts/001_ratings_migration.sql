-- Add rating system columns and triggers
-- Run this in Supabase SQL Editor or via migration script

-- Add has_been_rated columns to applications to prevent double rating
ALTER TABLE applications ADD COLUMN IF NOT EXISTS farmer_rated_worker BOOLEAN DEFAULT FALSE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS worker_rated_farmer BOOLEAN DEFAULT FALSE;

-- Update worker rating average trigger
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workers
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM ratings
    WHERE ratee_id = NEW.ratee_id
    AND type = 'farmer_to_worker'
  )
  WHERE user_id = NEW.ratee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_worker_rating
AFTER INSERT ON ratings
FOR EACH ROW
WHEN (NEW.type = 'farmer_to_worker')
EXECUTE FUNCTION update_worker_rating();

-- Update farmer rating average trigger
CREATE OR REPLACE FUNCTION update_farmer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE farmers
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM ratings
    WHERE ratee_id = NEW.ratee_id
    AND type = 'worker_to_farmer'
  )
  WHERE user_id = NEW.ratee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_farmer_rating
AFTER INSERT ON ratings
FOR EACH ROW
WHEN (NEW.type = 'worker_to_farmer')
EXECUTE FUNCTION update_farmer_rating();

-- RLS policy for ratings (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'ratings' AND policyname = 'Users can insert own ratings'
  ) THEN
    CREATE POLICY "Users can insert own ratings" ON ratings
    FOR INSERT WITH CHECK (auth.uid() = rater_id);
  END IF;
END $$;