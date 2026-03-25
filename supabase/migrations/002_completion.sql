-- Add mutual completion tracking to applications table
-- farmer_completed: true when the farmer confirms the job is done
-- worker_completed: true when the worker confirms the job is done
-- Both must be true for a job to be "officially completed" for that worker
ALTER TABLE applications ADD COLUMN IF NOT EXISTS farmer_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS worker_completed BOOLEAN DEFAULT FALSE;

-- Update total_jobs_completed on workers when both sides confirm
CREATE OR REPLACE FUNCTION update_worker_job_count()
RETURNS TRIGGER AS $$
BEGIN
  -- When both sides have confirmed, increment completed job count
  IF NEW.farmer_completed = TRUE AND NEW.worker_completed = TRUE
     AND (OLD.farmer_completed = FALSE OR OLD.worker_completed = FALSE) THEN
    UPDATE workers
    SET total_jobs_completed = total_jobs_completed + 1
    WHERE id = NEW.worker_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_worker_job_count
AFTER UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_worker_job_count();
