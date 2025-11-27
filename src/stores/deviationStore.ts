import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Deviation, CAPA, DeviationStatus, CAPAStatus } from '../types/deviation';

interface DeviationStore {
    deviations: Deviation[];
    capas: CAPA[];
    isLoading: boolean;
    error: string | null;

    // Deviation actions
    fetchDeviations: () => Promise<void>;
    addDeviation: (deviation: Omit<Deviation, 'id' | 'deviationNumber' | 'reportedDate' | 'capaIds'>) => Promise<void>;
    updateDeviation: (id: string, updates: Partial<Deviation>) => Promise<void>;
    updateDeviationStatus: (id: string, status: DeviationStatus, userId: string) => Promise<void>;

    // CAPA actions
    addCAPA: (capa: Omit<CAPA, 'id' | 'capaNumber' | 'createdDate'>) => Promise<void>;
    updateCAPA: (id: string, updates: Partial<CAPA>) => Promise<void>;
    updateCAPAStatus: (id: string, status: CAPAStatus, userId: string) => Promise<void>;

    // Queries
    getDeviationById: (id: string) => Deviation | undefined;
    getCAPAById: (id: string) => CAPA | undefined;
    getDeviationsBySample: (sampleId: string) => Deviation[];
    getCAPAsByDeviation: (deviationId: string) => CAPA[];
}

export const useDeviationStore = create<DeviationStore>((set, get) => ({
    deviations: [],
    capas: [],
    isLoading: false,
    error: null,

    fetchDeviations: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: deviationsData, error: devError } = await supabase
                .from('deviations')
                .select(`
                    *,
                    reported_by_user:reported_by(username, first_name, last_name),
                    closed_by_user:closed_by(username, first_name, last_name)
                `)
                .order('created_at', { ascending: false });

            if (devError) throw devError;

            // Try to fetch CAPAs, handle if table doesn't exist yet
            let loadedCapas: any[] = [];
            try {
                const { data: capasData, error: capaError } = await supabase
                    .from('capas')
                    .select(`
                        *,
                        created_by_user:created_by(username, first_name, last_name),
                        closed_by_user:closed_by(username, first_name, last_name)
                    `)
                    .order('created_at', { ascending: false });

                if (!capaError) {
                    loadedCapas = capasData;
                }
            } catch (e) {
                console.warn('Could not fetch CAPAs', e);
            }

            const mappedDeviations: Deviation[] = deviationsData.map((d: any) => ({
                id: d.id,
                deviationNumber: d.deviation_number,
                title: d.title,
                description: d.description,
                severity: d.severity,
                status: d.status,
                sampleId: d.related_batch, // Using related_batch as sampleId/batchNumber placeholder
                productId: d.product_id,
                batchNumber: d.related_batch,

                rootCause: d.root_cause,
                investigation: d.investigation,
                immediateAction: d.immediate_action,
                impactAssessment: d.impact_assessment,

                reportedBy: d.reported_by_user ? (d.reported_by_user.first_name ? `${d.reported_by_user.first_name} ${d.reported_by_user.last_name}` : d.reported_by_user.username) : 'Unknown',
                reportedDate: d.reported_at,
                closedBy: d.closed_by_user ? (d.closed_by_user.first_name ? `${d.closed_by_user.first_name} ${d.closed_by_user.last_name}` : d.closed_by_user.username) : undefined,
                closedDate: d.closed_at,

                capaIds: loadedCapas.filter((c: any) => c.deviation_id === d.id).map((c: any) => c.id)
            }));

            const mappedCapas: CAPA[] = loadedCapas.map((c: any) => ({
                id: c.id,
                capaNumber: c.capa_number,
                type: c.type,
                title: c.title,
                description: c.description,
                status: c.status,
                deviationId: c.deviation_id,
                actionPlan: c.action_plan,
                responsiblePerson: c.responsible_person,
                targetDate: c.target_date,

                implementationDetails: c.implementation_details,
                implementedBy: c.implemented_by,
                implementationDate: c.implementation_date,

                verificationMethod: c.verification_method,
                verifiedBy: c.verified_by,
                verificationDate: c.verification_date,
                verificationComments: c.verification_comments,

                effectivenessCheck: c.effectiveness_check,

                createdBy: c.created_by_user ? (c.created_by_user.first_name ? `${c.created_by_user.first_name} ${c.created_by_user.last_name}` : c.created_by_user.username) : 'Unknown',
                createdDate: c.created_at,
                closedBy: c.closed_by_user ? (c.closed_by_user.first_name ? `${c.closed_by_user.first_name} ${c.closed_by_user.last_name}` : c.closed_by_user.username) : undefined,
                closedDate: c.closed_at
            }));

            set({ deviations: mappedDeviations, capas: mappedCapas });

        } catch (error: any) {
            console.error('Error fetching deviations:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addDeviation: async (deviationData) => {
        set({ isLoading: true, error: null });
        try {
            const deviationNumber = `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { error } = await supabase
                .from('deviations')
                .insert({
                    deviation_number: deviationNumber,
                    title: deviationData.title,
                    description: deviationData.description,
                    severity: deviationData.severity,
                    status: 'open',
                    related_batch: deviationData.batchNumber,
                    product_id: deviationData.productId,
                    reported_by: deviationData.reportedBy, // Assuming UUID
                    reported_at: new Date().toISOString(),
                    root_cause: deviationData.rootCause,
                    investigation: deviationData.investigation,
                    immediate_action: deviationData.immediateAction,
                    impact_assessment: deviationData.impactAssessment
                });

            if (error) throw error;
            await get().fetchDeviations();

        } catch (error: any) {
            console.error('Error adding deviation:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateDeviation: async (id, updates) => {
        try {
            const { error } = await supabase
                .from('deviations')
                .update({
                    title: updates.title,
                    description: updates.description,
                    severity: updates.severity,
                    root_cause: updates.rootCause,
                    investigation: updates.investigation,
                    immediate_action: updates.immediateAction,
                    impact_assessment: updates.impactAssessment
                })
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error updating deviation:', error);
            set({ error: error.message });
        }
    },

    updateDeviationStatus: async (id, status, userId) => {
        try {
            const updates: any = { status };
            if (status === 'closed') {
                updates.closed_by = userId;
                updates.closed_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('deviations')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error updating deviation status:', error);
            set({ error: error.message });
        }
    },

    addCAPA: async (capaData) => {
        set({ isLoading: true, error: null });
        try {
            const capaNumber = `CAPA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { error } = await supabase
                .from('capas')
                .insert({
                    capa_number: capaNumber,
                    type: capaData.type,
                    title: capaData.title,
                    description: capaData.description,
                    status: 'open',
                    deviation_id: capaData.deviationId,
                    action_plan: capaData.actionPlan,
                    responsible_person: capaData.responsiblePerson,
                    target_date: capaData.targetDate,
                    created_by: capaData.createdBy,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;
            await get().fetchDeviations();

        } catch (error: any) {
            console.error('Error adding CAPA:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateCAPA: async (id, updates) => {
        try {
            const { error } = await supabase
                .from('capas')
                .update({
                    title: updates.title,
                    description: updates.description,
                    action_plan: updates.actionPlan,
                    responsible_person: updates.responsiblePerson,
                    target_date: updates.targetDate,
                    implementation_details: updates.implementationDetails,
                    verification_method: updates.verificationMethod,
                    verification_comments: updates.verificationComments,
                    effectiveness_check: updates.effectivenessCheck
                })
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error updating CAPA:', error);
            set({ error: error.message });
        }
    },

    updateCAPAStatus: async (id, status, userId) => {
        try {
            const updates: any = { status };
            const now = new Date().toISOString();

            if (status === 'closed') {
                updates.closed_by = userId;
                updates.closed_at = now;
            } else if (status === 'verified') {
                updates.verified_by = userId;
                updates.verification_date = now;
            } else if (status === 'in_progress') {
                updates.implemented_by = userId;
                updates.implementation_date = now;
            }

            const { error } = await supabase
                .from('capas')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error updating CAPA status:', error);
            set({ error: error.message });
        }
    },

    getDeviationById: (id) => {
        return get().deviations.find(dev => dev.id === id);
    },

    getCAPAById: (id) => {
        return get().capas.find(capa => capa.id === id);
    },

    getDeviationsBySample: (sampleId) => {
        return get().deviations.filter(dev => dev.sampleId === sampleId || dev.batchNumber === sampleId);
    },

    getCAPAsByDeviation: (deviationId) => {
        return get().capas.filter(capa => capa.deviationId === deviationId);
    }
}));
