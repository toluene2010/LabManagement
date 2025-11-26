import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanySettings {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logoUrl: string; // Base64 or URL
    taxId?: string;
    licenseNumber?: string;
}

interface ConfigState {
    company: CompanySettings;
    updateCompany: (settings: Partial<CompanySettings>) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            company: {
                name: 'Acme Pharmaceuticals',
                address: '123 Science Drive, Tech City, TC 90210',
                phone: '+1 (555) 123-4567',
                email: 'info@acmepharma.com',
                website: 'www.acmepharma.com',
                logoUrl: '',
                licenseNumber: 'PH-LIC-2024-001'
            },
            theme: 'light',
            updateCompany: (settings) => set((state) => ({
                company: { ...state.company, ...settings }
            })),
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),
        }),
        {
            name: 'pharma-qc-config',
        }
    )
);
