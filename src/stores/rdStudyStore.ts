import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RDStudy, StudyParameter, DissolutionProfile, ComparabilityAnalysis } from '../types/rd-studies';

interface RDStudyState {
    studies: RDStudy[];
    comparabilityAnalyses: ComparabilityAnalysis[];

    // Study Actions
    addStudy: (study: Omit<RDStudy, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateStudy: (id: string, updates: Partial<RDStudy>) => void;
    deleteStudy: (id: string) => void;
    getStudy: (id: string) => RDStudy | undefined;
    getStudiesByProduct: (productId: string) => RDStudy[];
    getStudiesByType: (studyType: RDStudy['studyType']) => RDStudy[];

    // Parameter Actions
    addParameter: (studyId: string, parameter: Omit<StudyParameter, 'id'>) => string;
    updateParameter: (studyId: string, parameterId: string, updates: Partial<StudyParameter>) => void;
    deleteParameter: (studyId: string, parameterId: string) => void;

    // Dissolution Profile Actions
    addDissolutionProfile: (studyId: string, profile: Omit<DissolutionProfile, 'id'>) => string;
    updateDissolutionProfile: (studyId: string, profileId: string, updates: Partial<DissolutionProfile>) => void;
    deleteDissolutionProfile: (studyId: string, profileId: string) => void;
    getDissolutionProfile: (studyId: string, profileId: string) => DissolutionProfile | undefined;

    // Comparability Analysis Actions
    addComparabilityAnalysis: (analysis: Omit<ComparabilityAnalysis, 'id'>) => string;
    updateComparabilityAnalysis: (id: string, updates: Partial<ComparabilityAnalysis>) => void;
    deleteComparabilityAnalysis: (id: string) => void;
    getComparabilityAnalysesByStudy: (studyId: string) => ComparabilityAnalysis[];

    // Utility Functions
    calculateF1F2: (referenceProfile: DissolutionProfile, testProfile: DissolutionProfile) => { f1: number; f2: number };
}

export const useRDStudyStore = create<RDStudyState>()(
    persist(
        (set, get) => ({
            studies: [],
            comparabilityAnalyses: [],

            // Study Actions
            addStudy: (study) => {
                const id = `rd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newStudy: RDStudy = {
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

            getStudiesByType: (studyType) => {
                return get().studies.filter((s) => s.studyType === studyType);
            },

            // Parameter Actions
            addParameter: (studyId, parameter) => {
                const id = `param_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newParameter: StudyParameter = {
                    ...parameter,
                    id
                };

                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                parameters: [...s.parameters, newParameter],
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));

                return id;
            },

            updateParameter: (studyId, parameterId, updates) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                parameters: s.parameters.map((p) =>
                                    p.id === parameterId ? { ...p, ...updates } : p
                                ),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            deleteParameter: (studyId, parameterId) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                parameters: s.parameters.filter((p) => p.id !== parameterId),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            // Dissolution Profile Actions
            addDissolutionProfile: (studyId, profile) => {
                const id = `diss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newProfile: DissolutionProfile = {
                    ...profile,
                    id
                };

                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                dissolutionProfiles: [...(s.dissolutionProfiles || []), newProfile],
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));

                return id;
            },

            updateDissolutionProfile: (studyId, profileId, updates) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                dissolutionProfiles: (s.dissolutionProfiles || []).map((p) =>
                                    p.id === profileId ? { ...p, ...updates } : p
                                ),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            deleteDissolutionProfile: (studyId, profileId) => {
                set((state) => ({
                    studies: state.studies.map((s) =>
                        s.id === studyId
                            ? {
                                ...s,
                                dissolutionProfiles: (s.dissolutionProfiles || []).filter((p) => p.id !== profileId),
                                updatedAt: new Date().toISOString()
                            }
                            : s
                    )
                }));
            },

            getDissolutionProfile: (studyId, profileId) => {
                const study = get().studies.find((s) => s.id === studyId);
                return study?.dissolutionProfiles?.find((p) => p.id === profileId);
            },

            // Comparability Analysis Actions
            addComparabilityAnalysis: (analysis) => {
                const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newAnalysis: ComparabilityAnalysis = {
                    ...analysis,
                    id
                };

                set((state) => ({
                    comparabilityAnalyses: [...state.comparabilityAnalyses, newAnalysis]
                }));

                return id;
            },

            updateComparabilityAnalysis: (id, updates) => {
                set((state) => ({
                    comparabilityAnalyses: state.comparabilityAnalyses.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    )
                }));
            },

            deleteComparabilityAnalysis: (id) => {
                set((state) => ({
                    comparabilityAnalyses: state.comparabilityAnalyses.filter((a) => a.id !== id)
                }));
            },

            getComparabilityAnalysesByStudy: (studyId) => {
                return get().comparabilityAnalyses.filter((a) => a.rdStudyId === studyId);
            },

            // Utility Functions
            calculateF1F2: (referenceProfile, testProfile) => {
                // Ensure both profiles have matching time points
                const refPoints = referenceProfile.timePoints;
                const testPoints = testProfile.timePoints;

                if (refPoints.length !== testPoints.length) {
                    throw new Error('Profiles must have the same number of time points');
                }

                let sumDiff = 0;
                let sumSquaredDiff = 0;
                let n = 0;

                for (let i = 0; i < refPoints.length; i++) {
                    const refValue = refPoints[i].percentDissolved;
                    const testValue = testPoints[i].percentDissolved;

                    // Only include points until 85% dissolution or first point > 85%
                    if (refValue <= 85 && testValue <= 85) {
                        sumDiff += Math.abs(refValue - testValue);
                        sumSquaredDiff += Math.pow(refValue - testValue, 2);
                        n++;
                    } else {
                        break;
                    }
                }

                // Calculate F1 (Difference Factor)
                const avgRef = refPoints.slice(0, n).reduce((sum, p) => sum + p.percentDissolved, 0) / n;
                const f1 = (sumDiff / (n * avgRef)) * 100;

                // Calculate F2 (Similarity Factor)
                const f2 = 50 * Math.log10(100 / Math.sqrt(1 + (sumSquaredDiff / n)));

                return {
                    f1: Math.round(f1 * 100) / 100,
                    f2: Math.round(f2 * 100) / 100
                };
            }
        }),
        {
            name: 'pharma-qc-rd-studies'
        }
    )
);
