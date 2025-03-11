-- Backup current notaries table
CREATE TABLE IF NOT EXISTS notaries_backup_march2024 AS 
SELECT * FROM notaries;

-- Create new table for fresh data
CREATE TABLE IF NOT EXISTS notaries_new (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    email text,
    phone text,
    address text,
    city text,
    state text,
    zip text,
    latitude double precision,
    longitude double precision,
    services text[] DEFAULT '{}',
    rating double precision,
    review_count integer DEFAULT 0,
    is_available_now boolean DEFAULT false,
    accepts_online_booking boolean DEFAULT false,
    business_hours jsonb,
    profile_image_url text,
    license_number text,
    license_expiry timestamptz,
    insurance_verified boolean DEFAULT false,
    background_check_verified boolean DEFAULT false,
    service_areas text,
    languages text[] DEFAULT '{}',
    certifications text[] DEFAULT '{}',
    about text,
    pricing jsonb,
    place_id text UNIQUE,
    specialized_services text[] DEFAULT '{}',
    business_type text,
    service_radius_miles integer,
    remote_notary_states text[] DEFAULT '{}',
    featured boolean DEFAULT false,
    website text,
    review_summary text,
    last_updated timestamptz DEFAULT now(),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT valid_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR
        (latitude >= -90 AND latitude <= 90 AND longitude >= -180 AND longitude <= 180)
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notaries_new_location ON notaries_new (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_notaries_new_rating ON notaries_new (rating);
CREATE INDEX IF NOT EXISTS idx_notaries_new_services ON notaries_new USING gin (services);
CREATE INDEX IF NOT EXISTS idx_notaries_new_city_state ON notaries_new (city, state);

-- Grant necessary permissions
ALTER TABLE notaries_new ENABLE ROW LEVEL SECURITY;

-- Create policy for read access
CREATE POLICY "Enable read access for all users" ON notaries_new
    FOR SELECT
    USING (true);

-- Create policy for insert access
CREATE POLICY "Enable insert access for service role" ON notaries_new
    FOR INSERT
    WITH CHECK (true); 