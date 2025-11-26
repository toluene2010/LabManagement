// Core Domain Types for Pharmaceutical QC System

export type DosageForm = 'oral_liquid' | 'oral_solid' | 'semi_solid' | 'custom';

export type MaterialType = 'raw_material' | 'intermediate' | 'finished_product' | 'packaging_material';

export type PackagingType = 'primary' | 'secondary' | 'tertiary' | 'accessories';

export type FieldType =
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'select'
    | 'multiselect'
    | 'boolean'
    | 'file';

export type SampleStatus =
    | 'received'
    | 'in_analysis'
    | 'under_review'
    | 'approved'
    | 'rejected'
    | 'on_hold';

export type UserRole = 'admin' | 'qa_manager' | 'analyst' | 'reviewer';

// Schema Definition for Dynamic Forms
export interface FieldSchema {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        options?: string[];
    };
    helpText?: string;
    unit?: string;
}

export interface EntitySchema {
    id: string;
    name: string;
    description: string;
    version: string;
    fields: FieldSchema[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// Product Master Types
export interface Product {
    id: string;
    code: string;
    name: string;
    materialType: MaterialType; // NEW: Raw Material, Intermediate, or Finished Product
    dosageForm?: DosageForm; // Optional for raw materials
    packagingType?: PackagingType; // NEW: For packaging materials
    schemaId: string; // Links to EntitySchema
    specifications: Specification[];
    status: 'active' | 'inactive' | 'obsolete';
    version: string;
    customFields: Record<string, any>;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
}

// Test Method Types
export interface TestMethod {
    id: string;
    code: string;
    name: string;
    description: string;
    category: string;
    resultSchemaId: string; // Links to EntitySchema for result fields
    acceptanceCriteria?: string;
    procedure?: string;
    equipment?: string[];
    reagents?: string[];
    status: 'active' | 'inactive' | 'under_revision';
    version: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// Specification Types
export interface Specification {
    id: string;
    testMethodId: string;
    parameter: string;
    spec: string; // e.g., "6.8 - 7.2"
    lsl?: number; // Lower Specification Limit for CPK
    usl?: number; // Upper Specification Limit for CPK
    target?: number; // Target value for CPK
    unit?: string;
    frequency?: string;
    version: string;
    effectiveDate: string;
    expiryDate?: string;
}

// Sample Management Types
export interface Sample {
    id: string;
    sampleNumber: string;
    productId: string;
    batchNumber: string;
    lotNumber?: string;
    manufacturingDate?: string;
    expiryDate?: string;
    receivedDate: string;
    receivedBy: string;
    quantity: number;
    unit: string;
    status: SampleStatus;
    testMethodIds: string[];
    results: TestResult[];
    customFields: Record<string, any>;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
}

// Test Results Types
export interface TestResult {
    id: string;
    sampleId: string;
    testMethodId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'reviewed' | 'approved';
    results: Record<string, any>; // Dynamic based on test method schema
    enteredBy?: string;
    enteredAt?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    approvedBy?: string;
    approvedAt?: string;
    comments?: string;
    attachments?: Attachment[];
    outOfSpec: boolean;
    deviations?: Deviation[];
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
}

export interface Deviation {
    id: string;
    parameter: string;
    expectedValue: string;
    actualValue: string;
    severity: 'minor' | 'major' | 'critical';
    investigationRequired: boolean;
    comments?: string;
}

// Audit Trail Types
export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    fieldName?: string;
    oldValue?: any;
    newValue?: any;
    reason?: string;
    ipAddress?: string;
    sessionId: string;
}

export type AuditAction =
    | 'create'
    | 'update'
    | 'delete'
    | 'approve'
    | 'reject'
    | 'review'
    | 'sign'
    | 'login'
    | 'logout';

// User & Authentication Types
export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department?: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
    permissions: Permission[];
}

export interface Permission {
    resource: string;
    actions: string[]; // ['create', 'read', 'update', 'delete', 'approve']
}

// Electronic Signature
export interface ElectronicSignature {
    id: string;
    userId: string;
    userName: string;
    timestamp: string;
    meaning: 'authored' | 'reviewed' | 'approved';
    reason: string;
    entityType: string;
    entityId: string;
    verified: boolean;
}

// Configuration Types
export interface SystemConfiguration {
    organizationName: string;
    regulatoryFramework: string[];
    defaultWorkflow: WorkflowDefinition;
    customWorkflows: Record<string, WorkflowDefinition>;
    numberingSchemes: Record<string, NumberingScheme>;
    customSettings: Record<string, any>;
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    stages: WorkflowStage[];
}

export interface WorkflowStage {
    id: string;
    name: string;
    status: SampleStatus;
    requiredRole: UserRole[];
    requiresSignature: boolean;
    allowedTransitions: string[];
}

export interface NumberingScheme {
    prefix: string;
    format: string; // e.g., "{prefix}-{year}-{sequence:5}"
    nextSequence: number;
}
