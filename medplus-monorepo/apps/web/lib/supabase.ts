import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables for runtime
if (!rawUrl || !rawKey) {
    if (typeof window !== 'undefined') {
        console.error('CRITICAL: Supabase credentials missing. Please check your .env.local file.');
    }
}

// Safe client creation for build time
const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        global: {
            headers: {
                'x-client-info': 'medplus-web'
            }
        }
    }
);

// Types for database operations
export type Database = {
    public: {
        Tables: {
            hospitals: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    type: string;
                    description: string | null;
                    logo_url: string | null;
                    cover_image_url: string | null;
                    contact_email: string | null;
                    contact_phone: string | null;
                    is_active: boolean;
                    created_at: string;
                };
            };
            branches: {
                Row: {
                    id: string;
                    hospital_id: string;
                    name: string;
                    address_line1: string;
                    city: string;
                    country: string;
                    phone: string | null;
                    is_active: boolean;
                };
            };
            doctors: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string | null;
                    specialties: string[];
                    bio: string | null;
                    years_of_experience: number | null;
                    consultation_fee: number | null;
                    is_accepting_patients: boolean;
                };
            };
            appointments: {
                Row: {
                    id: string;
                    appointment_number: string;
                    patient_id: string;
                    doctor_id: string;
                    service_id: string;
                    branch_id: string;
                    scheduled_date: string;
                    start_time: string;
                    end_time: string;
                    status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
                    is_paid: boolean;
                    created_at: string;
                };
            };
            services: {
                Row: {
                    id: string;
                    department_id: string;
                    name: string;
                    description: string | null;
                    duration_minutes: number;
                    base_price: number | null;
                    is_active: boolean;
                };
            };
        };
    };
};
