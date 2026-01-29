-- ============================================
-- FIX RLS FOR INSURANCES AND REVIEWS
-- ============================================

-- 1. INSURANCE COMPANIES
DROP POLICY IF EXISTS "insurance_companies_read_all" ON public.insurance_companies;
CREATE POLICY "insurance_companies_read_all" ON public.insurance_companies FOR SELECT USING (true);

-- 2. DOCTOR INSURANCE
DROP POLICY IF EXISTS "doctor_insurance_read_all" ON public.doctor_insurance;
CREATE POLICY "doctor_insurance_read_all" ON public.doctor_insurance FOR SELECT USING (true);
DROP POLICY IF EXISTS "doctor_insurance_insert_all" ON public.doctor_insurance;
CREATE POLICY "doctor_insurance_insert_all" ON public.doctor_insurance FOR INSERT WITH CHECK (true);

-- 3. REVIEWS
DROP POLICY IF EXISTS "reviews_read_all" ON public.reviews;
CREATE POLICY "reviews_read_all" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
CREATE POLICY "reviews_insert_authenticated" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = patient_id);

-- 4. DOCTOR VISIT REASONS
DROP POLICY IF EXISTS "doctor_visit_reasons_read_all" ON public.doctor_visit_reasons;
CREATE POLICY "doctor_visit_reasons_read_all" ON public.doctor_visit_reasons FOR SELECT USING (true);
