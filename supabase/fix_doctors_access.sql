-- Allow inserting doctors (for hospital admin creating doctors)
DROP POLICY IF EXISTS "doctors_insert_all" ON public.doctors;
CREATE POLICY "doctors_insert_all" ON public.doctors 
    FOR INSERT WITH CHECK (true);

-- Allow updating doctors
DROP POLICY IF EXISTS "doctors_update_all" ON public.doctors;
CREATE POLICY "doctors_update_all" ON public.doctors 
    FOR UPDATE USING (true);

-- Make sure doctors are readable by everyone
DROP POLICY IF EXISTS "doctors_read_all" ON public.doctors;
CREATE POLICY "doctors_read_all" ON public.doctors 
    FOR SELECT USING (true);
