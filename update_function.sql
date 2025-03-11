-- Drop existing versions of the function
DROP FUNCTION IF EXISTS public.search_tier1_notaries(double precision, double precision, double precision, integer, double precision, integer);

-- Create the new function with better debugging
CREATE OR REPLACE FUNCTION public.search_tier1_notaries(
    p_latitude double precision,
    p_longitude double precision,
    p_radius double precision,
    p_limit integer,
    p_min_rating double precision DEFAULT 0,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    created_at timestamptz,
    name text,
    email text,
    phone text,
    address text,
    city text,
    state text,
    zip text,
    latitude double precision,
    longitude double precision,
    services text[],
    rating double precision,
    review_count integer,
    is_available_now boolean,
    accepts_online_booking boolean,
    business_hours jsonb,
    profile_image_url text,
    license_number text,
    license_expiry timestamptz,
    insurance_verified boolean,
    background_check_verified boolean,
    service_areas text,
    languages text[],
    certifications text[],
    about text,
    pricing jsonb,
    place_id text,
    specialized_services text[],
    business_type text,
    service_radius_miles integer,
    remote_notary_states text[],
    featured boolean,
    website text,
    review_summary text,
    last_updated timestamptz,
    distance double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result_row notaries%ROWTYPE;
    total_count integer;
BEGIN
    -- Log input parameters
    RAISE NOTICE 'Search parameters: lat=%, lon=%, radius=%, limit=%, min_rating=%, offset=%',
        p_latitude, p_longitude, p_radius, p_limit, p_min_rating, p_offset;

    -- Get total count before filtering
    SELECT COUNT(*) INTO total_count FROM notaries;
    RAISE NOTICE 'Total notaries in database: %', total_count;

    -- Return results with explicit column selection
    RETURN QUERY
    WITH distance_calc AS (
        SELECT 
            n.*,
            (2 * 3961 * asin(sqrt(
                power(sin(radians((n.latitude - p_latitude)/2)), 2) +
                cos(radians(p_latitude)) * cos(radians(n.latitude)) *
                power(sin(radians((n.longitude - p_longitude)/2)), 2)
            ))) as distance
        FROM notaries n
        WHERE n.latitude IS NOT NULL 
          AND n.longitude IS NOT NULL
    )
    SELECT 
        d.id,
        d.created_at,
        d.name,
        d.email,
        d.phone,
        d.address,
        d.city,
        d.state,
        d.zip,
        d.latitude,
        d.longitude,
        d.services,
        d.rating,
        d.review_count,
        d.is_available_now,
        d.accepts_online_booking,
        d.business_hours,
        d.profile_image_url,
        d.license_number,
        d.license_expiry,
        d.insurance_verified,
        d.background_check_verified,
        d.service_areas,
        d.languages,
        d.certifications,
        d.about,
        d.pricing,
        d.place_id,
        d.specialized_services,
        d.business_type,
        d.service_radius_miles,
        d.remote_notary_states,
        d.featured,
        d.website,
        d.review_summary,
        d.last_updated,
        d.distance
    FROM distance_calc d
    WHERE d.distance <= p_radius
      AND (d.rating >= p_min_rating OR d.rating IS NULL)
    ORDER BY
        d.distance ASC,
        d.rating DESC NULLS LAST,
        d.review_count DESC NULLS LAST
    LIMIT p_limit
    OFFSET p_offset;

    -- Get count of results
    GET DIAGNOSTICS total_count = ROW_COUNT;
    RAISE NOTICE 'Found % notaries within % miles of (%, %)',
        total_count, p_radius, p_latitude, p_longitude;

    RETURN;
END;
$$;