// R&D Study Types for Research and Development Activities

export interface RDStudy {
    id: string;
    studyNumber: string;
    studyTitle: string;
    studyType: 'dissolution_comparability' | 'formulation_development' | 'process_optimization' | 'analytical_method' | 'other';
    productId: string;
    productName: string;
    status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    objective: string;
    startDate: string;
    endDate?: string;
    leadScientist: string;
    teamMembers: string[];
    parameters: StudyParameter[];
    dissolutionProfiles?: DissolutionProfile[];
    conclusions?: string;
    recommendations?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface StudyParameter {
    id: string;
    category: 'formulation' | 'process' | 'analytical' | 'environmental' | 'other';
    parameterName: string;
    description?: string;
    targetValue?: string;
    actualValue?: string;
    unit?: string;
    acceptanceCriteria?: string;
    status: 'pending' | 'in_progress' | 'completed';
    remarks?: string;
}

export interface DissolutionProfile {
    id: string;
    sampleId: string;
    sampleDescription: string;
    batchNumber?: string;
    testDate: string;
    medium: string; // e.g., "0.1N HCl", "pH 6.8 Phosphate Buffer"
    apparatus: string; // e.g., "USP Apparatus II (Paddle)"
    rpm: number;
    temperature: number; // in °C
    timePoints: DissolutionTimePoint[];
    testedBy: string;
    remarks?: string;
}

export interface DissolutionTimePoint {
    time: number; // in minutes
    percentDissolved: number;
    unit: string; // typically "%"
}

export interface ComparabilityAnalysis {
    id: string;
    rdStudyId: string;
    analysisTitle: string;
    referenceProfile: string; // ID of reference dissolution profile
    testProfiles: string[]; // IDs of test dissolution profiles
    comparisonMethod: 'f1_f2' | 'model_dependent' | 'model_independent' | 'statistical';
    f1Value?: number; // Difference factor
    f2Value?: number; // Similarity factor
    conclusion: 'similar' | 'not_similar' | 'inconclusive';
    analysisDate: string;
    analyzedBy: string;
    remarks?: string;
}

// F2 Similarity Factor Criteria
export const F2_CRITERIA = {
    SIMILAR_THRESHOLD: 50, // F2 >= 50 indicates similarity
    MIN_TIME_POINTS: 3,
    MAX_TIME_POINTS: 1, // Until 85% dissolution
    MIN_DISSOLUTION_PERCENT: 85
};

// Standard Dissolution Media
export const DISSOLUTION_MEDIA = [
    '0.1N HCl',
    'pH 1.2 HCl Buffer',
    'pH 4.5 Acetate Buffer',
    'pH 6.8 Phosphate Buffer',
    'pH 7.4 Phosphate Buffer',
    'Water',
    'Simulated Gastric Fluid (SGF)',
    'Simulated Intestinal Fluid (SIF)'
];

// USP Apparatus Types
export const USP_APPARATUS = [
    'USP Apparatus I (Basket)',
    'USP Apparatus II (Paddle)',
    'USP Apparatus III (Reciprocating Cylinder)',
    'USP Apparatus IV (Flow-through Cell)'
];
