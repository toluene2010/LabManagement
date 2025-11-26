// Laboratory Management Types

export type InstrumentStatus = 'active' | 'inactive' | 'maintenance' | 'calibration_due';
export type CalibrationType = 'calibration' | 'qualification' | 'validation';
export type ReagentStatus = 'in_stock' | 'low_stock' | 'expired' | 'ordered';
export type StorageLocation = 'refrigerator' | 'freezer' | 'room_temperature' | 'controlled_room';
export type SOPStatus = 'active' | 'under_review' | 'obsolete' | 'draft';

export interface Instrument {
    id: string;
    instrumentNumber: string;
    name: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    status: InstrumentStatus;
    location: string;
    calibrationType: CalibrationType;
    lastCalibrationDate: string;
    nextCalibrationDate: string;
    calibrationFrequency: number; // in days
    responsiblePerson: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Reagent {
    id: string;
    catalogNumber: string;
    name: string;
    manufacturer: string;
    lotNumber: string;
    quantity: number;
    unit: string;
    status: ReagentStatus;
    receivedDate: string;
    expirationDate: string;
    storageLocation: StorageLocation;
    storageDetails?: string; // e.g., "Refrigerator A, Shelf 2"
    minimumStock: number;
    reorderLevel: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Glassware {
    id: string;
    itemNumber: string;
    name: string;
    type: string; // e.g., "Volumetric Flask", "Pipette", "Beaker"
    size: string;
    quantity: number;
    status: 'available' | 'in_use' | 'broken' | 'cleaning';
    location: string;
    lastCalibrationDate?: string;
    nextCalibrationDate?: string;
    requiresCalibration: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RefrigeratorItem {
    id: string;
    refrigeratorId: string;
    refrigeratorName: string;
    shelfLocation: string;
    itemType: 'reagent' | 'sample' | 'reference_standard' | 'media' | 'other';
    itemName: string;
    lotNumber?: string;
    quantity: number;
    unit: string;
    storedDate: string;
    expirationDate?: string;
    temperature: string; // e.g., "2-8°C", "-20°C"
    responsiblePerson: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReferenceSample {
    id: string;
    referenceNumber: string;
    name: string;
    type: string; // e.g., "Working Standard", "Primary Standard"
    manufacturer: string;
    lotNumber: string;
    catalogNumber: string;
    quantity: number;
    unit: string;
    receivedDate: string;
    expirationDate: string;
    storageLocation: StorageLocation;
    storageDetails?: string;
    certificateNumber?: string;
    purity?: string;
    status: 'active' | 'expired' | 'depleted';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SOP {
    id: string;
    sopNumber: string;
    title: string;
    version: string;
    department: string;
    effectiveDate: string;
    reviewDate: string;
    nextReviewDate: string;
    reviewFrequency: number; // in months
    status: SOPStatus;
    author: string;
    approver: string;
    approvalDate?: string;
    description?: string;
    filePath?: string;
    relatedSOPs?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LabManagementStats {
    instruments: {
        total: number;
        active: number;
        inactive: number;
        calibrationDue: number;
    };
    reagents: {
        total: number;
        inStock: number;
        lowStock: number;
        expired: number;
    };
    glassware: {
        total: number;
        available: number;
        inUse: number;
    };
    referenceSamples: {
        total: number;
        active: number;
        expiringSoon: number;
        expired: number;
    };
    sops: {
        total: number;
        active: number;
        reviewDue: number;
    };
}
