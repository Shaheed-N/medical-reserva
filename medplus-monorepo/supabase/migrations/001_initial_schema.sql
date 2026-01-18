-- MedPlus Database Schema Migration
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb
);

-- Insert default roles
INSERT INTO public.roles (name, display_name, description) VALUES
    ('super_admin', 'Super Administrator', 'Full system access'),
    ('hospital_owner', 'Hospital Owner', 'Full access to owned hospital and branches'),
    ('hospital_manager', 'Hospital Manager', 'Manage hospital operations'),
    ('doctor', 'Doctor / Specialist', 'Manage own schedule and appointments'),
    ('admin_staff', 'Administrative Staff', 'Handle patient check-ins and bookings'),
    ('patient', 'Patient', 'Book and manage own appointments')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- HOSPITALS & BRANCHES
-- ============================================

CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('general', 'clinic', 'dental', 'specialty', 'diagnostic')),
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    license_number TEXT,
    accreditation JSONB,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    owner_id UUID REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    operating_hours JSONB,
    facilities JSONB,
    is_main_branch BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(hospital_id, slug)
);


-- User role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT now(),
    granted_by UUID REFERENCES public.users(id),
    UNIQUE(user_id, role_id, hospital_id, branch_id)
);

CREATE TABLE IF NOT EXISTS public.staff_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    position TEXT,
    is_active BOOLEAN DEFAULT true,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, hospital_id, branch_id)
);

-- ============================================
-- DEPARTMENTS & SERVICES
-- ============================================

CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(branch_id, slug)
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    base_price DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    cpt_code TEXT,
    requires_referral BOOLEAN DEFAULT false,
    preparation_instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(department_id, slug)
);

-- ============================================
-- DOCTORS
-- ============================================

CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT,
    specialties TEXT[] DEFAULT '{}',
    qualifications TEXT[] DEFAULT '{}',
    bio TEXT,
    years_of_experience INT,
    license_number TEXT,
    consultation_fee DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    languages TEXT[] DEFAULT '{}',
    is_accepting_patients BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_branch_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(doctor_id, branch_id)
);

CREATE TABLE IF NOT EXISTS public.doctor_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    custom_price DECIMAL(10, 2),
    custom_duration INT,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(doctor_id, service_id)
);

CREATE TABLE IF NOT EXISTS public.doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(doctor_id, branch_id, day_of_week, start_time)
);

CREATE TABLE IF NOT EXISTS public.doctor_schedule_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    override_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT false,
    start_time TIME,
    end_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(doctor_id, branch_id, override_date)
);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TYPE appointment_status AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES public.users(id),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id),
    service_id UUID NOT NULL REFERENCES public.services(id),
    branch_id UUID NOT NULL REFERENCES public.branches(id),
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    status appointment_status DEFAULT 'pending',
    booking_type TEXT DEFAULT 'online' CHECK (booking_type IN ('online', 'phone', 'walk_in')),
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.users(id),
    cancelled_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES public.users(id),
    completed_at TIMESTAMPTZ,
    price DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES public.users(id),
    UNIQUE(doctor_id, scheduled_date, start_time)
);

CREATE TABLE IF NOT EXISTS public.appointment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    previous_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES public.users(id),
    performed_at TIMESTAMPTZ DEFAULT now(),
    ip_address INET,
    user_agent TEXT
);

CREATE TABLE IF NOT EXISTS public.appointment_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id),
    note_type TEXT DEFAULT 'general',
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PATIENTS
-- ============================================

CREATE TABLE IF NOT EXISTS public.patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    blood_type TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    allergies TEXT[] DEFAULT '{}',
    chronic_conditions TEXT[] DEFAULT '{}',
    current_medications TEXT[] DEFAULT '{}',
    medical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- FORMS
-- ============================================

CREATE TABLE IF NOT EXISTS public.forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    form_type TEXT NOT NULL CHECK (form_type IN ('intake', 'consent', 'medical_history', 'feedback', 'custom')),
    schema JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES public.users(id),
    UNIQUE(hospital_id, slug, version)
);

CREATE TABLE IF NOT EXISTS public.form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    field_key TEXT NOT NULL,
    field_type TEXT NOT NULL,
    label TEXT NOT NULL,
    placeholder TEXT,
    options JSONB,
    validation_rules JSONB,
    conditional_logic JSONB,
    display_order INT DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    UNIQUE(form_id, field_key)
);

CREATE TABLE IF NOT EXISTS public.service_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    UNIQUE(service_id, form_id)
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES public.forms(id),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.users(id),
    responses JSONB NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON public.appointments(doctor_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_branch_status ON public.appointments(branch_id, status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_lookup ON public.doctor_schedules(doctor_id, branch_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_branches_hospital ON public.branches(hospital_id);
CREATE INDEX IF NOT EXISTS idx_departments_branch ON public.departments(branch_id);
CREATE INDEX IF NOT EXISTS idx_services_department ON public.services(department_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hospitals_updated_at ON public.hospitals;
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_branches_updated_at ON public.branches;
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON public.doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_profiles_updated_at ON public.patient_profiles;
CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON public.patient_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_branch_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedule_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_forms ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_uuid AND r.name = 'super_admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user can access hospital
CREATE OR REPLACE FUNCTION can_access_hospital(user_uuid UUID, hospital_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT is_super_admin(user_uuid) OR EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = user_uuid AND ur.hospital_id = hospital_uuid
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Roles: everyone can read
CREATE POLICY "roles_read" ON public.roles FOR SELECT USING (true);

-- Users: can read own, super admins can read all
CREATE POLICY "users_read_own" ON public.users FOR SELECT
    USING (id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "users_update_own" ON public.users FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "users_insert" ON public.users FOR INSERT
    WITH CHECK (id = auth.uid());

-- Hospitals: public can read active, staff can read assigned
CREATE POLICY "hospitals_public_read" ON public.hospitals FOR SELECT
    USING (is_active = true OR can_access_hospital(auth.uid(), id));

CREATE POLICY "hospitals_owner_manage" ON public.hospitals FOR ALL
    USING (owner_id = auth.uid() OR is_super_admin(auth.uid()));

-- Branches: public can read active
CREATE POLICY "branches_public_read" ON public.branches FOR SELECT
    USING (is_active = true OR can_access_hospital(auth.uid(), hospital_id));

-- Departments & Services: public can read active
CREATE POLICY "departments_public_read" ON public.departments FOR SELECT
    USING (is_active = true);

CREATE POLICY "services_public_read" ON public.services FOR SELECT
    USING (is_active = true);

-- Doctors: public can read accepting patients
CREATE POLICY "doctors_public_read" ON public.doctors FOR SELECT
    USING (is_accepting_patients = true OR user_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "doctors_self_manage" ON public.doctors FOR UPDATE
    USING (user_id = auth.uid());

-- Doctor schedules: public can read
CREATE POLICY "doctor_schedules_public_read" ON public.doctor_schedules FOR SELECT
    USING (is_active = true);

-- Appointments: patients see own, staff see branch
CREATE POLICY "appointments_patient_read" ON public.appointments FOR SELECT
    USING (patient_id = auth.uid());

CREATE POLICY "appointments_doctor_read" ON public.appointments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid()
    ));

CREATE POLICY "appointments_patient_create" ON public.appointments FOR INSERT
    WITH CHECK (patient_id = auth.uid());

CREATE POLICY "appointments_patient_update" ON public.appointments FOR UPDATE
    USING (patient_id = auth.uid() AND status IN ('pending', 'confirmed'));

-- Patient profiles: own only
CREATE POLICY "patient_profiles_own" ON public.patient_profiles FOR ALL
    USING (user_id = auth.uid());

-- Form submissions: patient can manage own
CREATE POLICY "form_submissions_patient" ON public.form_submissions FOR ALL
    USING (patient_id = auth.uid());

-- Doctor branch assignments: public read
CREATE POLICY "doctor_branch_assignments_read" ON public.doctor_branch_assignments FOR SELECT
    USING (is_active = true);

-- Doctor services: public read  
CREATE POLICY "doctor_services_read" ON public.doctor_services FOR SELECT
    USING (is_active = true);

-- User roles: user can read own
CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT
    USING (user_id = auth.uid() OR is_super_admin(auth.uid()));

-- Forms: public read active
CREATE POLICY "forms_public_read" ON public.forms FOR SELECT
    USING (is_active = true);

-- Form fields: public read
CREATE POLICY "form_fields_read" ON public.form_fields FOR SELECT
    USING (true);

-- Service forms: public read
CREATE POLICY "service_forms_read" ON public.service_forms FOR SELECT
    USING (true);

-- Schedule overrides: public read
CREATE POLICY "schedule_overrides_read" ON public.doctor_schedule_overrides FOR SELECT
    USING (true);

-- Staff assignments: read for assigned hospitals
CREATE POLICY "staff_assignments_read" ON public.staff_assignments FOR SELECT
    USING (user_id = auth.uid() OR is_super_admin(auth.uid()));

-- Appointment logs: participants can read
CREATE POLICY "appointment_logs_read" ON public.appointment_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.appointments a 
        WHERE a.id = appointment_id 
        AND (a.patient_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.doctors d WHERE d.id = a.doctor_id AND d.user_id = auth.uid()
        ))
    ));

-- Appointment notes: doctor and patient can read (non-private)
CREATE POLICY "appointment_notes_read" ON public.appointment_notes FOR SELECT
    USING (
        (is_private = false AND EXISTS (
            SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.patient_id = auth.uid()
        ))
        OR EXISTS (
            SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid()
        )
    );

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for appointments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
