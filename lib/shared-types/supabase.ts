// Auto-generated Supabase types
// In production, use: npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    phone: string | null
                    avatar_url: string | null
                    preferred_language: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    phone?: string | null
                    avatar_url?: string | null
                    preferred_language?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    phone?: string | null
                    avatar_url?: string | null
                    preferred_language?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            roles: {
                Row: {
                    id: string
                    name: string
                    display_name: string
                    description: string | null
                    permissions: Json
                }
                Insert: {
                    id?: string
                    name: string
                    display_name: string
                    description?: string | null
                    permissions?: Json
                }
                Update: {
                    id?: string
                    name?: string
                    display_name?: string
                    description?: string | null
                    permissions?: Json
                }
            }
            user_roles: {
                Row: {
                    id: string
                    user_id: string
                    role_id: string
                    hospital_id: string | null
                    branch_id: string | null
                    granted_at: string
                    granted_by: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    role_id: string
                    hospital_id?: string | null
                    branch_id?: string | null
                    granted_at?: string
                    granted_by?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    role_id?: string
                    hospital_id?: string | null
                    branch_id?: string | null
                    granted_at?: string
                    granted_by?: string | null
                }
            }
            hospitals: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    type: string
                    description: string | null
                    logo_url: string | null
                    cover_image_url: string | null
                    license_number: string | null
                    accreditation: Json | null
                    contact_email: string | null
                    contact_phone: string | null
                    website: string | null
                    owner_id: string | null
                    is_active: boolean
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    type: string
                    description?: string | null
                    logo_url?: string | null
                    cover_image_url?: string | null
                    license_number?: string | null
                    accreditation?: Json | null
                    contact_email?: string | null
                    contact_phone?: string | null
                    website?: string | null
                    owner_id?: string | null
                    is_active?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    type?: string
                    description?: string | null
                    logo_url?: string | null
                    cover_image_url?: string | null
                    license_number?: string | null
                    accreditation?: Json | null
                    contact_email?: string | null
                    contact_phone?: string | null
                    website?: string | null
                    owner_id?: string | null
                    is_active?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            branches: {
                Row: {
                    id: string
                    hospital_id: string
                    name: string
                    slug: string
                    address_line1: string
                    address_line2: string | null
                    city: string
                    state: string | null
                    country: string
                    postal_code: string | null
                    latitude: number | null
                    longitude: number | null
                    phone: string | null
                    email: string | null
                    operating_hours: Json | null
                    facilities: Json | null
                    is_main_branch: boolean
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    hospital_id: string
                    name: string
                    slug: string
                    address_line1: string
                    address_line2?: string | null
                    city: string
                    state?: string | null
                    country: string
                    postal_code?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    phone?: string | null
                    email?: string | null
                    operating_hours?: Json | null
                    facilities?: Json | null
                    is_main_branch?: boolean
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    hospital_id?: string
                    name?: string
                    slug?: string
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    state?: string | null
                    country?: string
                    postal_code?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    phone?: string | null
                    email?: string | null
                    operating_hours?: Json | null
                    facilities?: Json | null
                    is_main_branch?: boolean
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            departments: {
                Row: {
                    id: string
                    branch_id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    branch_id: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    branch_id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    department_id: string
                    name: string
                    slug: string
                    description: string | null
                    duration_minutes: number
                    base_price: number | null
                    currency: string
                    cpt_code: string | null
                    requires_referral: boolean
                    preparation_instructions: string | null
                    is_active: boolean
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    department_id: string
                    name: string
                    slug: string
                    description?: string | null
                    duration_minutes?: number
                    base_price?: number | null
                    currency?: string
                    cpt_code?: string | null
                    requires_referral?: boolean
                    preparation_instructions?: string | null
                    is_active?: boolean
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    department_id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    duration_minutes?: number
                    base_price?: number | null
                    currency?: string
                    cpt_code?: string | null
                    requires_referral?: boolean
                    preparation_instructions?: string | null
                    is_active?: boolean
                    metadata?: Json
                    created_at?: string
                }
            }
            doctors: {
                Row: {
                    id: string
                    user_id: string
                    title: string | null
                    specialties: string[]
                    qualifications: string[]
                    bio: string | null
                    years_of_experience: number | null
                    license_number: string | null
                    consultation_fee: number | null
                    currency: string
                    languages: string[]
                    is_accepting_patients: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title?: string | null
                    specialties?: string[]
                    qualifications?: string[]
                    bio?: string | null
                    years_of_experience?: number | null
                    license_number?: string | null
                    consultation_fee?: number | null
                    currency?: string
                    languages?: string[]
                    is_accepting_patients?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string | null
                    specialties?: string[]
                    qualifications?: string[]
                    bio?: string | null
                    years_of_experience?: number | null
                    license_number?: string | null
                    consultation_fee?: number | null
                    currency?: string
                    languages?: string[]
                    is_accepting_patients?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            doctor_branch_assignments: {
                Row: {
                    id: string
                    doctor_id: string
                    branch_id: string
                    department_id: string | null
                    is_primary: boolean
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    doctor_id: string
                    branch_id: string
                    department_id?: string | null
                    is_primary?: boolean
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    doctor_id?: string
                    branch_id?: string
                    department_id?: string | null
                    is_primary?: boolean
                    is_active?: boolean
                    created_at?: string
                }
            }
            doctor_schedules: {
                Row: {
                    id: string
                    doctor_id: string
                    branch_id: string
                    day_of_week: number
                    start_time: string
                    end_time: string
                    slot_duration_minutes: number
                    is_active: boolean
                    valid_from: string | null
                    valid_until: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    doctor_id: string
                    branch_id: string
                    day_of_week: number
                    start_time: string
                    end_time: string
                    slot_duration_minutes?: number
                    is_active?: boolean
                    valid_from?: string | null
                    valid_until?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    doctor_id?: string
                    branch_id?: string
                    day_of_week?: number
                    start_time?: string
                    end_time?: string
                    slot_duration_minutes?: number
                    is_active?: boolean
                    valid_from?: string | null
                    valid_until?: string | null
                    created_at?: string
                }
            }
            doctor_schedule_overrides: {
                Row: {
                    id: string
                    doctor_id: string
                    branch_id: string
                    override_date: string
                    is_available: boolean
                    start_time: string | null
                    end_time: string | null
                    reason: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    doctor_id: string
                    branch_id: string
                    override_date: string
                    is_available?: boolean
                    start_time?: string | null
                    end_time?: string | null
                    reason?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    doctor_id?: string
                    branch_id?: string
                    override_date?: string
                    is_available?: boolean
                    start_time?: string | null
                    end_time?: string | null
                    reason?: string | null
                    created_at?: string
                }
            }
            appointments: {
                Row: {
                    id: string
                    appointment_number: string
                    patient_id: string
                    doctor_id: string
                    service_id: string
                    branch_id: string
                    scheduled_date: string
                    start_time: string
                    end_time: string
                    duration_minutes: number
                    status: string
                    booking_type: string
                    notes: string | null
                    cancellation_reason: string | null
                    cancelled_by: string | null
                    cancelled_at: string | null
                    checked_in_at: string | null
                    checked_in_by: string | null
                    completed_at: string | null
                    price: number | null
                    currency: string
                    is_paid: boolean
                    created_at: string
                    updated_at: string
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    appointment_number: string
                    patient_id: string
                    doctor_id: string
                    service_id: string
                    branch_id: string
                    scheduled_date: string
                    start_time: string
                    end_time: string
                    duration_minutes: number
                    status?: string
                    booking_type?: string
                    notes?: string | null
                    cancellation_reason?: string | null
                    cancelled_by?: string | null
                    cancelled_at?: string | null
                    checked_in_at?: string | null
                    checked_in_by?: string | null
                    completed_at?: string | null
                    price?: number | null
                    currency?: string
                    is_paid?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
                Update: {
                    id?: string
                    appointment_number?: string
                    patient_id?: string
                    doctor_id?: string
                    service_id?: string
                    branch_id?: string
                    scheduled_date?: string
                    start_time?: string
                    end_time?: string
                    duration_minutes?: number
                    status?: string
                    booking_type?: string
                    notes?: string | null
                    cancellation_reason?: string | null
                    cancelled_by?: string | null
                    cancelled_at?: string | null
                    checked_in_at?: string | null
                    checked_in_by?: string | null
                    completed_at?: string | null
                    price?: number | null
                    currency?: string
                    is_paid?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
            }
            appointment_logs: {
                Row: {
                    id: string
                    appointment_id: string
                    action: string
                    previous_data: Json | null
                    new_data: Json | null
                    performed_by: string | null
                    performed_at: string
                    ip_address: string | null
                    user_agent: string | null
                }
                Insert: {
                    id?: string
                    appointment_id: string
                    action: string
                    previous_data?: Json | null
                    new_data?: Json | null
                    performed_by?: string | null
                    performed_at?: string
                    ip_address?: string | null
                    user_agent?: string | null
                }
                Update: {
                    id?: string
                    appointment_id?: string
                    action?: string
                    previous_data?: Json | null
                    new_data?: Json | null
                    performed_by?: string | null
                    performed_at?: string
                    ip_address?: string | null
                    user_agent?: string | null
                }
            }
            appointment_notes: {
                Row: {
                    id: string
                    appointment_id: string
                    doctor_id: string
                    note_type: string
                    content: string
                    is_private: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    appointment_id: string
                    doctor_id: string
                    note_type?: string
                    content: string
                    is_private?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    appointment_id?: string
                    doctor_id?: string
                    note_type?: string
                    content?: string
                    is_private?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            patient_profiles: {
                Row: {
                    id: string
                    user_id: string
                    date_of_birth: string | null
                    gender: string | null
                    blood_type: string | null
                    emergency_contact_name: string | null
                    emergency_contact_phone: string | null
                    insurance_provider: string | null
                    insurance_policy_number: string | null
                    allergies: string[]
                    chronic_conditions: string[]
                    current_medications: string[]
                    medical_notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date_of_birth?: string | null
                    gender?: string | null
                    blood_type?: string | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    insurance_provider?: string | null
                    insurance_policy_number?: string | null
                    allergies?: string[]
                    chronic_conditions?: string[]
                    current_medications?: string[]
                    medical_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date_of_birth?: string | null
                    gender?: string | null
                    blood_type?: string | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    insurance_provider?: string | null
                    insurance_policy_number?: string | null
                    allergies?: string[]
                    chronic_conditions?: string[]
                    current_medications?: string[]
                    medical_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            forms: {
                Row: {
                    id: string
                    hospital_id: string
                    name: string
                    slug: string
                    description: string | null
                    form_type: string
                    schema: Json
                    is_active: boolean
                    version: number
                    created_at: string
                    updated_at: string
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    hospital_id: string
                    name: string
                    slug: string
                    description?: string | null
                    form_type: string
                    schema: Json
                    is_active?: boolean
                    version?: number
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
                Update: {
                    id?: string
                    hospital_id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    form_type?: string
                    schema?: Json
                    is_active?: boolean
                    version?: number
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
            }
            form_fields: {
                Row: {
                    id: string
                    form_id: string
                    field_key: string
                    field_type: string
                    label: string
                    placeholder: string | null
                    options: Json | null
                    validation_rules: Json | null
                    conditional_logic: Json | null
                    display_order: number
                    is_required: boolean
                }
                Insert: {
                    id?: string
                    form_id: string
                    field_key: string
                    field_type: string
                    label: string
                    placeholder?: string | null
                    options?: Json | null
                    validation_rules?: Json | null
                    conditional_logic?: Json | null
                    display_order?: number
                    is_required?: boolean
                }
                Update: {
                    id?: string
                    form_id?: string
                    field_key?: string
                    field_type?: string
                    label?: string
                    placeholder?: string | null
                    options?: Json | null
                    validation_rules?: Json | null
                    conditional_logic?: Json | null
                    display_order?: number
                    is_required?: boolean
                }
            }
            service_forms: {
                Row: {
                    id: string
                    service_id: string
                    form_id: string
                    is_required: boolean
                    display_order: number
                }
                Insert: {
                    id?: string
                    service_id: string
                    form_id: string
                    is_required?: boolean
                    display_order?: number
                }
                Update: {
                    id?: string
                    service_id?: string
                    form_id?: string
                    is_required?: boolean
                    display_order?: number
                }
            }
            form_submissions: {
                Row: {
                    id: string
                    form_id: string
                    appointment_id: string | null
                    patient_id: string
                    responses: Json
                    submitted_at: string
                    reviewed_by: string | null
                    reviewed_at: string | null
                }
                Insert: {
                    id?: string
                    form_id: string
                    appointment_id?: string | null
                    patient_id: string
                    responses: Json
                    submitted_at?: string
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                }
                Update: {
                    id?: string
                    form_id?: string
                    appointment_id?: string | null
                    patient_id?: string
                    responses?: Json
                    submitted_at?: string
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                }
            }
            staff_assignments: {
                Row: {
                    id: string
                    user_id: string
                    hospital_id: string
                    branch_id: string | null
                    position: string | null
                    is_active: boolean
                    assigned_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    hospital_id: string
                    branch_id?: string | null
                    position?: string | null
                    is_active?: boolean
                    assigned_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    hospital_id?: string
                    branch_id?: string | null
                    position?: string | null
                    is_active?: boolean
                    assigned_at?: string
                }
            }
            doctor_services: {
                Row: {
                    id: string
                    doctor_id: string
                    service_id: string
                    custom_price: number | null
                    custom_duration: number | null
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    doctor_id: string
                    service_id: string
                    custom_price?: number | null
                    custom_duration?: number | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    doctor_id?: string
                    service_id?: string
                    custom_price?: number | null
                    custom_duration?: number | null
                    is_active?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
