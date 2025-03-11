-- Add booking_info column to notaries_new table
ALTER TABLE notaries_new
ADD COLUMN IF NOT EXISTS booking_info jsonb DEFAULT '{}'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN notaries_new.booking_info IS 'Booking information including URL and platform used for online booking';

-- Add index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_notaries_booking_info ON notaries_new USING gin (booking_info); 