import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface PlannedDeviation {
    id: string;
    deviationNumber: string;
    dateRaised: string;
    raisedBy: string;
    department: string;
    type: 'Planned' | 'Unplanned';
    description: string;
    justification: string;
    impactAssessment: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    proposedAction: string;
    approver: string | null;
    approvalStatus: 'Pending' | 'Approved' | 'Rejected';
    startDate: string;
    endDate: string;
    evidenceUploads: string | null;
    closureComment: string | null;
    closedBy: string | null;
    closedDate: string | null;
    capaRequired: boolean;
    linkedCapaId: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PlannedDeviationState {
    deviations: PlannedDeviation[];
    isLoading: boolean;
    error: string | null;

    fetchDeviations: () => Promise<void>;
    addDeviation: (deviation: Omit<PlannedDeviation, 'id' | 'deviationNumber' | 'createdAt' | 'updatedAt' | 'approvalStatus'>) => Promise<string | null>;
    updateDeviation: (id: string, updates: Partial<PlannedDeviation>) => Promise<void>;
    deleteDeviation: (id: string) => Promise<void>;
    approveDeviation: (id: string, approverId: string, status: 'Approved' | 'Rejected') => Promise<void>;
    closeDeviation: (id: string, userId: string, comment: string) => Promise<void>;
}

export const usePlannedDeviationStore = create<PlannedDeviationState>((set, get) => ({
    deviations: [],
    isLoading: false,
    error: null,

    fetchDeviations: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('planned_deviations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedDeviations: PlannedDeviation[] = (data || []).map((d: any) => ({
                id: d.id,
                deviationNumber: d.deviation_number,
                dateRaised: d.date_raised,
                raisedBy: d.raised_by,
                department: d.department,
                type: d.type,
                description: d.description,
                justification: d.justification,
                impactAssessment: d.impact_assessment,
                riskLevel: d.risk_level,
                proposedAction: d.proposed_action,
                approver: d.approver,
                approvalStatus: d.approval_status,
                startDate: d.start_date,
                endDate: d.end_date,
                evidenceUploads: d.evidence_uploads,
                closureComment: d.closure_comment,
                closedBy: d.closed_by,
                closedDate: d.closed_date,
                capaRequired: d.capa_required,
                linkedCapaId: d.linked_capa_id,
                createdAt: d.created_at,
                updatedAt: d.updated_at
            }));

            set({ deviations: mappedDeviations, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching planned deviations:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    addDeviation: async (deviation) => {
        set({ isLoading: true, error: null });
        try {
            // Generate Deviation Number (Simple client-side generation for now, ideally DB function)
            const year = new Date().getFullYear();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const deviationNumber = `BCI-PD-${year}-${random}`;

            const { data, error } = await supabase
                .from('planned_deviations')
                .insert([{
                    deviation_number: deviationNumber,
                    date_raised: deviation.dateRaised,
                    raised_by: deviation.raisedBy,
                    department: deviation.department,
                    type: deviation.type,
                    description: deviation.description,
                    justification: deviation.justification,
                    impact_assessment: deviation.impactAssessment,
                    risk_level: deviation.riskLevel,
                    proposed_action: deviation.proposedAction,
                    start_date: deviation.startDate,
                    end_date: deviation.endDate,
                    capa_required: deviation.capaRequired,
                    approval_status: 'Pending'
                }])
                .select()
                .single();

            if (error) throw error;

            await get().fetchDeviations();
            return data.id;
        } catch (error: any) {
            console.error('Error adding planned deviation:', error);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    updateDeviation: async (id, updates) => {
        try {
            const updateData: any = { updated_at: new Date().toISOString() };
            if (updates.description) updateData.description = updates.description;
            if (updates.justification) updateData.justification = updates.justification;
            if (updates.riskLevel) updateData.risk_level = updates.riskLevel;
            // ... map other fields as needed

            const { error } = await supabase
                .from('planned_deviations')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error updating planned deviation:', error);
            set({ error: error.message });
        }
    },

    deleteDeviation: async (id) => {
        try {
            const { error } = await supabase
                .from('planned_deviations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set(state => ({
                deviations: state.deviations.filter(d => d.id !== id)
            }));
        } catch (error: any) {
            console.error('Error deleting planned deviation:', error);
            set({ error: error.message });
        }
    },

    approveDeviation: async (id, approverId, status) => {
        try {
            const { error } = await supabase
                .from('planned_deviations')
                .update({
                    approval_status: status,
                    approver: approverId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error approving deviation:', error);
            set({ error: error.message });
        }
    },

    closeDeviation: async (id, userId, comment) => {
        try {
            const { error } = await supabase
                .from('planned_deviations')
                .update({
                    closure_comment: comment,
                    closed_by: userId,
                    closed_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            await get().fetchDeviations();
        } catch (error: any) {
            console.error('Error closing deviation:', error);
            set({ error: error.message });
        }
    }
}));
