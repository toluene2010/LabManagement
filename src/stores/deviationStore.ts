import { create } from 'zustand';
import { Deviation, CAPA, DeviationStatus, CAPAStatus } from '../types/deviation';

interface DeviationStore {
    deviations: Deviation[];
    capas: CAPA[];

    // Deviation actions
    addDeviation: (deviation: Omit<Deviation, 'id' | 'deviationNumber' | 'reportedDate' | 'capaIds'>) => void;
    updateDeviation: (id: string, updates: Partial<Deviation>) => void;
    updateDeviationStatus: (id: string, status: DeviationStatus, userId: string) => void;
    linkCAPAToDeviation: (deviationId: string, capaId: string) => void;

    // CAPA actions
    addCAPA: (capa: Omit<CAPA, 'id' | 'capaNumber' | 'createdDate'>) => void;
    updateCAPA: (id: string, updates: Partial<CAPA>) => void;
    updateCAPAStatus: (id: string, status: CAPAStatus, userId: string) => void;

    // Queries
    getDeviationById: (id: string) => Deviation | undefined;
    getCAPAById: (id: string) => CAPA | undefined;
    getDeviationsBySample: (sampleId: string) => Deviation[];
    getCAPAsByDeviation: (deviationId: string) => CAPA[];
}

// Mock initial data
const INITIAL_DEVIATIONS: Deviation[] = [
    {
        id: 'dev_001',
        deviationNumber: 'DEV-2024-001',
        title: 'Out of Specification - Assay Result',
        description: 'Batch B-2024-001 assay result (94.2%) is below specification limit (95.0%)',
        severity: 'major',
        status: 'under_investigation',
        sampleId: 'sample_1',
        productId: 'prod_para_500',
        batchNumber: 'B-2024-001',
        investigation: 'Initial investigation shows potential calibration issue with HPLC instrument.',
        reportedBy: 'analyst',
        reportedDate: new Date('2024-11-20').toISOString(),
        capaIds: ['capa_001']
    },
    {
        id: 'dev_002',
        deviationNumber: 'DEV-2024-002',
        title: 'Temperature Excursion in Storage',
        description: 'Storage area temperature exceeded 25°C for 2 hours',
        severity: 'minor',
        status: 'closed',
        impactAssessment: 'No impact on product quality. Stability data supports short-term excursion.',
        reportedBy: 'qa_manager',
        reportedDate: new Date('2024-11-15').toISOString(),
        closedBy: 'qa_manager',
        closedDate: new Date('2024-11-18').toISOString(),
        capaIds: []
    }
];

const INITIAL_CAPAS: CAPA[] = [
    {
        id: 'capa_001',
        capaNumber: 'CAPA-2024-001',
        type: 'corrective',
        title: 'HPLC Instrument Recalibration',
        description: 'Recalibrate HPLC instrument and verify with reference standards',
        status: 'in_progress',
        deviationId: 'dev_001',
        actionPlan: '1. Schedule instrument calibration\n2. Perform calibration with certified standards\n3. Verify with known samples\n4. Document results',
        responsiblePerson: 'John Smith',
        targetDate: new Date('2024-11-30').toISOString(),
        createdBy: 'qa_manager',
        createdDate: new Date('2024-11-21').toISOString()
    }
];

export const useDeviationStore = create<DeviationStore>((set, get) => ({
    deviations: INITIAL_DEVIATIONS,
    capas: INITIAL_CAPAS,

    addDeviation: (deviationData) => {
        const newDeviation: Deviation = {
            ...deviationData,
            id: `dev_${Date.now()}`,
            deviationNumber: `DEV-${new Date().getFullYear()}-${String(get().deviations.length + 1).padStart(3, '0')}`,
            reportedDate: new Date().toISOString(),
            capaIds: []
        };

        set((state) => ({
            deviations: [...state.deviations, newDeviation]
        }));
    },

    updateDeviation: (id, updates) => {
        set((state) => ({
            deviations: state.deviations.map(dev =>
                dev.id === id ? { ...dev, ...updates } : dev
            )
        }));
    },

    updateDeviationStatus: (id, status, userId) => {
        const updates: Partial<Deviation> = { status };

        if (status === 'closed') {
            updates.closedBy = userId;
            updates.closedDate = new Date().toISOString();
        } else if (status === 'approved') {
            updates.approvedBy = userId;
            updates.approvalDate = new Date().toISOString();
        }

        set((state) => ({
            deviations: state.deviations.map(dev =>
                dev.id === id ? { ...dev, ...updates } : dev
            )
        }));
    },

    linkCAPAToDeviation: (deviationId, capaId) => {
        set((state) => ({
            deviations: state.deviations.map(dev =>
                dev.id === deviationId
                    ? { ...dev, capaIds: [...dev.capaIds, capaId] }
                    : dev
            )
        }));
    },

    addCAPA: (capaData) => {
        const newCAPA: CAPA = {
            ...capaData,
            id: `capa_${Date.now()}`,
            capaNumber: `CAPA-${new Date().getFullYear()}-${String(get().capas.length + 1).padStart(3, '0')}`,
            createdDate: new Date().toISOString()
        };

        set((state) => ({
            capas: [...state.capas, newCAPA]
        }));

        // Link to deviation if specified
        if (newCAPA.deviationId) {
            get().linkCAPAToDeviation(newCAPA.deviationId, newCAPA.id);
        }
    },

    updateCAPA: (id, updates) => {
        set((state) => ({
            capas: state.capas.map(capa =>
                capa.id === id ? { ...capa, ...updates } : capa
            )
        }));
    },

    updateCAPAStatus: (id, status, userId) => {
        const updates: Partial<CAPA> = { status };

        if (status === 'closed') {
            updates.closedBy = userId;
            updates.closedDate = new Date().toISOString();
        } else if (status === 'verified') {
            updates.verifiedBy = userId;
            updates.verificationDate = new Date().toISOString();
        } else if (status === 'in_progress') {
            updates.implementedBy = userId;
            updates.implementationDate = new Date().toISOString();
        }

        set((state) => ({
            capas: state.capas.map(capa =>
                capa.id === id ? { ...capa, ...updates } : capa
            )
        }));
    },

    getDeviationById: (id) => {
        return get().deviations.find(dev => dev.id === id);
    },

    getCAPAById: (id) => {
        return get().capas.find(capa => capa.id === id);
    },

    getDeviationsBySample: (sampleId) => {
        return get().deviations.filter(dev => dev.sampleId === sampleId);
    },

    getCAPAsByDeviation: (deviationId) => {
        return get().capas.filter(capa => capa.deviationId === deviationId);
    }
}));
