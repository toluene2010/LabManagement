import { create } from 'zustand';
import {
    Instrument,
    Reagent,
    Glassware,
    RefrigeratorItem,
    ReferenceSample,
    SOP,
    LabManagementStats
} from '../types/laboratory';

interface LaboratoryState {
    instruments: Instrument[];
    reagents: Reagent[];
    glassware: Glassware[];
    refrigeratorItems: RefrigeratorItem[];
    referenceSamples: ReferenceSample[];
    sops: SOP[];

    // Instrument actions
    addInstrument: (instrument: Omit<Instrument, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateInstrument: (id: string, updates: Partial<Instrument>) => void;
    deleteInstrument: (id: string) => void;

    // Reagent actions
    addReagent: (reagent: Omit<Reagent, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateReagent: (id: string, updates: Partial<Reagent>) => void;
    deleteReagent: (id: string) => void;

    // Glassware actions
    addGlassware: (glassware: Omit<Glassware, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateGlassware: (id: string, updates: Partial<Glassware>) => void;
    deleteGlassware: (id: string) => void;

    // Refrigerator item actions
    addRefrigeratorItem: (item: Omit<RefrigeratorItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateRefrigeratorItem: (id: string, updates: Partial<RefrigeratorItem>) => void;
    deleteRefrigeratorItem: (id: string) => void;

    // Reference sample actions
    addReferenceSample: (sample: Omit<ReferenceSample, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateReferenceSample: (id: string, updates: Partial<ReferenceSample>) => void;
    deleteReferenceSample: (id: string) => void;

    // SOP actions
    addSOP: (sop: Omit<SOP, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateSOP: (id: string, updates: Partial<SOP>) => void;
    deleteSOP: (id: string) => void;

    // Stats
    getStats: () => LabManagementStats;
}

export const useLaboratoryStore = create<LaboratoryState>((set, get) => ({
    instruments: [],
    reagents: [],
    glassware: [],
    refrigeratorItems: [],
    referenceSamples: [],
    sops: [],

    // Instrument actions
    addInstrument: (instrument) => {
        const newInstrument: Instrument = {
            ...instrument,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ instruments: [...state.instruments, newInstrument] }));
    },

    updateInstrument: (id, updates) => {
        set((state) => ({
            instruments: state.instruments.map((inst) =>
                inst.id === id ? { ...inst, ...updates, updatedAt: new Date().toISOString() } : inst
            ),
        }));
    },

    deleteInstrument: (id) => {
        set((state) => ({
            instruments: state.instruments.filter((inst) => inst.id !== id),
        }));
    },

    // Reagent actions
    addReagent: (reagent) => {
        const newReagent: Reagent = {
            ...reagent,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ reagents: [...state.reagents, newReagent] }));
    },

    updateReagent: (id, updates) => {
        set((state) => ({
            reagents: state.reagents.map((reagent) =>
                reagent.id === id ? { ...reagent, ...updates, updatedAt: new Date().toISOString() } : reagent
            ),
        }));
    },

    deleteReagent: (id) => {
        set((state) => ({
            reagents: state.reagents.filter((reagent) => reagent.id !== id),
        }));
    },

    // Glassware actions
    addGlassware: (glassware) => {
        const newGlassware: Glassware = {
            ...glassware,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ glassware: [...state.glassware, newGlassware] }));
    },

    updateGlassware: (id, updates) => {
        set((state) => ({
            glassware: state.glassware.map((item) =>
                item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
            ),
        }));
    },

    deleteGlassware: (id) => {
        set((state) => ({
            glassware: state.glassware.filter((item) => item.id !== id),
        }));
    },

    // Refrigerator item actions
    addRefrigeratorItem: (item) => {
        const newItem: RefrigeratorItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ refrigeratorItems: [...state.refrigeratorItems, newItem] }));
    },

    updateRefrigeratorItem: (id, updates) => {
        set((state) => ({
            refrigeratorItems: state.refrigeratorItems.map((item) =>
                item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
            ),
        }));
    },

    deleteRefrigeratorItem: (id) => {
        set((state) => ({
            refrigeratorItems: state.refrigeratorItems.filter((item) => item.id !== id),
        }));
    },

    // Reference sample actions
    addReferenceSample: (sample) => {
        const newSample: ReferenceSample = {
            ...sample,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ referenceSamples: [...state.referenceSamples, newSample] }));
    },

    updateReferenceSample: (id, updates) => {
        set((state) => ({
            referenceSamples: state.referenceSamples.map((sample) =>
                sample.id === id ? { ...sample, ...updates, updatedAt: new Date().toISOString() } : sample
            ),
        }));
    },

    deleteReferenceSample: (id) => {
        set((state) => ({
            referenceSamples: state.referenceSamples.filter((sample) => sample.id !== id),
        }));
    },

    // SOP actions
    addSOP: (sop) => {
        const newSOP: SOP = {
            ...sop,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ sops: [...state.sops, newSOP] }));
    },

    updateSOP: (id, updates) => {
        set((state) => ({
            sops: state.sops.map((sop) =>
                sop.id === id ? { ...sop, ...updates, updatedAt: new Date().toISOString() } : sop
            ),
        }));
    },

    deleteSOP: (id) => {
        set((state) => ({
            sops: state.sops.filter((sop) => sop.id !== id),
        }));
    },

    // Stats
    getStats: () => {
        const state = get();
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        return {
            instruments: {
                total: state.instruments.length,
                active: state.instruments.filter((i) => i.status === 'active').length,
                inactive: state.instruments.filter((i) => i.status === 'inactive').length,
                calibrationDue: state.instruments.filter(
                    (i) => new Date(i.nextCalibrationDate) <= thirtyDaysFromNow
                ).length,
            },
            reagents: {
                total: state.reagents.length,
                inStock: state.reagents.filter((r) => r.status === 'in_stock').length,
                lowStock: state.reagents.filter((r) => r.status === 'low_stock').length,
                expired: state.reagents.filter((r) => r.status === 'expired').length,
            },
            glassware: {
                total: state.glassware.length,
                available: state.glassware.filter((g) => g.status === 'available').length,
                inUse: state.glassware.filter((g) => g.status === 'in_use').length,
            },
            referenceSamples: {
                total: state.referenceSamples.length,
                active: state.referenceSamples.filter((s) => s.status === 'active').length,
                expiringSoon: state.referenceSamples.filter(
                    (s) => s.status === 'active' && new Date(s.expirationDate) <= thirtyDaysFromNow
                ).length,
                expired: state.referenceSamples.filter((s) => s.status === 'expired').length,
            },
            sops: {
                total: state.sops.length,
                active: state.sops.filter((s) => s.status === 'active').length,
                reviewDue: state.sops.filter(
                    (s) => s.status === 'active' && new Date(s.nextReviewDate) <= thirtyDaysFromNow
                ).length,
            },
        };
    },
}));
