import { supabase } from './supabase';
import type {
    Hospital,
    Branch,
    Department,
    Service,
    HospitalSearchParams,
    PaginatedResponse
} from '@/types';

export const hospitalService = {
    /**
     * Search hospitals with filters
     */
    searchHospitals: async (
        params: HospitalSearchParams
    ): Promise<PaginatedResponse<Hospital>> => {
        const { query, type, city, specialty, page = 1, limit = 10 } = params;
        const offset = (page - 1) * limit;

        let queryBuilder = supabase
            .from('hospitals')
            .select('*, branches(*)', { count: 'exact' })
            .eq('is_active', true);

        if (query) {
            queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (type) {
            queryBuilder = queryBuilder.eq('type', type);
        }

        if (city) {
            queryBuilder = queryBuilder.eq('branches.city', city);
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
        branches (*),
        owner:users!hospitals_owner_id_fkey (id, full_name, avatar_url)
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
        branches (*)
      `)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new hospital (for hospital owners)
     */
    createHospital: async (hospital: Partial<Hospital>): Promise<Hospital> => {
        const { data, error } = await supabase
            .from('hospitals')
            .insert(hospital)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update hospital
     */
    updateHospital: async (id: string, updates: Partial<Hospital>): Promise<Hospital> => {
        const { data, error } = await supabase
            .from('hospitals')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get all branches for a hospital
     */
    getBranches: async (hospitalId: string): Promise<Branch[]> => {
        const { data, error } = await supabase
            .from('branches')
            .select('*')
            .eq('hospital_id', hospitalId)
            .eq('is_active', true)
            .order('is_main_branch', { ascending: false })
            .order('name');

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
        departments (*)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new branch
     */
    createBranch: async (branch: Partial<Branch>): Promise<Branch> => {
        const { data, error } = await supabase
            .from('branches')
            .insert(branch)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update branch
     */
    updateBranch: async (id: string, updates: Partial<Branch>): Promise<Branch> => {
        const { data, error } = await supabase
            .from('branches')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get departments for a branch
     */
    getDepartments: async (branchId: string): Promise<Department[]> => {
        const { data, error } = await supabase
            .from('departments')
            .select(`
        *,
        services (*)
      `)
            .eq('branch_id', branchId)
            .eq('is_active', true)
            .order('display_order')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    /**
     * Get services for a department
     */
    getServices: async (departmentId: string): Promise<Service[]> => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('department_id', departmentId)
            .eq('is_active', true)
            .order('name');

        if (error) throw error;
        return data || [];
    },

    /**
     * Get service by ID with full details
     */
    getService: async (id: string): Promise<Service> => {
        const { data, error } = await supabase
            .from('services')
            .select(`
        *,
        department:departments (
          id, name, slug,
          branch:branches (
            id, name, slug,
            hospital:hospitals (id, name, slug, logo_url)
          )
        ),
        service_forms (
          form:forms (*)
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create service
     */
    createService: async (service: Partial<Service>): Promise<Service> => {
        const { data, error } = await supabase
            .from('services')
            .insert(service)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update service
     */
    updateService: async (id: string, updates: Partial<Service>): Promise<Service> => {
        const { data, error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get unique cities for filtering
     */
    getCities: async (): Promise<string[]> => {
        const { data, error } = await supabase
            .from('branches')
            .select('city')
            .eq('is_active', true);

        if (error) throw error;

        const uniqueCities = [...new Set(data?.map((b) => b.city) || [])];
        return uniqueCities.sort();
    },
};

export default hospitalService;
