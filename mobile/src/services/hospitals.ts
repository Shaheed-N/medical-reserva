import { supabase } from './supabase';

export interface Hospital {
    id: string;
    name: string;
    slug: string;
    type: 'general' | 'clinic' | 'dental' | 'specialty' | 'diagnostic';
    description?: string;
    logo_url?: string;
    cover_image_url?: string;
    contact_email?: string;
    contact_phone?: string;
    website?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    branches?: Branch[];
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
    operating_hours?: Record<string, { open: string; close: string }>;
    facilities?: string[];
    is_main_branch: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SearchHospitalsParams {
    query?: string;
    type?: Hospital['type'];
    city?: string;
    page?: number;
    limit?: number;
}

export const hospitalService = {
    /**
     * Search hospitals with filters
     */
    searchHospitals: async (params: SearchHospitalsParams) => {
        const { query, type, city, page = 1, limit = 20 } = params;
        const offset = (page - 1) * limit;

        let queryBuilder = supabase
            .from('hospitals')
            .select(`
        *,
        branches (id, name, city, address_line1, is_main_branch)
      `, { count: 'exact' })
            .eq('is_active', true);

        if (type) {
            queryBuilder = queryBuilder.eq('type', type);
        }

        if (query) {
            queryBuilder = queryBuilder.ilike('name', `%${query}%`);
        }

        if (city) {
            // Filter by city through branches
            queryBuilder = queryBuilder.contains('branches.city', city);
        }

        const { data, error, count } = await queryBuilder
            .range(offset, offset + limit - 1)
            .order('name');

        if (error) throw error;

        return {
            data: data || [],
            count: count || 0,
            page,
            limit,
            total_pages: Math.ceil((count || 0) / limit),
        };
    },

    /**
     * Get hospital by ID
     */
    getHospital: async (id: string): Promise<Hospital> => {
        const { data, error } = await supabase
            .from('hospitals')
            .select(`
        *,
        branches (
          *,
          departments (id, name, description, icon)
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get hospital by slug
     */
    getHospitalBySlug: async (slug: string): Promise<Hospital> => {
        const { data, error } = await supabase
            .from('hospitals')
            .select(`
        *,
        branches (
          *,
          departments (id, name, description, icon)
        )
      `)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get nearby hospitals (simplified - would need PostGIS for proper geo queries)
     */
    getNearbyHospitals: async (limit = 10): Promise<Hospital[]> => {
        const { data, error } = await supabase
            .from('hospitals')
            .select(`
        *,
        branches (id, name, city, address_line1, latitude, longitude, is_main_branch)
      `)
            .eq('is_active', true)
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get branch by ID
     */
    getBranch: async (id: string): Promise<Branch> => {
        const { data, error } = await supabase
            .from('branches')
            .select(`
        *,
        hospital:hospitals (id, name, slug, logo_url),
        departments (id, name, description, icon)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get services for a branch
     */
    getBranchServices: async (branchId: string) => {
        const { data, error } = await supabase
            .from('services')
            .select(`
        *,
        department:departments (id, name)
      `)
            .eq('is_active', true)
            .eq('department.branch_id', branchId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get hospital types for filtering
     */
    getHospitalTypes: () => {
        return [
            { value: 'general', label: 'General Hospital' },
            { value: 'clinic', label: 'Clinic' },
            { value: 'dental', label: 'Dental Center' },
            { value: 'specialty', label: 'Specialty Hospital' },
            { value: 'diagnostic', label: 'Diagnostic Center' },
        ];
    },

    /**
     * Get specializations list
     */
    getSpecializations: () => {
        return [
            'General Medicine',
            'Dentistry',
            'Cardiology',
            'Dermatology',
            'Neurology',
            'Pediatrics',
            'Orthopedics',
            'Ophthalmology',
            'Gynecology',
            'Urology',
            'Psychiatry',
            'Psychology',
            'ENT',
            'Oncology',
            'Gastroenterology',
            'Pulmonology',
            'Endocrinology',
            'Rheumatology',
            'Nephrology',
            'Allergy & Immunology',
        ];
    },
};

export default hospitalService;
