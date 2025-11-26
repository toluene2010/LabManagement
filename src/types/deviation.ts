// Deviation and CAPA Management Types

export type DeviationStatus =
    | 'open'
    | 'under_investigation'
    | 'pending_approval'
    | 'approved'
    | 'closed';

export type DeviationSeverity = 'critical' | 'major' | 'minor';

export type CAPAStatus =
    | 'open'
    | 'in_progress'
    | 'pending_verification'
    | 'verified'
    | 'closed';

export type CAPAType = 'corrective' | 'preventive';

export interface Deviation {
    id: string;
    deviationNumber: string;
    title: string;
    description: string;
    severity: DeviationSeverity;
    status: DeviationStatus;

    // Related entities
    sampleId?: string;
    productId?: string;
    batchNumber?: string;

    // Investigation
    rootCause?: string;
    investigation?: string;
    immediateAction?: string;
    investigationBy?: string;
    investigationDate?: string;

    // Impact assessment
    impactAssessment?: string;
    affectedBatches?: string[];

    // Approval
    approvedBy?: string;
    approvalDate?: string;
    approvalComments?: string;

    // CAPA linkage
    capaIds: string[];

    // Audit
    reportedBy: string;
    reportedDate: string;
    closedBy?: string;
    closedDate?: string;

    // Attachments
    attachments?: {
        id: string;
        name: string;
        url: string;
        uploadedBy: string;
        uploadedAt: string;
    }[];
}

export interface CAPA {
    id: string;
    capaNumber: string;
    type: CAPAType;
    title: string;
    description: string;
    status: CAPAStatus;

    // Related deviation
    deviationId?: string;

    // Action plan
    actionPlan: string;
    responsiblePerson: string;
    targetDate: string;

    // Implementation
    implementationDetails?: string;
    implementedBy?: string;
    implementationDate?: string;

    // Verification
    verificationMethod?: string;
    verifiedBy?: string;
    verificationDate?: string;
    verificationComments?: string;

    // Effectiveness check
    effectivenessCheck?: {
        planned: boolean;
        checkDate?: string;
        checkedBy?: string;
        isEffective?: boolean;
        comments?: string;
    };

    // Audit
    createdBy: string;
    createdDate: string;
    closedBy?: string;
    closedDate?: string;
}

export interface DeviationReport {
    period: string;
    totalDeviations: number;
    byStatus: Record<DeviationStatus, number>;
    bySeverity: Record<DeviationSeverity, number>;
    averageClosureTime: number; // in days
    openDeviations: number;
    overdueDeviations: number;
}

export interface CAPAReport {
    period: string;
    totalCAPAs: number;
    byType: Record<CAPAType, number>;
    byStatus: Record<CAPAStatus, number>;
    averageCompletionTime: number; // in days
    openCAPAs: number;
    overdueCAPAs: number;
    effectivenessRate: number; // percentage
}
