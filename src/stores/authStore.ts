import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface UserWithAuth extends User {
    password: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    sessionId: string | null;
    users: UserWithAuth[];
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (resource: string, action: string) => boolean;
    addUser: (user: User, password: string) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;
    resetPassword: (id: string, newPassword: string) => void;
}

const INITIAL_USERS: UserWithAuth[] = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123',
        email: 'admin@pharma.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        department: 'IT',
        isActive: true,
        createdAt: new Date().toISOString(),
        permissions: [{ resource: '*', actions: ['*'] }]
    },
    {
        id: '2',
        username: 'qa_manager',
        password: 'qa123',
        email: 'qa@pharma.com',
        firstName: 'Quality',
        lastName: 'Manager',
        role: 'qa_manager',
        department: 'Quality Assurance',
        isActive: true,
        createdAt: new Date().toISOString(),
        permissions: [
            { resource: 'samples', actions: ['create', 'read', 'update', 'approve'] },
            { resource: 'products', actions: ['create', 'read', 'update'] },
            { resource: 'results', actions: ['read', 'approve'] },
            { resource: 'audit', actions: ['read'] }
        ]
    },
    {
        id: '3',
        username: 'analyst',
        password: 'analyst123',
        email: 'analyst@pharma.com',
        firstName: 'Lab',
        lastName: 'Analyst',
        role: 'analyst',
        department: 'Quality Control Lab',
        isActive: true,
        createdAt: new Date().toISOString(),
        permissions: [
            { resource: 'samples', actions: ['read', 'update'] },
            { resource: 'results', actions: ['create', 'read', 'update'] }
        ]
    }
];

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            sessionId: null,
            users: INITIAL_USERS,

            login: async (username: string, password: string) => {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const state = get();
                const foundUser = state.users.find(u => u.username === username && u.password === password);

                if (foundUser) {
                    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                    // Remove password from user object in state
                    const { password: _, ...userWithoutPassword } = foundUser;

                    set({
                        user: { ...userWithoutPassword, lastLogin: new Date().toISOString() },
                        isAuthenticated: true,
                        sessionId
                    });

                    // Log audit trail
                    const auditLog = {
                        id: `audit_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        userId: foundUser.id,
                        userName: `${foundUser.firstName} ${foundUser.lastName}`,
                        action: 'login' as const,
                        entityType: 'session',
                        entityId: sessionId,
                        sessionId
                    };

                    const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
                    localStorage.setItem('auditLogs', JSON.stringify([auditLog, ...existingLogs]));

                    return true;
                }

                return false;
            },

            logout: () => {
                const state = get();

                if (state.user && state.sessionId) {
                    const auditLog = {
                        id: `audit_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        userId: state.user.id,
                        userName: `${state.user.firstName} ${state.user.lastName}`,
                        action: 'logout' as const,
                        entityType: 'session',
                        entityId: state.sessionId,
                        sessionId: state.sessionId
                    };

                    const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
                    localStorage.setItem('auditLogs', JSON.stringify([auditLog, ...existingLogs]));
                }

                set({
                    user: null,
                    isAuthenticated: false,
                    sessionId: null
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

            addUser: (user: User, password: string) => {
                set(state => ({
                    users: [...state.users, { ...user, password }]
                }));
            },

            updateUser: (id: string, updates: Partial<User>) => {
                set(state => ({
                    users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
                    // If the updated user is the current logged in user, update that too
                    user: state.user?.id === id ? { ...state.user, ...updates } : state.user
                }));
            },

            deleteUser: (id: string) => {
                set(state => ({
                    users: state.users.filter(u => u.id !== id)
                }));
            },

            resetPassword: (id: string, newPassword: string) => {
                set(state => ({
                    users: state.users.map(u => u.id === id ? { ...u, password: newPassword } : u)
                }));
            }
        }),
        {
            name: 'pharma-qc-auth',
            partialize: (state) => ({ users: state.users }), // Only persist users list
        }
    )
);
