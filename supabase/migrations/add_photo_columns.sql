-- Add photo columns to notaries_new table
ALTER TABLE notaries_new
ADD COLUMN IF NOT EXISTS photo jsonb DEFAULT '{}'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN notaries_new.photo IS 'Photo information including URL and attribution';

-- Add index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_notaries_photo ON notaries_new USING gin (photo); 