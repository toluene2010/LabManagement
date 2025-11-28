import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Sample, SampleStatus } from '../types';

interface SampleState {
    samples: Sample[];
    isLoading: boolean;
    error: string | null;

    // Sample Actions
    fetchSamples: () => Promise<void>;
    registerSample: (sample: Omit<Sample, 'id' | 'createdAt' | 'updatedAt' | 'results' | 'status'>) => Promise<string | null>;
    updateSampleStatus: (id: string, status: SampleStatus) => Promise<void>;
    updateSample: (id: string, updates: Partial<Sample>) => Promise<void>;
    deleteSample: (id: string) => Promise<void>;
    getSample: (id: string) => Sample | undefined;

    // Result Actions
    saveResult: (sampleId: string, testMethodId: string, resultData: any, userId: string) => Promise<void>;
    submitResult: (sampleId: string, testMethodId: string, userId: string) => Promise<void>;
    reviewResult: (sampleId: string, testMethodId: string, userId: string, comments?: string) => Promise<void>;
    approveResult: (sampleId: string, testMethodId: string, userId: string) => Promise<void>;
}

export const useSampleStore = create<SampleState>((set, get) => ({
    samples: [],
    isLoading: false,
    error: null,

    fetchSamples: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch samples
            const { data: samplesData, error: samplesError } = await supabase
                .from('samples')
                .select('*')
                .order('created_at', { ascending: false });

            if (samplesError) throw samplesError;

            // Fetch results for these samples
            const { data: resultsData, error: resultsError } = await supabase
                .from('test_results')
                .select('*');

            if (resultsError) throw resultsError;

            // Map to application type
            const mappedSamples: Sample[] = samplesData.map((s: any) => {
                const sampleResults = resultsData
                    .filter((r: any) => r.sample_id === s.id)
                    .map((r: any) => ({
                        id: r.id,
                        sampleId: r.sample_id,
                        testMethodId: r.test_method_id,
                        status: r.status,
                        results: r.result_value ? JSON.parse(r.result_value) : {},
                        outOfSpec: false, // Logic to determine this could be added
                        enteredBy: r.tested_by,
                        enteredAt: r.tested_at,
                        reviewedBy: undefined, // Need to add these columns to DB if needed
                        reviewedAt: undefined,
                        approvedBy: undefined,
                        approvedAt: undefined,
                        comments: r.remarks
                    }));

                return {
                    id: s.id,
                    sampleNumber: s.sample_id,
                    productId: s.product_id,
                    batchNumber: s.batch_number,
                    lotNumber: '', // Missing in DB schema, add if needed
                    manufacturingDate: s.manufacturing_date,
                    expiryDate: s.expiry_date,
                    receivedDate: s.received_date,
                    receivedBy: '', // Need to fetch profile name or store ID
                    quantity: 0, // Missing in DB
                    unit: 'g', // Missing in DB
                    status: s.status as SampleStatus,
                    priority: s.priority,
                    testMethodIds: sampleResults.map((r: any) => r.testMethodId),
                    customFields: {},
                    createdAt: s.created_at,
                    updatedAt: s.created_at, // Use created_at as fallback
                    results: sampleResults,
                    dueDate: '', // Missing in DB
                    assignedTo: s.analyst_id
                };
            });

            set({ samples: mappedSamples });
        } catch (error: any) {
            console.error('Error fetching samples:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    registerSample: async (sampleData) => {
        set({ isLoading: true, error: null });
        try {
            // 1. Insert Sample
            const { data: newSampleData, error: sampleError } = await supabase
                .from('samples')
                .insert({
                    sample_id: `S-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Simple ID generation
                    product_id: sampleData.productId,
                    batch_number: sampleData.batchNumber,
                    manufacturing_date: sampleData.manufacturingDate || null,
                    expiry_date: sampleData.expiryDate || null,
                    received_date: sampleData.receivedDate,
                    status: 'received',
                    priority: sampleData.priority,
                    analyst_id: sampleData.assignedTo || null
                    // Add other fields if schema supports them
                })
                .select()
                .single();

            if (sampleError) throw sampleError;

            // 2. Insert Initial Test Results
            if (sampleData.testMethodIds.length > 0) {
                const resultsToInsert = sampleData.testMethodIds.map(tmId => ({
                    sample_id: newSampleData.id,
                    test_method_id: tmId,
                    status: 'pending',
                    result_value: '{}'
                }));

                const { error: resultsError } = await supabase
                    .from('test_results')
                    .insert(resultsToInsert);

                if (resultsError) throw resultsError;
            }

            // Refresh samples
            await get().fetchSamples();
            return newSampleData.id;

        } catch (error: any) {
            console.error('Error registering sample:', error);
            set({ error: error.message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    updateSampleStatus: async (id, status) => {
        try {
            const { error } = await supabase
                .from('samples')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            await get().fetchSamples();
        } catch (error: any) {
            console.error('Error updating sample status:', error);
            set({ error: error.message });
        }
    },

    updateSample: async (id, updates) => {
        // Implementation for general updates if needed
        console.log('Update sample not fully implemented yet', id, updates);
    },

    getSample: (id) => {
        return get().samples.find((s) => s.id === id);
    },

    deleteSample: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // Delete sample (test_results will be cascade deleted due to ON DELETE CASCADE)
            const { error } = await supabase
                .from('samples')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local state
            set((state) => ({
                samples: state.samples.filter((s) => s.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            console.error('Error deleting sample:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    saveResult: async (sampleId, testMethodId, resultData, userId) => {
        try {
            // Find the result ID (assuming one result per test method per sample for now)
            const { data: resultRow, error: findError } = await supabase
                .from('test_results')
                .select('id')
                .eq('sample_id', sampleId)
                .eq('test_method_id', testMethodId)
                .single();

            if (findError) throw findError;

            const { error } = await supabase
                .from('test_results')
                .update({
                    result_value: JSON.stringify(resultData),
                    status: 'in_progress',
                    tested_by: userId,
                    tested_at: new Date().toISOString()
                })
                .eq('id', resultRow.id);

            if (error) throw error;
            await get().fetchSamples();
        } catch (error: any) {
            console.error('Error saving result:', error);
            set({ error: error.message });
        }
    },

    submitResult: async (sampleId, testMethodId, userId) => {
        try {
            const { data: resultRow, error: findError } = await supabase
                .from('test_results')
                .select('id')
                .eq('sample_id', sampleId)
                .eq('test_method_id', testMethodId)
                .single();

            if (findError) throw findError;

            const { error } = await supabase
                .from('test_results')
                .update({
                    status: 'completed',
                    tested_by: userId, // Ensure this is set on submit
                    tested_at: new Date().toISOString()
                })
                .eq('id', resultRow.id);

            if (error) throw error;

            // Check if all results are completed to update sample status?
            // For now, just refresh
            await get().fetchSamples();
        } catch (error: any) {
            console.error('Error submitting result:', error);
            set({ error: error.message });
        }
    },

    reviewResult: async (sampleId, testMethodId, _userId, comments) => {
        try {
            const { data: resultRow, error: findError } = await supabase
                .from('test_results')
                .select('id')
                .eq('sample_id', sampleId)
                .eq('test_method_id', testMethodId)
                .single();

            if (findError) throw findError;

            const { error } = await supabase
                .from('test_results')
                .update({
                    status: 'reviewed',
                    remarks: comments
                    // Add reviewed_by and reviewed_at columns to DB if needed
                })
                .eq('id', resultRow.id);

            if (error) throw error;
            await get().fetchSamples();
        } catch (error: any) {
            console.error('Error reviewing result:', error);
            set({ error: error.message });
        }
    },

    approveResult: async (sampleId, testMethodId, _userId) => {
        try {
            const { data: resultRow, error: findError } = await supabase
                .from('test_results')
                .select('id')
                .eq('sample_id', sampleId)
                .eq('test_method_id', testMethodId)
                .single();

            if (findError) throw findError;

            const { error } = await supabase
                .from('test_results')
                .update({
                    status: 'approved'
                    // Add approved_by and approved_at columns to DB if needed
                })
                .eq('id', resultRow.id);

            if (error) throw error;
            await get().fetchSamples();
        } catch (error: any) {
            console.error('Error approving result:', error);
            set({ error: error.message });
        }
    }
}));
