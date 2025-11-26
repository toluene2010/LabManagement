import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    sessionId: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    hasPermission: (resource: string, action: string) => boolean;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            sessionId: null,

            login: async (email: string, password: string) => {
                try {
                    // Sign in with Supabase Auth
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (authError) {
                        console.error('Login error:', authError);
                        return false;
                    }

                    if (!authData.user) {
                        return false;
                    }

                    // Fetch user profile from profiles table
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (profileError) {
                        console.error('Profile fetch error:', profileError);
                        return false;
                    }

                    // Map profile to User type
                    const user: User = {
                        id: profile.id,
                        username: profile.username || email,
                        email: authData.user.email || email,
                        firstName: profile.first_name || '',
                        lastName: profile.last_name || '',
                        role: profile.role || 'analyst',
                        department: profile.department || '',
                        isActive: profile.is_active ?? true,
                        createdAt: profile.created_at,
                        lastLogin: new Date().toISOString(),
                        permissions: getRolePermissions(profile.role),
                    };

                    set({
                        user,
                        isAuthenticated: true,
                        sessionId: authData.session?.access_token || null,
                    });

                    // Log audit trail
                    await supabase.from('audit_logs').insert({
                        user_id: user.id,
                        action: 'login',
                        entity_type: 'session',
                        entity_id: authData.session?.access_token,
                        details: { email },
                    });

                    return true;
                } catch (error) {
                    console.error('Login exception:', error);
                    return false;
                }
            },

            logout: async () => {
                const state = get();

                if (state.user) {
                    // Log audit trail
                    await supabase.from('audit_logs').insert({
                        user_id: state.user.id,
                        action: 'logout',
                        entity_type: 'session',
                        entity_id: state.sessionId,
                    });
                }

                // Sign out from Supabase
                await supabase.auth.signOut();

                set({
                    user: null,
                    isAuthenticated: false,
                    sessionId: null,
                });
            },

            hasPermission: (resource: string, action: string) => {
                const state = get();
                if (!state.user) return false;

                return state.user.permissions.some(perm => {
                    const resourceMatch = perm.resource === '*' || perm.resource === resource;
                    const actionMatch = perm.actions.includes('*') || perm.actions.includes(action);
                    return resourceMatch && actionMatch;
                });
            },

            checkSession: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (!session) {
                        set({
                            user: null,
                            isAuthenticated: false,
                            sessionId: null,
                        });
                        return;
                    }

                    // Fetch user profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profile) {
                        const user: User = {
                            id: profile.id,
                            username: profile.username || session.user.email || '',
                            email: session.user.email || '',
                            firstName: profile.first_name || '',
                            lastName: profile.last_name || '',
                            role: profile.role || 'analyst',
                            department: profile.department || '',
                            isActive: profile.is_active ?? true,
                            createdAt: profile.created_at,
                            permissions: getRolePermissions(profile.role),
                        };

                        set({
                            user,
                            isAuthenticated: true,
                            sessionId: session.access_token,
                        });
                    }
                } catch (error) {
                    console.error('Session check error:', error);
                }
            },
        }),
        {
            name: 'pharma-qc-auth',
            partialize: (state) => ({
                sessionId: state.sessionId,
            }),
        }
    )
);

// Helper function to get permissions based on role
function getRolePermissions(role: string) {
    switch (role) {
        case 'admin':
            return [{ resource: '*', actions: ['*'] }];
        case 'qa_manager':
            return [
                { resource: 'samples', actions: ['create', 'read', 'update', 'approve'] },
                { resource: 'products', actions: ['create', 'read', 'update'] },
                { resource: 'results', actions: ['read', 'approve'] },
                { resource: 'audit', actions: ['read'] },
            ];
        case 'analyst':
            return [
                { resource: 'samples', actions: ['read', 'update'] },
                { resource: 'results', actions: ['create', 'read', 'update'] },
            ];
        case 'reviewer':
            return [
                { resource: 'samples', actions: ['read'] },
                { resource: 'results', actions: ['read', 'approve'] },
            ];
        default:
            return [{ resource: 'samples', actions: ['read'] }];
    }
}
