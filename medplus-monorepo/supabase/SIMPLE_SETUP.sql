-- ============================================
-- MEDPLUS DATABASE SETUP - SIMPLIFIED V2
-- ============================================

-- 1. FIX HOSPITALS TABLE RLS POLICIES
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


-- 2. FIX DOCTORS TABLE RLS POLICIES
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


-- 3. FIX DOCTOR BRANCH ASSIGNMENTS RLS POLICIES
-- ============================================
DROP POLICY IF EXISTS "doctor_branch_assignments_insert_all" ON public.doctor_branch_assignments;
CREATE POLICY "doctor_branch_assignments_insert_all" ON public.doctor_branch_assignments 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "doctor_branch_assignments_read_all" ON public.doctor_branch_assignments;
CREATE POLICY "doctor_branch_assignments_read_all" ON public.doctor_branch_assignments 
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
WHERE tablename IN ('hospitals', 'doctors', 'doctor_branch_assignments', 'users', 'user_roles')
ORDER BY tablename, policyname;
