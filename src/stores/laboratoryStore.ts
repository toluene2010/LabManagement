import { create } from 'zustand';
import { supabase } from '../lib/supabase';
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
    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>;

    // Instrument actions
    addInstrument: (instrument: Omit<Instrument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateInstrument: (id: string, updates: Partial<Instrument>) => Promise<void>;
    deleteInstrument: (id: string) => Promise<void>;

    // Reagent actions
    addReagent: (reagent: Omit<Reagent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateReagent: (id: string, updates: Partial<Reagent>) => Promise<void>;
    deleteReagent: (id: string) => Promise<void>;

    // Glassware actions
    addGlassware: (glassware: Omit<Glassware, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateGlassware: (id: string, updates: Partial<Glassware>) => Promise<void>;
    deleteGlassware: (id: string) => Promise<void>;

    // Refrigerator item actions
    addRefrigeratorItem: (item: Omit<RefrigeratorItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateRefrigeratorItem: (id: string, updates: Partial<RefrigeratorItem>) => Promise<void>;
    deleteRefrigeratorItem: (id: string) => Promise<void>;

    // Reference sample actions
    addReferenceSample: (sample: Omit<ReferenceSample, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateReferenceSample: (id: string, updates: Partial<ReferenceSample>) => Promise<void>;
    deleteReferenceSample: (id: string) => Promise<void>;

    // SOP actions
    addSOP: (sop: Omit<SOP, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateSOP: (id: string, updates: Partial<SOP>) => Promise<void>;
    deleteSOP: (id: string) => Promise<void>;

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
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch Instruments
            const { data: instruments, error: instError } = await supabase.from('instruments').select('*');
            if (instError) throw instError;

            // Fetch Reagents
            const { data: reagents, error: reagError } = await supabase.from('reagents').select('*');
            if (reagError) throw reagError;

            // Fetch Glassware
            const { data: glassware, error: glassError } = await supabase.from('glassware').select('*');
            if (glassError) throw glassError;

            // Fetch Refrigerator Items
            const { data: fridgeItems, error: fridgeError } = await supabase.from('refrigerator_items').select('*');
            if (fridgeError) throw fridgeError;

            // Fetch Reference Samples
            const { data: refSamples, error: refError } = await supabase.from('reference_samples').select('*');
            if (refError) throw refError;

            // Fetch SOPs
            const { data: sops, error: sopsError } = await supabase.from('sops').select('*');
            if (sopsError) throw sopsError;

            // Map Data
            set({
                instruments: instruments.map((i: any) => ({
                    id: i.id,
                    instrumentNumber: i.instrument_number,
                    name: i.name,
                    manufacturer: i.manufacturer,
                    model: i.model,
                    serialNumber: i.serial_number,
                    status: i.status,
                    location: i.location,
                    calibrationType: i.calibration_type,
                    lastCalibrationDate: i.last_calibration_date,
                    nextCalibrationDate: i.next_calibration_date,
                    calibrationFrequency: i.calibration_frequency,
                    responsiblePerson: i.responsible_person,
                    notes: i.notes,
                    createdAt: i.created_at,
                    updatedAt: i.updated_at
                })),
                reagents: reagents.map((r: any) => ({
                    id: r.id,
                    catalogNumber: r.catalog_number,
                    name: r.name,
                    manufacturer: r.manufacturer,
                    lotNumber: r.lot_number,
                    quantity: r.quantity,
                    unit: r.unit,
                    status: r.status,
                    receivedDate: r.received_date,
                    expirationDate: r.expiration_date,
                    storageLocation: r.storage_location,
                    storageDetails: r.storage_details,
                    minimumStock: r.minimum_stock,
                    reorderLevel: r.reorder_level,
                    notes: r.notes,
                    createdAt: r.created_at,
                    updatedAt: r.updated_at
                })),
                glassware: glassware.map((g: any) => ({
                    id: g.id,
                    itemNumber: g.item_number,
                    name: g.name,
                    type: g.type,
                    size: g.size,
                    quantity: g.quantity,
                    status: g.status,
                    location: g.location,
                    lastCalibrationDate: g.last_calibration_date,
                    nextCalibrationDate: g.next_calibration_date,
                    requiresCalibration: g.requires_calibration,
                    notes: g.notes,
                    createdAt: g.created_at,
                    updatedAt: g.updated_at
                })),
                refrigeratorItems: fridgeItems.map((i: any) => ({
                    id: i.id,
                    refrigeratorId: i.refrigerator_id,
                    refrigeratorName: i.refrigerator_name,
                    shelfLocation: i.shelf_location,
                    itemType: i.item_type,
                    itemName: i.item_name,
                    lotNumber: i.lot_number,
                    quantity: i.quantity,
                    unit: i.unit,
                    storedDate: i.stored_date,
                    expirationDate: i.expiration_date,
                    temperature: i.temperature,
                    responsiblePerson: i.responsible_person,
                    notes: i.notes,
                    createdAt: i.created_at,
                    updatedAt: i.updated_at
                })),
                referenceSamples: refSamples.map((s: any) => ({
                    id: s.id,
                    referenceNumber: s.reference_number,
                    name: s.name,
                    type: s.type,
                    manufacturer: s.manufacturer,
                    lotNumber: s.lot_number,
                    catalogNumber: s.catalog_number,
                    quantity: s.quantity,
                    unit: s.unit,
                    receivedDate: s.received_date,
                    expirationDate: s.expiration_date,
                    storageLocation: s.storage_location,
                    storageDetails: s.storage_details,
                    certificateNumber: s.certificate_number,
                    purity: s.purity,
                    status: s.status,
                    notes: s.notes,
                    createdAt: s.created_at,
                    updatedAt: s.updated_at
                })),
                sops: sops.map((s: any) => ({
                    id: s.id,
                    sopNumber: s.sop_number,
                    title: s.title,
                    version: s.version,
                    department: s.department,
                    effectiveDate: s.effective_date,
                    reviewDate: s.review_date,
                    nextReviewDate: s.next_review_date,
                    reviewFrequency: s.review_frequency,
                    status: s.status,
                    author: s.author,
                    approver: s.approver,
                    approvalDate: s.approval_date,
                    description: s.description,
                    filePath: s.file_path,
                    relatedSOPs: s.related_sops,
                    notes: s.notes,
                    createdAt: s.created_at,
                    updatedAt: s.updated_at
                }))
            });
        } catch (error: any) {
            console.error('Error fetching laboratory data:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addInstrument: async (instrument) => {
        try {
            const { error } = await supabase.from('instruments').insert({
                instrument_number: instrument.instrumentNumber,
                name: instrument.name,
                manufacturer: instrument.manufacturer,
                model: instrument.model,
                serial_number: instrument.serialNumber,
                status: instrument.status,
                location: instrument.location,
                calibration_type: instrument.calibrationType,
                last_calibration_date: instrument.lastCalibrationDate,
                next_calibration_date: instrument.nextCalibrationDate,
                calibration_frequency: instrument.calibrationFrequency,
                responsible_person: instrument.responsiblePerson,
                notes: instrument.notes
            });
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateInstrument: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.nextCalibrationDate) dbUpdates.next_calibration_date = updates.nextCalibrationDate;
            // Add other fields as needed
            const { error } = await supabase.from('instruments').update(dbUpdates).eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteInstrument: async (id) => {
        try {
            const { error } = await supabase.from('instruments').delete().eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addReagent: async (reagent) => {
        try {
            const { error } = await supabase.from('reagents').insert({
                catalog_number: reagent.catalogNumber,
                name: reagent.name,
                manufacturer: reagent.manufacturer,
                lot_number: reagent.lotNumber,
                quantity: reagent.quantity,
                unit: reagent.unit,
                status: reagent.status,
                received_date: reagent.receivedDate,
                expiration_date: reagent.expirationDate,
                storage_location: reagent.storageLocation,
                storage_details: reagent.storageDetails,
                minimum_stock: reagent.minimumStock,
                reorder_level: reagent.reorderLevel,
                notes: reagent.notes
            });
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateReagent: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
            if (updates.status) dbUpdates.status = updates.status;
            const { error } = await supabase.from('reagents').update(dbUpdates).eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteReagent: async (id) => {
        try {
            const { error } = await supabase.from('reagents').delete().eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addGlassware: async (glassware) => {
        try {
            const { error } = await supabase.from('glassware').insert({
                item_number: glassware.itemNumber,
                name: glassware.name,
                type: glassware.type,
                size: glassware.size,
                quantity: glassware.quantity,
                status: glassware.status,
                location: glassware.location,
                last_calibration_date: glassware.lastCalibrationDate,
                next_calibration_date: glassware.nextCalibrationDate,
                requires_calibration: glassware.requiresCalibration,
                notes: glassware.notes
            });
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateGlassware: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
            if (updates.status) dbUpdates.status = updates.status;
            const { error } = await supabase.from('glassware').update(dbUpdates).eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteGlassware: async (id) => {
        try {
            const { error } = await supabase.from('glassware').delete().eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addRefrigeratorItem: async (item) => {
        try {
            const { error } = await supabase.from('refrigerator_items').insert({
                refrigerator_id: item.refrigeratorId,
                refrigerator_name: item.refrigeratorName,
                shelf_location: item.shelfLocation,
                item_type: item.itemType,
                item_name: item.itemName,
                lot_number: item.lotNumber,
                quantity: item.quantity,
                unit: item.unit,
                stored_date: item.storedDate,
                expiration_date: item.expirationDate,
                temperature: item.temperature,
                responsible_person: item.responsiblePerson,
                notes: item.notes
            });
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateRefrigeratorItem: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
            const { error } = await supabase.from('refrigerator_items').update(dbUpdates).eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteRefrigeratorItem: async (id) => {
        try {
            const { error } = await supabase.from('refrigerator_items').delete().eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addReferenceSample: async (sample) => {
        try {
            const { error } = await supabase.from('reference_samples').insert({
                reference_number: sample.referenceNumber,
                name: sample.name,
                type: sample.type,
                manufacturer: sample.manufacturer,
                lot_number: sample.lotNumber,
                catalog_number: sample.catalogNumber,
                quantity: sample.quantity,
                unit: sample.unit,
                received_date: sample.receivedDate,
                expiration_date: sample.expirationDate,
                storage_location: sample.storageLocation,
                storage_details: sample.storageDetails,
                certificate_number: sample.certificateNumber,
                purity: sample.purity,
                status: sample.status,
                notes: sample.notes
            });
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateReferenceSample: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
            if (updates.status) dbUpdates.status = updates.status;
            const { error } = await supabase.from('reference_samples').update(dbUpdates).eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteReferenceSample: async (id) => {
        try {
            const { error } = await supabase.from('reference_samples').delete().eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    addSOP: async (sop) => {
        try {
            const { error } = await supabase.from('sops').insert({
                sop_number: sop.sopNumber,
                title: sop.title,
                version: sop.version,
                department: sop.department,
                effective_date: sop.effectiveDate,
                review_date: sop.reviewDate,
                next_review_date: sop.nextReviewDate,
                review_frequency: sop.reviewFrequency,
                status: sop.status,
                author: sop.author,
                approver: sop.approver,
                approval_date: sop.approvalDate,
                description: sop.description,
                file_path: sop.filePath,
                related_sops: sop.relatedSOPs,
                notes: sop.notes
            });
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    updateSOP: async (id, updates) => {
        try {
            const dbUpdates: any = {};
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.nextReviewDate) dbUpdates.next_review_date = updates.nextReviewDate;
            const { error } = await supabase.from('sops').update(dbUpdates).eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteSOP: async (id) => {
        try {
            const { error } = await supabase.from('sops').delete().eq('id', id);
            if (error) throw error;
            await get().fetchData();
        } catch (error: any) {
            set({ error: error.message });
        }
    },

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
