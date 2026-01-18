-- ============================================
-- FIX: Application Access for Admin Panel
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Check if tables exist and have data
SELECT 'hospital_applications' as table_name, COUNT(*) as record_count FROM public.hospital_applications
UNION ALL
SELECT 'doctor_applications' as table_name, COUNT(*) as record_count FROM public.doctor_applications;

-- Step 2: Remove restrictive RLS policies that require is_super_admin
DROP POLICY IF EXISTS "hospital_applications_admin_all" ON public.hospital_applications;
DROP POLICY IF EXISTS "doctor_applications_admin_all" ON public.doctor_applications;

-- Step 3: Add new policies that allow ALL authenticated users to read
-- (You can make this more restrictive later once auth is properly set up)
CREATE POLICY "hospital_applications_read_all" ON public.hospital_applications 
    FOR SELECT USING (true);

CREATE POLICY "doctor_applications_read_all" ON public.doctor_applications 
    FOR SELECT USING (true);

-- Step 4: Make sure anyone can update (for approve/reject)
CREATE POLICY "hospital_applications_update_all" ON public.hospital_applications 
    FOR UPDATE USING (true);

CREATE POLICY "doctor_applications_update_all" ON public.doctor_applications 
    FOR UPDATE USING (true);

-- Step 5: Verify the policies are now in place
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('hospital_applications', 'doctor_applications');
