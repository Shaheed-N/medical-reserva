-- MedPlus Extended Schema Migration
-- Adds: doctor_applications, reviews, notifications, hospital_applications,
--       insurance_companies, doctor_insurance, doctor_visit_reasons
-- Modifies: doctors (buffer_minutes, is_independent), appointments (visit_reason_id, insurance_id)

-- ============================================
-- DOCTOR APPLICATIONS (Approval Workflow)
-- ============================================

CREATE TABLE IF NOT EXISTS public.doctor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Optional if not logged in
    
    -- Contact Info (for new registrations)
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    
    -- Professional Info
    title TEXT,
    specialties TEXT[] DEFAULT '{}',
    qualifications TEXT[] DEFAULT '{}',
    bio TEXT,
    years_of_experience INT,
    license_number TEXT,
    consultation_fee DECIMAL(10, 2),
    currency TEXT DEFAULT 'AZN',
    languages TEXT[] DEFAULT '{}',
    
    -- Documents (stored as array of URLs)
    documents JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"type": "license", "url": "...", "name": "Medical License"}]
    
    -- Application Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Review tracking
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_doctor_applications_status ON public.doctor_applications(status);
CREATE INDEX IF NOT EXISTS idx_doctor_applications_hospital ON public.doctor_applications(hospital_id, status);

-- ============================================
-- REVIEWS (Patient Ratings)
-- ============================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    
    -- Moderation
    is_visible BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,  -- Verified means they actually had an appointment
    
    -- Response from doctor (optional)
    doctor_response TEXT,
    doctor_responded_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_doctor ON public.reviews(doctor_id, is_visible);
CREATE INDEX IF NOT EXISTS idx_reviews_patient ON public.reviews(patient_id);

-- ============================================
-- NOTIFICATIONS (In-App Notifications)
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Notification content
    type TEXT NOT NULL,
    -- Types: appointment_confirmed, appointment_cancelled, appointment_reminder,
    --        doctor_approved, doctor_rejected, new_review, etc.
    
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Related data (for linking to relevant pages)
    data JSONB DEFAULT '{}'::jsonb,
    -- Example: {"appointment_id": "...", "doctor_id": "..."}
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Delivery tracking
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE is_read = false;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at for new tables
DROP TRIGGER IF EXISTS update_doctor_applications_updated_at ON public.doctor_applications;
CREATE TRIGGER update_doctor_applications_updated_at 
    BEFORE UPDATE ON public.doctor_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.doctor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Doctor Applications Policies
-- Applicant can view their own applications
CREATE POLICY "doctor_applications_own_read" ON public.doctor_applications 
    FOR SELECT USING (user_id = auth.uid());

-- Applicant can create their own application
CREATE POLICY "doctor_applications_own_create" ON public.doctor_applications 
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Applicant can update pending applications
CREATE POLICY "doctor_applications_own_update" ON public.doctor_applications 
    FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

-- Hospital admins can view applications for their hospital
CREATE POLICY "doctor_applications_hospital_read" ON public.doctor_applications 
    FOR SELECT USING (
        can_access_hospital(auth.uid(), hospital_id)
    );

-- Hospital admins can update applications (approve/reject)
CREATE POLICY "doctor_applications_hospital_update" ON public.doctor_applications 
    FOR UPDATE USING (
        can_access_hospital(auth.uid(), hospital_id)
    );

-- Super admins can see all applications
CREATE POLICY "doctor_applications_admin_read" ON public.doctor_applications 
    FOR SELECT USING (is_super_admin(auth.uid()));

CREATE POLICY "doctor_applications_admin_update" ON public.doctor_applications 
    FOR UPDATE USING (is_super_admin(auth.uid()));

-- Reviews Policies
-- Public can read visible reviews
CREATE POLICY "reviews_public_read" ON public.reviews 
    FOR SELECT USING (is_visible = true);

-- Patient can create review for their completed appointment
CREATE POLICY "reviews_patient_create" ON public.reviews 
    FOR INSERT WITH CHECK (
        patient_id = auth.uid() 
        AND EXISTS (
            SELECT 1 FROM public.appointments a 
            WHERE a.id = appointment_id 
            AND a.patient_id = auth.uid() 
            AND a.status = 'completed'
        )
    );

-- Patient can update their own review
CREATE POLICY "reviews_patient_update" ON public.reviews 
    FOR UPDATE USING (patient_id = auth.uid());

-- Doctor can respond to reviews about them
CREATE POLICY "reviews_doctor_respond" ON public.reviews 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.doctors d 
            WHERE d.id = doctor_id AND d.user_id = auth.uid()
        )
    );

-- Notifications Policies
-- Users can only see their own notifications
CREATE POLICY "notifications_own" ON public.notifications 
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate doctor's average rating
CREATE OR REPLACE FUNCTION get_doctor_rating(doctor_uuid UUID)
RETURNS TABLE(average_rating DECIMAL(2,1), total_reviews BIGINT) AS $$
    SELECT 
        ROUND(AVG(rating)::DECIMAL, 1) as average_rating,
        COUNT(*) as total_reviews
    FROM public.reviews 
    WHERE doctor_id = doctor_uuid AND is_visible = true;
$$ LANGUAGE sql STABLE;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_uuid UUID)
RETURNS VOID AS $$
    UPDATE public.notifications 
    SET is_read = true, read_at = now()
    WHERE id = notification_uuid AND user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
    UPDATE public.notifications 
    SET is_read = true, read_at = now()
    WHERE user_id = auth.uid() AND is_read = false;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_applications;

-- ============================================
-- HOSPITAL APPLICATIONS (NEW)
-- ============================================

CREATE TABLE IF NOT EXISTS public.hospital_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Hospital Info
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('general', 'clinic', 'dental', 'specialty', 'diagnostic')),
    description TEXT,
    address TEXT,
    city TEXT,
    
    -- Contact
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    website TEXT,
    
    -- Legal
    license_number TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    
    -- Admin Account Info
    admin_name TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    admin_phone TEXT,
    
    -- Application Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Review tracking
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    
    -- After approval, link to created hospital
    approved_hospital_id UUID REFERENCES public.hospitals(id),
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hospital_applications_status ON public.hospital_applications(status);

-- ============================================
-- INSURANCE COMPANIES (NEW)
-- ============================================

CREATE TABLE IF NOT EXISTS public.insurance_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_az TEXT,
    name_ru TEXT,
    type TEXT NOT NULL CHECK (type IN ('icbari', 'private')),
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default insurance companies
INSERT INTO public.insurance_companies (name, name_az, name_ru, type) VALUES
    ('İcbari Tibbi Sığorta', 'İcbari Tibbi Sığorta', 'Обязательное мед. страхование', 'icbari'),
    ('PASHA Sığorta', 'PASHA Sığorta', 'PASHA Страхование', 'private'),
    ('ATESHGAH', 'ATESHGAH Sığorta', 'ATESHGAH Страхование', 'private'),
    ('AzSığorta', 'AzSığorta', 'АзСтрах', 'private')
ON CONFLICT DO NOTHING;

-- ============================================
-- DOCTOR INSURANCE (Which insurance doctor accepts)
-- ============================================

CREATE TABLE IF NOT EXISTS public.doctor_insurance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    insurance_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(doctor_id, insurance_id)
);

CREATE INDEX IF NOT EXISTS idx_doctor_insurance_doctor ON public.doctor_insurance(doctor_id);

-- ============================================
-- DOCTOR VISIT REASONS (Each doctor's own list)
-- ============================================

CREATE TABLE IF NOT EXISTS public.doctor_visit_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_az TEXT,
    name_ru TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctor_visit_reasons ON public.doctor_visit_reasons(doctor_id, is_active);

-- ============================================
-- MODIFY EXISTING TABLES
-- ============================================

-- Add slot duration, buffer time, independent flag and settings to doctors
ALTER TABLE public.doctors 
    ADD COLUMN IF NOT EXISTS slot_duration INT DEFAULT 30,
    ADD COLUMN IF NOT EXISTS buffer_minutes INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_independent BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS auto_confirm BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS allow_walk_in BOOLEAN DEFAULT true;

-- ============================================
-- DOCTOR AVAILABILITY (Working Hours)
-- ============================================

CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL DEFAULT '09:00',
    end_time TIME NOT NULL DEFAULT '18:00',
    break_start TIME DEFAULT '13:00',
    break_end TIME DEFAULT '14:00',
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(doctor_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor ON public.doctor_availability(doctor_id);

-- Add visit reason and insurance to appointments
ALTER TABLE public.appointments 
    ADD COLUMN IF NOT EXISTS visit_reason_id UUID REFERENCES public.doctor_visit_reasons(id),
    ADD COLUMN IF NOT EXISTS insurance_id UUID REFERENCES public.insurance_companies(id);

-- ============================================
-- RLS FOR NEW TABLES
-- ============================================

ALTER TABLE public.hospital_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_visit_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hospital_applications_public_create" ON public.hospital_applications 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "hospital_applications_admin_all" ON public.hospital_applications 
    FOR ALL USING (is_super_admin(auth.uid()));

-- Doctor Applications: Anyone can apply
CREATE POLICY "doctor_applications_public_create" ON public.doctor_applications 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "doctor_applications_admin_all" ON public.doctor_applications 
    FOR ALL USING (is_super_admin(auth.uid()));

-- Insurance Companies: Public read
CREATE POLICY "insurance_companies_public_read" ON public.insurance_companies 
    FOR SELECT USING (is_active = true);

-- Doctor Insurance: Public read, doctor manages own
CREATE POLICY "doctor_insurance_public_read" ON public.doctor_insurance 
    FOR SELECT USING (true);

CREATE POLICY "doctor_insurance_doctor_manage" ON public.doctor_insurance 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid())
    );

-- Doctor Visit Reasons: Public read, doctor manages own
CREATE POLICY "doctor_visit_reasons_public_read" ON public.doctor_visit_reasons 
    FOR SELECT USING (is_active = true);

CREATE POLICY "doctor_visit_reasons_doctor_manage" ON public.doctor_visit_reasons 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid())
    );

-- Doctor Availability: Public read, doctor manages own
CREATE POLICY "doctor_availability_public_read" ON public.doctor_availability 
    FOR SELECT USING (is_enabled = true);

CREATE POLICY "doctor_availability_doctor_manage" ON public.doctor_availability 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid())
    );

-- ============================================
-- TRIGGERS FOR NEW TABLES
-- ============================================

DROP TRIGGER IF EXISTS update_doctor_availability_updated_at ON public.doctor_availability;
CREATE TRIGGER update_doctor_availability_updated_at 
    BEFORE UPDATE ON public.doctor_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.hospital_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_availability;

