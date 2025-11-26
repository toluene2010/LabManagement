import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StabilityStudy, StabilityProtocol, TimePoint, StabilityTestResult } from '../types/stability';

interface StabilityState {
    studies: StabilityStudy[];
    protocols: StabilityProtocol[];

    // Study Actions
    addStudy: (study: Omit<StabilityStudy, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => string;
    updateStudy: (id: string, updates: Partial<StabilityStudy>) => void;
    deleteStudy: (id: string) => void;
    getStudy: (id: string) => StabilityStudy | undefined;
    getStudiesByProduct: (productId: string) => StabilityStudy[];
    getActiveStudies: () => StabilityStudy[];

    // Time Point Actions
    addTimePoint: (studyId: string, timePoint: Omit<TimePoint, 'id'>) => string;
    updateTimePoint: (studyId: string, timePointId: string, updates: Partial<TimePoint>) => void;
    completeTimePoint: (studyId: string, timePointId: string) => void;

    // Test Result Actions
    addTestResult: (studyId: string, timePointId: string, result: Omit<StabilityTestResult, 'id'>) => string;
    updateTestResult: (studyId: string, timePointId: string, resultId: string, updates: Partial<StabilityTestResult>) => void;

    // Protocol Actions
    addProtocol: (protocol: Omit<StabilityProtocol, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateProtocol: (id: string, updates: Partial<StabilityProtocol>) => void;
    deleteProtocol: (id: string) => void;
    getProtocol: (id: string) => StabilityProtocol | undefined;
    approveProtocol: (id: string, approvedBy: string) => void;
}

export const useStabilityStore = create<StabilityState>()(
    persist(
        (set, get) => ({
            // Initialize with empty arrays (mock data can be added later)
            studies: [],
            protocols: [],

            // Study Actions
            addStudy: (study) => {
                const id = study.id || `stab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newStudy: StabilityStudy = {
                    ...study,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    studies: [...state.studies, newStudy]
                }));

                return id;
            },

            updateStudy: (id, updates) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === id
                            ? { ...s, ...updates, updatedAt: new Date().toISOString() }
                            : s
                    )
                }));
            },

            deleteStudy: (id) => {
                set((state) => ({
                    studies: state.studies.filter((s) => s.id !== id)
                }));
            },

            getStudy: (id) => {
                return get().studies.find((s) => s.id === id);
            },

            getStudiesByProduct: (productId) => {
                return get().studies.filter((s) => s.productId === productId);
            },

            getActiveStudies: () => {
                return get().studies.filter((s) => s.status === 'active');
            },

            // Time Point Actions
            addTimePoint: (studyId, timePoint) => {
                const id = `tp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newTimePoint: TimePoint = {
                    ...timePoint,
                    id,
                    studyId
                };

                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                timePoints: [...s.timePoints, newTimePoint],
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));

                return id;
            },

            updateTimePoint: (studyId, timePointId, updates) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                timePoints: s.timePoints.map((tp) =>
                                    tp.id === timePointId ? { ...tp, ...updates } : tp
                                ),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            completeTimePoint: (studyId, timePointId) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                timePoints: s.timePoints.map((tp) =>
                                    tp.id === timePointId
                                        ? {
                                            ...tp,
                                            status: 'completed' as const,
                                            actualDate: new Date().toISOString()
                                        }
                                        : tp
                                ),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            // Test Result Actions
            addTestResult: (studyId, timePointId, result) => {
                const id = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newResult: StabilityTestResult = {
                    ...result,
                    id,
                    timePointId
                };

                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                timePoints: s.timePoints.map((tp) =>
                                    tp.id === timePointId
                                        ? {
                                            ...tp,
                                            testResults: [...tp.testResults, newResult]
                                        }
                                        : tp
                                ),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));

                return id;
            },

            updateTestResult: (studyId, timePointId, resultId, updates) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                timePoints: s.timePoints.map((tp) =>
                                    tp.id === timePointId
                                        ? {
                                            ...tp,
                                            testResults: tp.testResults.map((r) =>
                                                r.id === resultId ? { ...r, ...updates } : r
                                            )
                                        }
                                        : tp
                                ),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            // Protocol Actions
            addProtocol: (protocol) => {
                const id = `prot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newProtocol: StabilityProtocol = {
                    ...protocol,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    protocols: [...state.protocols, newProtocol]
                }));

                return id;
            },

            updateProtocol: (id, updates) => {
                set((state) => ({
                    protocols: state.protocols.map((p) =>
                        p.id === id
                            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                            : p
                    )
                }));
            },

            deleteProtocol: (id) => {
                set((state) => ({
                    protocols: state.protocols.filter((p) => p.id !== id)
                }));
            },

            getProtocol: (id) => {
                return get().protocols.find((p) => p.id === id);
            },

            approveProtocol: (id, approvedBy) => {
                set((state) => ({
                    protocols: state.protocols.map((p) =>
                        p.id === id
                            ? {
                                ...p,
                                status: 'approved' as const,
                                approvedBy,
                                approvedDate: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            }
                            : p
                    )
                }));
            }
        }),
        {
            name: 'pharma-qc-stability'
        }
    )
);
