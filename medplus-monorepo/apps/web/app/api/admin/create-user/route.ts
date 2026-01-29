import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to create users (admin-only operation)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    { auth: { persistSession: false } }
);

function generatePassword(length = 12) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, full_name, role, hospital_id } = body;

        if (!email || !full_name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate username from name or email
        const username = email.includes('@')
            ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_')
            : email.toLowerCase().replace(/[^a-z0-9]/g, '_');

        // Create email from username for Supabase (internally uses email)
        const internalEmail = `${username}@medplus.local`;

        // Generate temporary password
        const tempPassword = generatePassword();

        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: internalEmail,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
                full_name,
                username,
                role,
                hospital_id,
                must_change_password: true
            }
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Create user profile in public.users table
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authUser.user.id,
                email,
                full_name,
                is_active: true
            });

        if (profileError) {
            console.error('Profile error:', profileError);
            // User was created in auth, try to continue anyway
        }

        // Assign role
        const { data: roleData } = await supabaseAdmin
            .from('roles')
            .select('id')
            .eq('name', role)
            .single();

        if (roleData) {
            await supabaseAdmin.from('user_roles').insert({
                user_id: authUser.user.id,
                role_id: roleData.id,
                hospital_id: hospital_id || null
            });
        }

        return NextResponse.json({
            success: true,
            user_id: authUser.user.id,
            username,
            temporary_password: tempPassword,
            message: 'User created successfully'
        });

    } catch (error: any) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
