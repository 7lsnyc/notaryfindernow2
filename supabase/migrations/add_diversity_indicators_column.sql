-- Add diversity_indicators column to notaries_new table
ALTER TABLE notaries_new
ADD COLUMN IF NOT EXISTS diversity_indicators jsonb DEFAULT '{}'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN notaries_new.diversity_indicators IS 'Diversity indicators such as black-owned, LGBTQ+ friendly, women-owned, veteran-owned';

-- Add index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_notaries_diversity ON notaries_new USING gin (diversity_indicators); 