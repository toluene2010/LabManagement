import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { RDStudy, StudyParameter, DissolutionProfile, ComparabilityAnalysis } from '../types/rd-studies';

interface RDStudyState {
    studies: RDStudy[];
    comparabilityAnalyses: ComparabilityAnalysis[];
    isLoading: boolean;
    error: string | null;

    // Study Actions
    fetchStudies: () => Promise<void>;
    addStudy: (study: Omit<RDStudy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
    updateStudy: (id: string, updates: Partial<RDStudy>) => Promise<void>;
    deleteStudy: (id: string) => Promise<void>;
    getStudy: (id: string) => RDStudy | undefined;
    getStudiesByProduct: (productId: string) => RDStudy[];
    getStudiesByType: (studyType: RDStudy['studyType']) => RDStudy[];

    // Parameter Actions
    addParameter: (studyId: string, parameter: Omit<StudyParameter, 'id'>) => Promise<string | null>;
    updateParameter: (studyId: string, parameterId: string, updates: Partial<StudyParameter>) => Promise<void>;
    deleteParameter: (studyId: string, parameterId: string) => Promise<void>;

    // Dissolution Profile Actions
    addDissolutionProfile: (studyId: string, profile: Omit<DissolutionProfile, 'id'>) => Promise<string | null>;
    updateDissolutionProfile: (studyId: string, profileId: string, updates: Partial<DissolutionProfile>) => Promise<void>;
    deleteDissolutionProfile: (studyId: string, profileId: string) => Promise<void>;
    getDissolutionProfile: (studyId: string, profileId: string) => DissolutionProfile | undefined;

    // Comparability Analysis Actions
    addComparabilityAnalysis: (analysis: Omit<ComparabilityAnalysis, 'id'>) => Promise<string | null>;
    updateComparabilityAnalysis: (id: string, updates: Partial<ComparabilityAnalysis>) => Promise<void>;
    deleteComparabilityAnalysis: (id: string) => Promise<void>;
    getComparabilityAnalysesByStudy: (studyId: string) => ComparabilityAnalysis[];

    // Utility Functions
    calculateF1F2: (referenceProfile: DissolutionProfile, testProfile: DissolutionProfile) => { f1: number; f2: number };
}

export const useRDStudyStore = create<RDStudyState>((set, get) => ({
    studies: [],
    comparabilityAnalyses: [],
    isLoading: false,
    error: null,

    fetchStudies: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch Studies
            const { data: studiesData, error: studiesError } = await supabase
                .from('rd_studies')
                .select('*')
                .order('created_at', { ascending: false });
            if (studiesError) throw studiesError;

            // Fetch Dissolution Profiles
            let profiles: any[] = [];
            try {
                const { data: profilesData, error: profilesError } = await supabase
                    .from('rd_dissolution_profiles')
                    .select('*');
                if (!profilesError) profiles = profilesData;
            } catch (e) {
                console.warn('Error fetching profiles', e);
            }

            // Fetch Comparability Analyses
            let analyses: any[] = [];
            try {
                const { data: analysesData, error: analysesError } = await supabase
                    .from('rd_comparability_analyses')
                    .select('*');
                if (!analysesError) analyses = analysesData;
            } catch (e) {
                console.warn('Error fetching analyses', e);
            }

            // Map Data
            const mappedStudies: RDStudy[] = studiesData.map((s: any) => ({
                id: s.id,
                studyNumber: s.study_number,
                studyTitle: s.study_title,
                studyType: s.study_type,
                productId: s.product_id,
                productName: '', // Placeholder
                status: s.status,
                objective: s.objective,
                startDate: s.start_date,
                endDate: s.end_date,
                leadScientist: s.lead_scientist,
                teamMembers: s.team_members || [],
                parameters: s.parameters || [],
                conclusions: s.conclusions,
                recommendations: s.recommendations,
                createdBy: s.created_by,
                createdAt: s.created_at,
                updatedAt: s.updated_at,
                dissolutionProfiles: profiles
                    .filter((p: any) => p.rd_study_id === s.id)
                    .map((p: any) => ({
                        id: p.id,
                        sampleId: p.sample_id,
                        sampleDescription: p.sample_description,
                        batchNumber: p.batch_number,
                        testDate: p.test_date,
                        medium: p.medium,
                        apparatus: p.apparatus,
                        rpm: p.rpm,
                        temperature: p.temperature,
                        timePoints: p.time_points,
                        testedBy: p.tested_by,
                        remarks: p.remarks
                    }))
            }));

            const mappedAnalyses: ComparabilityAnalysis[] = analyses.map((a: any) => ({
                id: a.id,
                rdStudyId: a.rd_study_id,
                analysisTitle: a.analysis_title,
                referenceProfile: a.reference_profile_id,
                testProfiles: a.test_profile_ids || [],
                comparisonMethod: a.comparison_method,
                f1Value: a.f1_value,
                f2Value: a.f2_value,
                conclusion: a.conclusion,
                analysisDate: a.analysis_date,
                analyzedBy: a.analyzed_by,
                remarks: a.remarks
            }));

            set({ studies: mappedStudies, comparabilityAnalyses: mappedAnalyses });

        } catch (error: any) {
            console.error('Error fetching R&D data:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addStudy: async (study) => {
        set({ isLoading: true, error: null });
        try {
            const studyNumber = study.studyNumber || `RD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { data, error } = await supabase
                .from('rd_studies')
                .insert({
                    study_number: studyNumber,
                    study_title: study.studyTitle,
                    study_type: study.studyType,
                    product_id: study.productId,
                    status: study.status,
                    objective: study.objective,
                    start_date: study.startDate,
                    end_date: study.endDate,
                    lead_scientist: study.leadScientist, // Assuming UUID
                    team_members: study.teamMembers,
                    parameters: study.parameters,
                    conclusions: study.conclusions,
                    recommendations: study.recommendations,
                    created_by: study.createdBy,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            await get().fetchStudies();
            return data.id;

        } catch (error: any) {
            console.error('Error adding study:', error);
            set({ error: error.message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    updateStudy: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.studyTitle) dbUpdates.study_title = updates.studyTitle;
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.parameters) dbUpdates.parameters = updates.parameters;
            // Add other fields as needed

            const { error } = await supabase
                .from('rd_studies')
                .update(dbUpdates)
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating study:', error);
            set({ error: error.message });
        }
    },

    deleteStudy: async (id) => {
        try {
            const { error } = await supabase
                .from('rd_studies')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error deleting study:', error);
            set({ error: error.message });
        }
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

    addParameter: async (studyId, parameter) => {
        try {
            const study = get().studies.find(s => s.id === studyId);
            if (!study) throw new Error('Study not found');

            const id = `param_${Date.now()}`;
            const newParameter = { ...parameter, id };
            const updatedParameters = [...(study.parameters || []), newParameter];

            const { error } = await supabase
                .from('rd_studies')
                .update({ parameters: updatedParameters })
                .eq('id', studyId);

            if (error) throw error;
            await get().fetchStudies();
            return id;
        } catch (error: any) {
            console.error('Error adding parameter:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateParameter: async (studyId, parameterId, updates) => {
        try {
            const study = get().studies.find(s => s.id === studyId);
            if (!study) throw new Error('Study not found');

            const updatedParameters = study.parameters.map(p =>
                p.id === parameterId ? { ...p, ...updates } : p
            );

            const { error } = await supabase
                .from('rd_studies')
                .update({ parameters: updatedParameters })
                .eq('id', studyId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating parameter:', error);
            set({ error: error.message });
        }
    },

    deleteParameter: async (studyId, parameterId) => {
        try {
            const study = get().studies.find(s => s.id === studyId);
            if (!study) throw new Error('Study not found');

            const updatedParameters = study.parameters.filter(p => p.id !== parameterId);

            const { error } = await supabase
                .from('rd_studies')
                .update({ parameters: updatedParameters })
                .eq('id', studyId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error deleting parameter:', error);
            set({ error: error.message });
        }
    },

    addDissolutionProfile: async (studyId, profile) => {
        try {
            const { data, error } = await supabase
                .from('rd_dissolution_profiles')
                .insert({
                    rd_study_id: studyId,
                    sample_id: profile.sampleId,
                    sample_description: profile.sampleDescription,
                    batch_number: profile.batchNumber,
                    test_date: profile.testDate,
                    medium: profile.medium,
                    apparatus: profile.apparatus,
                    rpm: profile.rpm,
                    temperature: profile.temperature,
                    time_points: profile.timePoints,
                    tested_by: profile.testedBy, // UUID
                    remarks: profile.remarks
                })
                .select()
                .single();

            if (error) throw error;
            await get().fetchStudies();
            return data.id;
        } catch (error: any) {
            console.error('Error adding dissolution profile:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateDissolutionProfile: async (_studyId, profileId, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.sampleId) dbUpdates.sample_id = updates.sampleId;
            if (updates.timePoints) dbUpdates.time_points = updates.timePoints;
            // Add other fields

            const { error } = await supabase
                .from('rd_dissolution_profiles')
                .update(dbUpdates)
                .eq('id', profileId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating dissolution profile:', error);
            set({ error: error.message });
        }
    },

    deleteDissolutionProfile: async (_studyId, profileId) => {
        try {
            const { error } = await supabase
                .from('rd_dissolution_profiles')
                .delete()
                .eq('id', profileId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error deleting dissolution profile:', error);
            set({ error: error.message });
        }
    },

    getDissolutionProfile: (studyId, profileId) => {
        const study = get().studies.find((s) => s.id === studyId);
        return study?.dissolutionProfiles?.find((p) => p.id === profileId);
    },

    addComparabilityAnalysis: async (analysis) => {
        try {
            const { data, error } = await supabase
                .from('rd_comparability_analyses')
                .insert({
                    rd_study_id: analysis.rdStudyId,
                    analysis_title: analysis.analysisTitle,
                    reference_profile_id: analysis.referenceProfile,
                    test_profile_ids: analysis.testProfiles,
                    comparison_method: analysis.comparisonMethod,
                    f1_value: analysis.f1Value,
                    f2_value: analysis.f2Value,
                    conclusion: analysis.conclusion,
                    analysis_date: analysis.analysisDate,
                    analyzed_by: analysis.analyzedBy,
                    remarks: analysis.remarks
                })
                .select()
                .single();

            if (error) throw error;
            await get().fetchStudies();
            return data.id;
        } catch (error: any) {
            console.error('Error adding comparability analysis:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateComparabilityAnalysis: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.analysisTitle) dbUpdates.analysis_title = updates.analysisTitle;
            // Add other fields

            const { error } = await supabase
                .from('rd_comparability_analyses')
                .update(dbUpdates)
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating comparability analysis:', error);
            set({ error: error.message });
        }
    },

    deleteComparabilityAnalysis: async (id) => {
        try {
            const { error } = await supabase
                .from('rd_comparability_analyses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error deleting comparability analysis:', error);
            set({ error: error.message });
        }
    },

    getComparabilityAnalysesByStudy: (studyId) => {
        return get().comparabilityAnalyses.filter((a) => a.rdStudyId === studyId);
    },

    calculateF1F2: (referenceProfile, testProfile) => {
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

            if (refValue <= 85 && testValue <= 85) {
                sumDiff += Math.abs(refValue - testValue);
                sumSquaredDiff += Math.pow(refValue - testValue, 2);
                n++;
            } else {
                break;
            }
        }

        const avgRef = refPoints.slice(0, n).reduce((sum, p) => sum + p.percentDissolved, 0) / n;
        const f1 = (sumDiff / (n * avgRef)) * 100;

        const f2 = 50 * Math.log10(100 / Math.sqrt(1 + (sumSquaredDiff / n)));

        return {
            f1: Math.round(f1 * 100) / 100,
            f2: Math.round(f2 * 100) / 100
        };
    }
}));
