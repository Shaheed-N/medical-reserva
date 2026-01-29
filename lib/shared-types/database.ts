// Core database types that mirror our Supabase schema

// User types
export type UserRole = 
  | 'super_admin'
  | 'hospital_owner'
  | 'hospital_manager'
  | 'doctor'
  | 'admin_staff'
  | 'patient';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  preferred_language: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: UserRole;
  display_name: string;
  description?: string;
  permissions: string[];
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  hospital_id?: string;
  branch_id?: string;
  granted_at: string;
  granted_by?: string;
}

// Hospital types
export type HospitalType = 'general' | 'clinic' | 'dental' | 'specialty' | 'diagnostic';

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  type: HospitalType;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  license_number?: string;
  accreditation?: Record<string, unknown>;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  owner_id?: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OperatingHours {
  open: string;  // HH:MM format
  close: string;
}

export interface Branch {
  id: string;
  hospital_id: string;
  name: string;
  slug: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  operating_hours?: Record<string, OperatingHours>;
  facilities?: string[];
  is_main_branch: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Department and Service types
export interface Department {
  id: string;
  branch_id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  department_id: string;
  name: string;
  slug: string;
  description?: string;
  duration_minutes: number;
  base_price?: number;
  currency: string;
  cpt_code?: string;
  requires_referral: boolean;
  preparation_instructions?: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Doctor types
export interface Doctor {
  id: string;
  user_id: string;
  title?: string;
  specialties: string[];
  qualifications: string[];
  bio?: string;
  years_of_experience?: number;
  license_number?: string;
  consultation_fee?: number;
  currency: string;
  languages: string[];
  is_accepting_patients: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: User;
}

export interface DoctorBranchAssignment {
  id: string;
  doctor_id: string;
  branch_id: string;
  department_id?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  branch_id: string;
  day_of_week: number;  // 0-6 (Sunday-Saturday)
  start_time: string;   // HH:MM format
  end_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
}

export interface DoctorScheduleOverride {
  id: string;
  doctor_id: string;
  branch_id: string;
  override_date: string;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  reason?: string;
  created_at: string;
}

// Appointment types
export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type BookingType = 'online' | 'phone' | 'walk_in';

export interface Appointment {
  id: string;
  appointment_number: string;
  patient_id: string;
  doctor_id: string;
  service_id: string;
  branch_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  booking_type: BookingType;
  notes?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  checked_in_at?: string;
  checked_in_by?: string;
  completed_at?: string;
  price?: number;
  currency: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Joined fields
  patient?: User;
  doctor?: Doctor;
  service?: Service;
  branch?: Branch;
}

export interface AppointmentLog {
  id: string;
  appointment_id: string;
  action: string;
  previous_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  performed_by?: string;
  performed_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AppointmentNote {
  id: string;
  appointment_id: string;
  doctor_id: string;
  note_type: 'general' | 'diagnosis' | 'prescription' | 'followup';
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

// Patient types
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface PatientProfile {
  id: string;
  user_id: string;
  date_of_birth?: string;
  gender?: Gender;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
  medical_notes?: string;
  created_at: string;
  updated_at: string;
}

// Form types
export type FormType = 'intake' | 'consent' | 'medical_history' | 'feedback' | 'custom';

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'file'
  | 'number'
  | 'email'
  | 'phone';

export interface FormField {
  id: string;
  form_id: string;
  field_key: string;
  field_type: FormFieldType;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation_rules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  conditional_logic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: unknown;
  };
  display_order: number;
  is_required: boolean;
}

export interface Form {
  id: string;
  hospital_id: string;
  name: string;
  slug: string;
  description?: string;
  form_type: FormType;
  schema: Record<string, unknown>;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Joined fields
  fields?: FormField[];
}

export interface FormSubmission {
  id: string;
  form_id: string;
  appointment_id?: string;
  patient_id: string;
  responses: Record<string, unknown>;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

// Staff assignment
export interface StaffAssignment {
  id: string;
  user_id: string;
  hospital_id: string;
  branch_id?: string;
  position?: string;
  is_active: boolean;
  assigned_at: string;
}

// Utility types for API responses
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Time slot for appointment booking
export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_id?: string;
}

// Search and filter types
export interface HospitalSearchParams {
  query?: string;
  type?: HospitalType;
  city?: string;
  specialty?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentFilterParams {
  branch_id?: string;
  doctor_id?: string;
  patient_id?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}
