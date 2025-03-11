-- Add reviews column to notaries_new table
ALTER TABLE notaries_new
ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '[]'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN notaries_new.reviews IS 'Array of reviews including author, rating, text, and time';

-- Add index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_notaries_reviews ON notaries_new USING gin (reviews); 