import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sample, TestResult, SampleStatus } from '../types';

interface SampleState {
    samples: Sample[];

    // Sample Actions
    registerSample: (sample: Omit<Sample, 'id' | 'createdAt' | 'updatedAt' | 'results' | 'status'>) => string;
    updateSampleStatus: (id: string, status: SampleStatus) => void;
    updateSample: (id: string, updates: Partial<Sample>) => void;
    getSample: (id: string) => Sample | undefined;

    // Result Actions
    saveResult: (sampleId: string, testMethodId: string, resultData: any, userId: string) => void;
    submitResult: (sampleId: string, testMethodId: string, userId: string) => void;
    reviewResult: (sampleId: string, testMethodId: string, userId: string, comments?: string) => void;
    approveResult: (sampleId: string, testMethodId: string, userId: string) => void;
}

const INITIAL_SAMPLES: Sample[] = [
    {
        id: 's_001',
        sampleNumber: 'S-2024-001',
        productId: 'prod_para_500',
        batchNumber: 'B12345',
        lotNumber: 'L001',
        manufacturingDate: '2024-01-15',
        expiryDate: '2026-01-14',
        receivedDate: new Date().toISOString(),
        receivedBy: 'admin',
        quantity: 100,
        unit: 'Tablets',
        status: 'in_analysis',
        priority: 'medium',
        testMethodIds: ['tm_assay_hplc', 'tm_dissolution'],
        customFields: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        results: [
            {
                id: 'res_001',
                sampleId: 's_001',
                testMethodId: 'tm_assay_hplc',
                status: 'completed',
                results: {
                    result: 99.5,
                    average: 99.5,
                    rsd: 0.5
                },
                enteredBy: 'analyst',
                enteredAt: new Date().toISOString(),
                outOfSpec: false
            },
            {
                id: 'res_002',
                sampleId: 's_001',
                testMethodId: 'tm_dissolution',
                status: 'pending',
                results: {},
                outOfSpec: false
            }
        ]
    }
];

export const useSampleStore = create<SampleState>()(
    persist(
        (set, get) => ({
            samples: INITIAL_SAMPLES,

            registerSample: (sampleData) => {
                const id = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const sampleNumber = `S-${new Date().getFullYear()}-${String(get().samples.length + 1).padStart(3, '0')}`;

                // Initialize empty results for all assigned test methods
                const initialResults: TestResult[] = sampleData.testMethodIds.map(tmId => ({
                    id: `res_${Date.now()}_${tmId}`,
                    sampleId: id,
                    testMethodId: tmId,
                    status: 'pending',
                    results: {},
                    outOfSpec: false
                }));

                const newSample: Sample = {
                    ...sampleData,
                    id,
                    sampleNumber,
                    status: 'received',
                    results: initialResults,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    samples: [newSample, ...state.samples]
                }));

                return id;
            },

            updateSampleStatus: (id, status) => {
                set((state) => ({
                    samples: state.samples.map((s) =>
                        s.id === id
                            ? { ...s, status, updatedAt: new Date().toISOString() }
                            : s
                    )
                }));
            },

            updateSample: (id, updates) => {
                set((state) => ({
                    samples: state.samples.map((s) =>
                        s.id === id
                            ? { ...s, ...updates, updatedAt: new Date().toISOString() }
                            : s
                    )
                }));
            },

            getSample: (id) => {
                return get().samples.find((s) => s.id === id);
            },

            saveResult: (sampleId, testMethodId, resultData, userId) => {
                set((state) => ({
                    samples: state.samples.map((s) => {
                        if (s.id !== sampleId) return s;

                        const updatedResults = s.results.map((r) => {
                            if (r.testMethodId !== testMethodId) return r;

                            return {
                                ...r,
                                results: resultData,
                                status: 'in_progress' as const,
                                enteredBy: userId,
                                enteredAt: new Date().toISOString()
                            };
                        });

                        return { ...s, results: updatedResults, updatedAt: new Date().toISOString() };
                    })
                }));
            },

            submitResult: (sampleId, testMethodId, userId) => {
                set((state) => ({
                    samples: state.samples.map((s) => {
                        if (s.id !== sampleId) return s;

                        const updatedResults = s.results.map((r) => {
                            if (r.testMethodId !== testMethodId) return r;

                            return {
                                ...r,
                                status: 'completed' as const,
                                enteredBy: userId,
                                enteredAt: new Date().toISOString()
                            };
                        });

                        // Check if all results are completed to update sample status
                        const allCompleted = updatedResults.every(r => r.status === 'completed' || r.status === 'reviewed' || r.status === 'approved');
                        const newStatus = allCompleted ? 'under_review' : 'in_analysis';

                        return { ...s, results: updatedResults, status: newStatus, updatedAt: new Date().toISOString() };
                    })
                }));
            },

            reviewResult: (sampleId, testMethodId, userId, comments) => {
                set((state) => ({
                    samples: state.samples.map((s) => {
                        if (s.id !== sampleId) return s;

                        const updatedResults = s.results.map((r) => {
                            if (r.testMethodId !== testMethodId) return r;

                            return {
                                ...r,
                                status: 'reviewed' as const,
                                reviewedBy: userId,
                                reviewedAt: new Date().toISOString(),
                                comments
                            };
                        });

                        return { ...s, results: updatedResults, updatedAt: new Date().toISOString() };
                    })
                }));
            },

            approveResult: (sampleId, testMethodId, userId) => {
                set((state) => ({
                    samples: state.samples.map((s) => {
                        if (s.id !== sampleId) return s;

                        const updatedResults = s.results.map((r) => {
                            if (r.testMethodId !== testMethodId) return r;

                            return {
                                ...r,
                                status: 'approved' as const,
                                approvedBy: userId,
                                approvedAt: new Date().toISOString()
                            };
                        });

                        // Check if all results are approved to update sample status
                        const allApproved = updatedResults.every(r => r.status === 'approved');
                        const newStatus = allApproved ? 'approved' : 'under_review';

                        return { ...s, results: updatedResults, status: newStatus, updatedAt: new Date().toISOString() };
                    })
                }));
            }
        }),
        {
            name: 'pharma-qc-samples'
        }
    )
);
