-- Add service_types column to notaries_new table
ALTER TABLE notaries_new
ADD COLUMN IF NOT EXISTS service_types jsonb DEFAULT '{}'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN notaries_new.service_types IS 'Service types offered by the notary including mobile, 24-hour, remote, online booking, etc.';

-- Add index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_notaries_services ON notaries_new USING gin (service_types); 