// Stability Study Types

export interface StabilityStudy {
    id: string;
    studyNumber: string;
    productId: string;
    productName: string;
    batchNumber: string;
    studyType: 'long_term' | 'intermediate' | 'accelerated' | 'stress';
    storageCondition: StorageCondition;
    startDate: string;
    endDate?: string;
    status: 'active' | 'completed' | 'discontinued';
    protocol: string;
    timePoints: TimePoint[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface StorageCondition {
    temperature: string; // e.g., "25°C ± 2°C"
    humidity?: string;   // e.g., "60% RH ± 5%"
    light?: 'protected' | 'exposed';
    orientation?: string; // e.g., "Upright", "Inverted"
}

export interface TimePoint {
    id: string;
    studyId: string;
    timePoint: string; // e.g., "0M", "3M", "6M", "12M"
    scheduledDate: string;
    actualDate?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'missed';
    testResults: StabilityTestResult[];
    observations?: string;
    performedBy?: string;
}

export interface StabilityTestResult {
    id: string;
    timePointId: string;
    testMethodId: string;
    testMethodName: string;
    parameter: string;
    result: string | number;
    unit?: string;
    specification: string;
    lsl?: number;
    usl?: number;
    status: 'pass' | 'fail' | 'ooc' | 'oos'; // OOC = Out of Control, OOS = Out of Specification
    remarks?: string;
    testedBy: string;
    testedDate: string;
}

export interface StabilityProtocol {
    id: string;
    protocolNumber: string;
    title: string;
    studyType: 'long_term' | 'intermediate' | 'accelerated' | 'stress';
    storageConditions: StorageCondition[];
    timePoints: string[]; // e.g., ["0M", "1M", "3M", "6M", "9M", "12M", "18M", "24M", "36M"]
    testMethods: string[]; // Test method IDs
    samplingPlan: string;
    acceptanceCriteria: string;
    status: 'draft' | 'approved' | 'active' | 'archived';
    approvedBy?: string;
    approvedDate?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// ICH Guideline Storage Conditions
export const ICH_STORAGE_CONDITIONS = {
    LONG_TERM_GENERAL: {
        temperature: '25°C ± 2°C',
        humidity: '60% RH ± 5%',
        duration: '12 months minimum'
    },
    LONG_TERM_REFRIGERATED: {
        temperature: '5°C ± 3°C',
        duration: '12 months minimum'
    },
    LONG_TERM_FROZEN: {
        temperature: '-20°C ± 5°C',
        duration: '12 months minimum'
    },
    INTERMEDIATE: {
        temperature: '30°C ± 2°C',
        humidity: '65% RH ± 5%',
        duration: '6 months'
    },
    ACCELERATED: {
        temperature: '40°C ± 2°C',
        humidity: '75% RH ± 5%',
        duration: '6 months'
    }
};

// Standard Time Points
export const STANDARD_TIME_POINTS = {
    LONG_TERM: ['0M', '3M', '6M', '9M', '12M', '18M', '24M', '36M'],
    INTERMEDIATE: ['0M', '6M'],
    ACCELERATED: ['0M', '1M', '2M', '3M', '6M'],
    STRESS: ['0H', '24H', '48H', '72H', '1W', '2W']
};
