import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { StabilityStudy, StabilityProtocol, TimePoint, StabilityTestResult } from '../types/stability';

interface StabilityState {
    studies: StabilityStudy[];
    protocols: StabilityProtocol[];
    isLoading: boolean;
    error: string | null;

    // Study Actions
    fetchStudies: () => Promise<void>;
    addStudy: (study: Omit<StabilityStudy, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<string | null>;
    updateStudy: (id: string, updates: Partial<StabilityStudy>) => Promise<void>;
    deleteStudy: (id: string) => Promise<void>;
    getStudy: (id: string) => StabilityStudy | undefined;
    getStudiesByProduct: (productId: string) => StabilityStudy[];
    getActiveStudies: () => StabilityStudy[];

    // Time Point Actions
    addTimePoint: (studyId: string, timePoint: Omit<TimePoint, 'id'>) => Promise<string | null>;
    updateTimePoint: (studyId: string, timePointId: string, updates: Partial<TimePoint>) => Promise<void>;
    completeTimePoint: (studyId: string, timePointId: string) => Promise<void>;

    // Test Result Actions
    addTestResult: (studyId: string, timePointId: string, result: Omit<StabilityTestResult, 'id'>) => Promise<string | null>;
    updateTestResult: (studyId: string, timePointId: string, resultId: string, updates: Partial<StabilityTestResult>) => Promise<void>;

    // Protocol Actions
    addProtocol: (protocol: Omit<StabilityProtocol, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
    updateProtocol: (id: string, updates: Partial<StabilityProtocol>) => Promise<void>;
    deleteProtocol: (id: string) => Promise<void>;
    getProtocol: (id: string) => StabilityProtocol | undefined;
    approveProtocol: (id: string, approvedBy: string) => Promise<void>;
}

export const useStabilityStore = create<StabilityState>((set, get) => ({
    studies: [],
    protocols: [],
    isLoading: false,
    error: null,

    fetchStudies: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch Studies
            const { data: studiesData, error: studiesError } = await supabase
                .from('stability_studies')
                .select('*')
                .order('created_at', { ascending: false });
            if (studiesError) throw studiesError;

            // Fetch Protocols
            let protocols: any[] = [];
            try {
                const { data: protocolsData, error: protocolsError } = await supabase
                    .from('stability_protocols')
                    .select('*');
                if (!protocolsError) protocols = protocolsData;
            } catch (e) {
                console.warn('Error fetching protocols', e);
            }

            // Fetch Time Points
            const { data: timePointsData, error: tpError } = await supabase
                .from('stability_time_points')
                .select('*');
            if (tpError) throw tpError;

            // Fetch Test Results
            let results: any[] = [];
            try {
                const { data: resultsData, error: resError } = await supabase
                    .from('stability_test_results')
                    .select('*');
                if (!resError) results = resultsData;
            } catch (e) {
                console.warn('Error fetching test results', e);
            }

            // Map Data
            const mappedStudies: StabilityStudy[] = studiesData.map((s: any) => {
                const studyTimePoints = timePointsData
                    .filter((tp: any) => tp.study_id === s.id)
                    .map((tp: any) => ({
                        id: tp.id,
                        studyId: tp.study_id,
                        timePoint: tp.time_point_label,
                        scheduledDate: tp.scheduled_date,
                        actualDate: tp.actual_date,
                        status: tp.status,
                        observations: tp.observations,
                        testResults: results
                            .filter((r: any) => r.time_point_id === tp.id)
                            .map((r: any) => ({
                                id: r.id,
                                timePointId: r.time_point_id,
                                testMethodId: r.test_method_id,
                                testMethodName: '', // Placeholder, would need join or lookup
                                parameter: r.parameter,
                                result: r.result_value,
                                unit: r.unit,
                                specification: r.specification,
                                status: r.status,
                                remarks: r.remarks,
                                testedBy: r.tested_by,
                                testedDate: r.tested_date
                            }))
                    }));

                return {
                    id: s.id,
                    studyNumber: s.study_number,
                    productId: s.product_id,
                    productName: '', // Placeholder
                    batchNumber: s.batch_number,
                    studyType: s.study_type,
                    storageCondition: typeof s.storage_condition === 'string' ? JSON.parse(s.storage_condition) : s.storage_condition,
                    startDate: s.start_date,
                    status: s.status,
                    protocol: s.protocol_id,
                    timePoints: studyTimePoints,
                    createdBy: s.created_by,
                    createdAt: s.created_at,
                    updatedAt: s.created_at
                };
            });

            const mappedProtocols: StabilityProtocol[] = protocols.map((p: any) => ({
                id: p.id,
                protocolNumber: p.protocol_number,
                title: p.title,
                studyType: p.study_type,
                storageConditions: p.storage_conditions,
                timePoints: p.time_points,
                testMethods: p.test_methods,
                samplingPlan: p.sampling_plan,
                acceptanceCriteria: p.acceptance_criteria,
                status: p.status,
                approvedBy: p.approved_by,
                approvedDate: p.approved_date,
                createdBy: p.created_by,
                createdAt: p.created_at,
                updatedAt: p.updated_at
            }));

            set({ studies: mappedStudies, protocols: mappedProtocols });

        } catch (error: any) {
            console.error('Error fetching stability data:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addStudy: async (study) => {
        set({ isLoading: true, error: null });
        try {
            const studyNumber = study.studyNumber || `STB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { data, error } = await supabase
                .from('stability_studies')
                .insert({
                    study_number: studyNumber,
                    product_id: study.productId,
                    batch_number: study.batchNumber,
                    study_type: study.studyType,
                    storage_condition: JSON.stringify(study.storageCondition),
                    start_date: study.startDate,
                    status: study.status,
                    protocol_id: study.protocol, // Assuming protocol is ID
                    created_by: study.createdBy,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            // Add initial time points if any
            if (study.timePoints && study.timePoints.length > 0) {
                const timePointsToInsert = study.timePoints.map(tp => ({
                    study_id: data.id,
                    time_point_label: tp.timePoint,
                    scheduled_date: tp.scheduledDate,
                    status: 'pending'
                }));

                const { error: tpError } = await supabase
                    .from('stability_time_points')
                    .insert(timePointsToInsert);

                if (tpError) throw tpError;
            }

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
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.storageCondition) dbUpdates.storage_condition = JSON.stringify(updates.storageCondition);
            // Add other fields as needed

            const { error } = await supabase
                .from('stability_studies')
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
                .from('stability_studies')
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

    getActiveStudies: () => {
        return get().studies.filter((s) => s.status === 'active');
    },

    addTimePoint: async (studyId, timePoint) => {
        try {
            const { data, error } = await supabase
                .from('stability_time_points')
                .insert({
                    study_id: studyId,
                    time_point_label: timePoint.timePoint,
                    scheduled_date: timePoint.scheduledDate,
                    status: timePoint.status || 'pending',
                    observations: timePoint.observations
                })
                .select()
                .single();

            if (error) throw error;
            await get().fetchStudies();
            return data.id;
        } catch (error: any) {
            console.error('Error adding time point:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateTimePoint: async (_studyId, timePointId, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.actualDate) dbUpdates.actual_date = updates.actualDate;
            if (updates.observations) dbUpdates.observations = updates.observations;

            const { error } = await supabase
                .from('stability_time_points')
                .update(dbUpdates)
                .eq('id', timePointId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating time point:', error);
            set({ error: error.message });
        }
    },

    completeTimePoint: async (_studyId, timePointId) => {
        try {
            const { error } = await supabase
                .from('stability_time_points')
                .update({
                    status: 'completed',
                    actual_date: new Date().toISOString()
                })
                .eq('id', timePointId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error completing time point:', error);
            set({ error: error.message });
        }
    },

    addTestResult: async (_studyId, timePointId, result) => {
        try {
            const { data, error } = await supabase
                .from('stability_test_results')
                .insert({
                    time_point_id: timePointId,
                    test_method_id: result.testMethodId,
                    parameter: result.parameter,
                    result_value: String(result.result),
                    unit: result.unit,
                    specification: result.specification,
                    status: result.status,
                    remarks: result.remarks,
                    tested_by: result.testedBy,
                    tested_date: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            await get().fetchStudies();
            return data.id;
        } catch (error: any) {
            console.error('Error adding test result:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateTestResult: async (_studyId, _timePointId, resultId, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.result !== undefined) dbUpdates.result_value = String(updates.result);
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.remarks) dbUpdates.remarks = updates.remarks;

            const { error } = await supabase
                .from('stability_test_results')
                .update(dbUpdates)
                .eq('id', resultId);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating test result:', error);
            set({ error: error.message });
        }
    },

    addProtocol: async (protocol) => {
        try {
            const protocolNumber = protocol.protocolNumber || `PROT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { data, error } = await supabase
                .from('stability_protocols')
                .insert({
                    protocol_number: protocolNumber,
                    title: protocol.title,
                    study_type: protocol.studyType,
                    storage_conditions: protocol.storageConditions,
                    time_points: protocol.timePoints,
                    test_methods: protocol.testMethods,
                    sampling_plan: protocol.samplingPlan,
                    acceptance_criteria: protocol.acceptanceCriteria,
                    status: 'draft',
                    created_by: protocol.createdBy,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            await get().fetchStudies();
            return data.id;
        } catch (error: any) {
            console.error('Error adding protocol:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateProtocol: async (id, updates) => {
        try {
            const { error } = await supabase
                .from('stability_protocols')
                .update({
                    title: updates.title,
                    study_type: updates.studyType,
                    storage_conditions: updates.storageConditions,
                    time_points: updates.timePoints,
                    test_methods: updates.testMethods,
                    sampling_plan: updates.samplingPlan,
                    acceptance_criteria: updates.acceptanceCriteria,
                    status: updates.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error updating protocol:', error);
            set({ error: error.message });
        }
    },

    deleteProtocol: async (id) => {
        try {
            const { error } = await supabase
                .from('stability_protocols')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error deleting protocol:', error);
            set({ error: error.message });
        }
    },

    getProtocol: (id) => {
        return get().protocols.find((p) => p.id === id);
    },

    approveProtocol: async (id, approvedBy) => {
        try {
            const { error } = await supabase
                .from('stability_protocols')
                .update({
                    status: 'approved',
                    approved_by: approvedBy,
                    approved_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            await get().fetchStudies();
        } catch (error: any) {
            console.error('Error approving protocol:', error);
            set({ error: error.message });
        }
    }
}));
