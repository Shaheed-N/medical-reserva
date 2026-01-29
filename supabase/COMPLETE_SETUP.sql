-- ============================================
-- MEDPLUS DATABASE SETUP - RUN ALL OF THESE
-- ============================================

-- 1. CREATE STORAGE BUCKET FOR HOSPITAL IMAGES
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('hospital-images', 'hospital-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hospital-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hospital-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hospital-images' AND auth.role() = 'authenticated');


-- 2. FIX HOSPITALS TABLE RLS POLICIES
-- ============================================
DROP POLICY IF EXISTS "hospitals_insert_all" ON public.hospitals;
CREATE POLICY "hospitals_insert_all" ON public.hospitals 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "hospitals_update_all" ON public.hospitals;
CREATE POLICY "hospitals_update_all" ON public.hospitals 
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "hospitals_read_all" ON public.hospitals;
CREATE POLICY "hospitals_read_all" ON public.hospitals 
    FOR SELECT USING (true);


-- 3. FIX DOCTORS TABLE RLS POLICIES
-- ============================================
DROP POLICY IF EXISTS "doctors_insert_all" ON public.doctors;
CREATE POLICY "doctors_insert_all" ON public.doctors 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "doctors_update_all" ON public.doctors;
CREATE POLICY "doctors_update_all" ON public.doctors 
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "doctors_read_all" ON public.doctors;
CREATE POLICY "doctors_read_all" ON public.doctors 
    FOR SELECT USING (true);


-- 4. FIX USERS TABLE RLS POLICIES
-- ============================================
DROP POLICY IF EXISTS "users_insert_all" ON public.users;
CREATE POLICY "users_insert_all" ON public.users 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "user_roles_insert_all" ON public.user_roles;
CREATE POLICY "user_roles_insert_all" ON public.user_roles 
    FOR INSERT WITH CHECK (true);


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if policies are created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('hospitals', 'doctors', 'users', 'user_roles')
ORDER BY tablename, policyname;

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'hospital-images';
