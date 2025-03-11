-- Function to create RLS policy for insert access
CREATE OR REPLACE FUNCTION create_insert_policy()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Enable insert access for service role" ON notaries_new;
  
  -- Create new policy
  CREATE POLICY "Enable insert access for service role" ON notaries_new
    FOR INSERT
    WITH CHECK (true);
END;
$$; 