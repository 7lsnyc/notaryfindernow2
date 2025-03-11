-- Add booking-related columns to notaries_new table
ALTER TABLE notaries_new
ADD COLUMN IF NOT EXISTS has_online_booking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS booking_url text,
ADD COLUMN IF NOT EXISTS booking_platform text;

-- Add comment to explain the columns
COMMENT ON COLUMN notaries_new.has_online_booking IS 'Indicates if the notary offers online booking';
COMMENT ON COLUMN notaries_new.booking_url IS 'Direct URL to book an appointment with the notary';
COMMENT ON COLUMN notaries_new.booking_platform IS 'The platform used for online booking (e.g. Calendly, Square, etc)';

-- Create an index on has_online_booking for faster filtering
CREATE INDEX IF NOT EXISTS idx_notaries_booking ON notaries_new (has_online_booking); 