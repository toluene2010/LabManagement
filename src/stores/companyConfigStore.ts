import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanyConfig {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;
    logoUrl: string | null;
    logoFile: string | null; // Base64 encoded image
    // Certificate header styling
    headerBackgroundColor: string; // Hex color for header background
    headerTextColor: string; // Hex color for header text
}

interface CompanyConfigState {
    config: CompanyConfig;
    updateConfig: (updates: Partial<CompanyConfig>) => void;
    uploadLogo: (file: File) => Promise<void>;
    removeLogo: () => void;
    resetConfig: () => void;
}

const DEFAULT_CONFIG: CompanyConfig = {
    companyName: 'Pharmaceutical Company',
    companyAddress: '123 Pharma Street, Medical City, MC 12345',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'info@pharmacompany.com',
    companyWebsite: 'www.pharmacompany.com',
    logoUrl: null,
    logoFile: null,
    headerBackgroundColor: '#3B82F6', // Blue
    headerTextColor: '#FFFFFF', // White
};

export const useCompanyConfig = create<CompanyConfigState>()(
    persist(
        (set) => ({
            config: DEFAULT_CONFIG,

            updateConfig: (updates) =>
                set((state) => ({
                    config: { ...state.config, ...updates },
                })),

            uploadLogo: async (file: File) => {
                return new Promise((resolve, reject) => {
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        reject(new Error('Please upload an image file'));
                        return;
                    }

                    // Validate file size (max 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                        reject(new Error('Image size must be less than 2MB'));
                        return;
                    }

                    const reader = new FileReader();

                    reader.onload = (e) => {
                        const base64 = e.target?.result as string;
                        set((state) => ({
                            config: {
                                ...state.config,
                                logoFile: base64,
                                logoUrl: URL.createObjectURL(file),
                            },
                        }));
                        resolve();
                    };

                    reader.onerror = () => {
                        reject(new Error('Failed to read image file'));
                    };

                    reader.readAsDataURL(file);
                });
            },

            removeLogo: () =>
                set((state) => ({
                    config: {
                        ...state.config,
                        logoUrl: null,
                        logoFile: null,
                    },
                })),

            resetConfig: () =>
                set({ config: DEFAULT_CONFIG }),
        }),
        {
            name: 'pharma-qc-company-config',
        }
    )
);
