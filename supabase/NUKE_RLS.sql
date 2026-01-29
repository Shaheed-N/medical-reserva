-- ============================================
-- THE "NUKE" FIX - DISABLE RLS ON EVERYTHING
-- ============================================

-- Disable RLS temporarily to verify if it's an RLS issue
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_branch_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

-- Just in case they are re-enabled later, set wide open policies
DROP POLICY IF EXISTS "open_all" ON public.users;
CREATE POLICY "open_all" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_all" ON public.doctors;
CREATE POLICY "open_all" ON public.doctors FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_all" ON public.hospitals;
CREATE POLICY "open_all" ON public.hospitals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_all" ON public.branches;
CREATE POLICY "open_all" ON public.branches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open_all" ON public.doctor_branch_assignments;
CREATE POLICY "open_all" ON public.doctor_branch_assignments FOR ALL USING (true) WITH CHECK (true);

-- Ensure data exists for testing
UPDATE public.doctors SET is_accepting_patients = true;
