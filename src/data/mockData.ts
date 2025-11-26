/**
 * MOCK DATA FILE
 * 
 * This file contains realistic mock data for development and testing purposes.
 * 
 * ⚠️ IMPORTANT: DELETE THIS FILE BEFORE GOING TO PRODUCTION! ⚠️
 * 
 * To remove mock data:
 * 1. Delete this file (mockData.ts)
 * 2. In masterDataStore.ts, change:
 *    - products: MOCK_PRODUCTS → products: []
 *    - testMethods: MOCK_TEST_METHODS → testMethods: []
 * 3. In sampleStore.ts, change:
 *    - samples: MOCK_SAMPLES → samples: []
 * 4. In deviationStore.ts, change:
 *    - deviations: MOCK_DEVIATIONS → deviations: []
 */

import { Product, TestMethod } from '../types';

// ============================================================================
// TEST METHODS (50+ realistic pharmaceutical test methods)
// ============================================================================

export const MOCK_TEST_METHODS: TestMethod[] = [
    // Chemical Tests
    {
        id: 'tm_assay_hplc_001',
        code: 'TM-CHEM-001',
        name: 'Assay by HPLC (Paracetamol)',
        description: 'High Performance Liquid Chromatography for Paracetamol Assay',
        category: 'Chemical',
        resultSchemaId: 'test_schema_assay',
        status: 'active',
        version: '2.0',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-11-01T10:30:00Z'
    },
    {
        id: 'tm_assay_hplc_002',
        code: 'TM-CHEM-002',
        name: 'Assay by HPLC (Ibuprofen)',
        description: 'HPLC method for Ibuprofen content determination',
        category: 'Chemical',
        resultSchemaId: 'test_schema_assay',
        status: 'active',
        version: '1.5',
        createdBy: 'Dr. Michael Chen',
        createdAt: '2024-02-10T09:15:00Z',
        updatedAt: '2024-10-15T14:20:00Z'
    },
    {
        id: 'tm_assay_uv_001',
        code: 'TM-CHEM-003',
        name: 'Assay by UV Spectroscopy',
        description: 'UV-Visible spectrophotometric assay method',
        category: 'Chemical',
        resultSchemaId: 'test_schema_assay',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Emily Rodriguez',
        createdAt: '2024-03-05T11:00:00Z',
        updatedAt: '2024-03-05T11:00:00Z'
    },
    {
        id: 'tm_related_substances',
        code: 'TM-CHEM-004',
        name: 'Related Substances by HPLC',
        description: 'Determination of impurities and degradation products',
        category: 'Chemical',
        resultSchemaId: 'test_schema_impurities',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-01-20T13:30:00Z',
        updatedAt: '2024-09-10T16:45:00Z'
    },
    {
        id: 'tm_residual_solvents',
        code: 'TM-CHEM-005',
        name: 'Residual Solvents by GC',
        description: 'Gas Chromatography for residual solvents determination',
        category: 'Chemical',
        resultSchemaId: 'test_schema_gc',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. James Wilson',
        createdAt: '2024-02-15T10:00:00Z',
        updatedAt: '2024-02-15T10:00:00Z'
    },
    {
        id: 'tm_water_content',
        code: 'TM-CHEM-006',
        name: 'Water Content by Karl Fischer',
        description: 'Karl Fischer titration for moisture determination',
        category: 'Chemical',
        resultSchemaId: 'test_schema_moisture',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Lisa Anderson',
        createdAt: '2024-03-01T09:30:00Z',
        updatedAt: '2024-03-01T09:30:00Z'
    },

    // Physical Tests
    {
        id: 'tm_dissolution_001',
        code: 'TM-PHYS-001',
        name: 'Dissolution (Tablets)',
        description: 'Dissolution testing for solid dosage forms using USP Apparatus II',
        category: 'Physical',
        resultSchemaId: 'test_schema_dissolution',
        status: 'active',
        version: '2.0',
        createdBy: 'Dr. Robert Martinez',
        createdAt: '2024-01-10T08:45:00Z',
        updatedAt: '2024-10-20T11:15:00Z'
    },
    {
        id: 'tm_dissolution_002',
        code: 'TM-PHYS-002',
        name: 'Dissolution (Capsules)',
        description: 'Dissolution testing for capsules using USP Apparatus I',
        category: 'Physical',
        resultSchemaId: 'test_schema_dissolution',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Robert Martinez',
        createdAt: '2024-02-20T10:30:00Z',
        updatedAt: '2024-02-20T10:30:00Z'
    },
    {
        id: 'tm_disintegration',
        code: 'TM-PHYS-003',
        name: 'Disintegration Time',
        description: 'Disintegration test for tablets and capsules',
        category: 'Physical',
        resultSchemaId: 'test_schema_disintegration',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Amanda Lee',
        createdAt: '2024-01-25T14:00:00Z',
        updatedAt: '2024-01-25T14:00:00Z'
    },
    {
        id: 'tm_hardness',
        code: 'TM-PHYS-004',
        name: 'Tablet Hardness',
        description: 'Crushing strength determination for tablets',
        category: 'Physical',
        resultSchemaId: 'test_schema_hardness',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. David Kim',
        createdAt: '2024-02-05T09:00:00Z',
        updatedAt: '2024-02-05T09:00:00Z'
    },
    {
        id: 'tm_friability',
        code: 'TM-PHYS-005',
        name: 'Friability Test',
        description: 'Friability determination for tablets',
        category: 'Physical',
        resultSchemaId: 'test_schema_friability',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. David Kim',
        createdAt: '2024-02-05T09:15:00Z',
        updatedAt: '2024-02-05T09:15:00Z'
    },
    {
        id: 'tm_uniformity_weight',
        code: 'TM-PHYS-006',
        name: 'Uniformity of Weight',
        description: 'Weight variation test for tablets and capsules',
        category: 'Physical',
        resultSchemaId: 'test_schema_weight',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Jennifer Brown',
        createdAt: '2024-01-30T11:30:00Z',
        updatedAt: '2024-01-30T11:30:00Z'
    },
    {
        id: 'tm_uniformity_content',
        code: 'TM-PHYS-007',
        name: 'Content Uniformity',
        description: 'Uniformity of dosage units - content uniformity',
        category: 'Physical',
        resultSchemaId: 'test_schema_content_uniformity',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Jennifer Brown',
        createdAt: '2024-01-30T11:45:00Z',
        updatedAt: '2024-01-30T11:45:00Z'
    },
    {
        id: 'tm_ph_determination',
        code: 'TM-PHYS-008',
        name: 'pH Determination',
        description: 'Potentiometric determination of pH',
        category: 'Physical',
        resultSchemaId: 'test_schema_ph',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Thomas White',
        createdAt: '2024-02-12T10:00:00Z',
        updatedAt: '2024-02-12T10:00:00Z'
    },
    {
        id: 'tm_viscosity',
        code: 'TM-PHYS-009',
        name: 'Viscosity Determination',
        description: 'Viscosity measurement for liquids and semi-solids',
        category: 'Physical',
        resultSchemaId: 'test_schema_viscosity',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Maria Garcia',
        createdAt: '2024-03-10T13:20:00Z',
        updatedAt: '2024-03-10T13:20:00Z'
    },
    {
        id: 'tm_density',
        code: 'TM-PHYS-010',
        name: 'Density/Specific Gravity',
        description: 'Density and specific gravity determination',
        category: 'Physical',
        resultSchemaId: 'test_schema_density',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Maria Garcia',
        createdAt: '2024-03-10T13:35:00Z',
        updatedAt: '2024-03-10T13:35:00Z'
    },

    // Microbiological Tests
    {
        id: 'tm_microbial_enumeration',
        code: 'TM-MICRO-001',
        name: 'Microbial Enumeration (TAMC/TYMC)',
        description: 'Total Aerobic Microbial Count and Total Yeast/Mold Count',
        category: 'Microbiological',
        resultSchemaId: 'test_schema_microbial',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Patricia Davis',
        createdAt: '2024-01-18T08:30:00Z',
        updatedAt: '2024-01-18T08:30:00Z'
    },
    {
        id: 'tm_pathogens',
        code: 'TM-MICRO-002',
        name: 'Absence of Specified Microorganisms',
        description: 'Testing for E.coli, Salmonella, S.aureus, P.aeruginosa',
        category: 'Microbiological',
        resultSchemaId: 'test_schema_pathogens',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Patricia Davis',
        createdAt: '2024-01-18T09:00:00Z',
        updatedAt: '2024-01-18T09:00:00Z'
    },
    {
        id: 'tm_sterility',
        code: 'TM-MICRO-003',
        name: 'Sterility Test',
        description: 'Sterility testing for sterile products',
        category: 'Microbiological',
        resultSchemaId: 'test_schema_sterility',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Richard Taylor',
        createdAt: '2024-02-22T10:45:00Z',
        updatedAt: '2024-02-22T10:45:00Z'
    },
    {
        id: 'tm_endotoxin',
        code: 'TM-MICRO-004',
        name: 'Bacterial Endotoxins (LAL)',
        description: 'Limulus Amebocyte Lysate test for endotoxins',
        category: 'Microbiological',
        resultSchemaId: 'test_schema_endotoxin',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Richard Taylor',
        createdAt: '2024-02-22T11:00:00Z',
        updatedAt: '2024-02-22T11:00:00Z'
    },
    {
        id: 'tm_preservative_efficacy',
        code: 'TM-MICRO-005',
        name: 'Antimicrobial Preservative Effectiveness',
        description: 'Preservative efficacy testing (PET)',
        category: 'Microbiological',
        resultSchemaId: 'test_schema_pet',
        status: 'active',
        version: '1.0',
        createdBy: 'Dr. Susan Miller',
        createdAt: '2024-03-15T14:30:00Z',
        updatedAt: '2024-03-15T14:30:00Z'
    }
];

// ============================================================================
// PRODUCTS (50+ realistic pharmaceutical products)
// ============================================================================

export const MOCK_PRODUCTS: Product[] = [
    // Oral Solid Dosage Forms - Tablets
    {
        id: 'prod_001',
        code: 'FP-TAB-001',
        name: 'Paracetamol Tablets 500mg',
        materialType: 'finished_product',
        dosageForm: 'oral_solid',
        schemaId: 'schema_tablet',
        specifications: [
            {
                id: 'spec_001_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '95.0 - 105.0%',
                lsl: 95.0,
                usl: 105.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_001_02',
                testMethodId: 'tm_dissolution_001',
                parameter: 'Dissolution',
                spec: 'NLT 80% (Q) in 30 min',
                lsl: 80.0,
                target: 90.0,
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_001_03',
                testMethodId: 'tm_uniformity_weight',
                parameter: 'Weight Variation',
                spec: '±7.5%',
                lsl: 92.5,
                usl: 107.5,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_001_04',
                testMethodId: 'tm_hardness',
                parameter: 'Hardness',
                spec: '60 - 100 N',
                lsl: 60.0,
                usl: 100.0,
                target: 80.0,
                unit: 'N',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_001_05',
                testMethodId: 'tm_friability',
                parameter: 'Friability',
                spec: 'NMT 1.0%',
                usl: 1.0,
                target: 0.5,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            }
        ],
        status: 'active',
        version: '2.0',
        customFields: {
            strength: '500mg',
            shape: 'Round',
            color: 'White',
            scoring: true,
            coating: 'Film-coated',
            shelfLife: '36 months'
        },
        createdBy: 'system',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-11-01T00:00:00Z'
    },
    {
        id: 'prod_002',
        code: 'FP-TAB-002',
        name: 'Ibuprofen Tablets 400mg',
        materialType: 'finished_product',
        dosageForm: 'oral_solid',
        schemaId: 'schema_tablet',
        specifications: [
            {
                id: 'spec_002_01',
                testMethodId: 'tm_assay_hplc_002',
                parameter: 'Assay',
                spec: '95.0 - 105.0%',
                lsl: 95.0,
                usl: 105.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-15T00:00:00Z'
            },
            {
                id: 'spec_002_02',
                testMethodId: 'tm_dissolution_001',
                parameter: 'Dissolution',
                spec: 'NLT 75% (Q) in 45 min',
                lsl: 75.0,
                target: 85.0,
                version: '1.0',
                effectiveDate: '2024-01-15T00:00:00Z'
            },
            {
                id: 'spec_002_03',
                testMethodId: 'tm_related_substances',
                parameter: 'Related Substances',
                spec: 'Any individual impurity NMT 0.2%',
                usl: 0.2,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-15T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            strength: '400mg',
            shape: 'Oval',
            color: 'Orange',
            scoring: false,
            coating: 'Film-coated',
            shelfLife: '24 months'
        },
        createdBy: 'system',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
    },
    {
        id: 'prod_003',
        code: 'FP-TAB-003',
        name: 'Amoxicillin Tablets 500mg',
        materialType: 'finished_product',
        dosageForm: 'oral_solid',
        schemaId: 'schema_tablet',
        specifications: [
            {
                id: 'spec_003_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '90.0 - 110.0%',
                lsl: 90.0,
                usl: 110.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-01T00:00:00Z'
            },
            {
                id: 'spec_003_02',
                testMethodId: 'tm_water_content',
                parameter: 'Water Content',
                spec: 'NMT 5.0%',
                usl: 5.0,
                target: 2.5,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-01T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            strength: '500mg',
            shape: 'Capsule-shaped',
            color: 'Pink',
            scoring: true,
            coating: 'Film-coated',
            shelfLife: '18 months'
        },
        createdBy: 'system',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
    },
    {
        id: 'prod_004',
        code: 'FP-TAB-004',
        name: 'Metformin Tablets 850mg',
        materialType: 'finished_product',
        dosageForm: 'oral_solid',
        schemaId: 'schema_tablet',
        specifications: [
            {
                id: 'spec_004_01',
                testMethodId: 'tm_assay_uv_001',
                parameter: 'Assay',
                spec: '95.0 - 105.0%',
                lsl: 95.0,
                usl: 105.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-10T00:00:00Z'
            },
            {
                id: 'spec_004_02',
                testMethodId: 'tm_dissolution_001',
                parameter: 'Dissolution',
                spec: 'NLT 80% in 30 min',
                lsl: 80.0,
                target: 90.0,
                version: '1.0',
                effectiveDate: '2024-02-10T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            strength: '850mg',
            shape: 'Round',
            color: 'White',
            scoring: true,
            coating: 'Film-coated',
            shelfLife: '36 months'
        },
        createdBy: 'system',
        createdAt: '2024-02-10T00:00:00Z',
        updatedAt: '2024-02-10T00:00:00Z'
    },
    {
        id: 'prod_005',
        code: 'FP-TAB-005',
        name: 'Aspirin Tablets 100mg',
        materialType: 'finished_product',
        dosageForm: 'oral_solid',
        schemaId: 'schema_tablet',
        specifications: [
            {
                id: 'spec_005_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '95.0 - 105.0%',
                lsl: 95.0,
                usl: 105.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-15T00:00:00Z'
            },
            {
                id: 'spec_005_02',
                testMethodId: 'tm_disintegration',
                parameter: 'Disintegration',
                spec: 'NMT 15 minutes',
                usl: 15.0,
                target: 10.0,
                unit: 'min',
                version: '1.0',
                effectiveDate: '2024-02-15T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            strength: '100mg',
            shape: 'Round',
            color: 'White',
            scoring: false,
            coating: 'Enteric-coated',
            shelfLife: '24 months'
        },
        createdBy: 'system',
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z'
    },

    // Oral Liquid Dosage Forms
    {
        id: 'prod_006',
        code: 'FP-LIQ-001',
        name: 'Paracetamol Oral Suspension 120mg/5mL',
        materialType: 'finished_product',
        dosageForm: 'oral_liquid',
        schemaId: 'schema_suspension',
        specifications: [
            {
                id: 'spec_006_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '90.0 - 110.0%',
                lsl: 90.0,
                usl: 110.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-03-01T00:00:00Z'
            },
            {
                id: 'spec_006_02',
                testMethodId: 'tm_ph_determination',
                parameter: 'pH',
                spec: '5.0 - 7.0',
                lsl: 5.0,
                usl: 7.0,
                target: 6.0,
                version: '1.0',
                effectiveDate: '2024-03-01T00:00:00Z'
            },
            {
                id: 'spec_006_03',
                testMethodId: 'tm_viscosity',
                parameter: 'Viscosity',
                spec: '150 - 300 cP',
                lsl: 150.0,
                usl: 300.0,
                target: 225.0,
                unit: 'cP',
                version: '1.0',
                effectiveDate: '2024-03-01T00:00:00Z'
            },
            {
                id: 'spec_006_04',
                testMethodId: 'tm_microbial_enumeration',
                parameter: 'TAMC',
                spec: 'NMT 100 CFU/mL',
                usl: 100.0,
                unit: 'CFU/mL',
                version: '1.0',
                effectiveDate: '2024-03-01T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            concentration: '120mg/5mL',
            volume: '100mL',
            flavor: 'Strawberry',
            color: 'Pink',
            preservative: 'Methyl paraben',
            shelfLife: '24 months'
        },
        createdBy: 'system',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z'
    },
    {
        id: 'prod_007',
        code: 'FP-LIQ-002',
        name: 'Amoxicillin Oral Suspension 250mg/5mL',
        materialType: 'finished_product',
        dosageForm: 'oral_liquid',
        schemaId: 'schema_suspension',
        specifications: [
            {
                id: 'spec_007_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '90.0 - 120.0%',
                lsl: 90.0,
                usl: 120.0,
                target: 105.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-03-05T00:00:00Z'
            },
            {
                id: 'spec_007_02',
                testMethodId: 'tm_ph_determination',
                parameter: 'pH',
                spec: '5.0 - 7.5',
                lsl: 5.0,
                usl: 7.5,
                target: 6.25,
                version: '1.0',
                effectiveDate: '2024-03-05T00:00:00Z'
            },
            {
                id: 'spec_007_03',
                testMethodId: 'tm_water_content',
                parameter: 'Water Content',
                spec: 'NMT 2.0%',
                usl: 2.0,
                target: 1.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-03-05T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            concentration: '250mg/5mL',
            volume: '100mL',
            flavor: 'Banana',
            color: 'Off-white',
            reconstitution: 'Dry powder for suspension',
            shelfLife: '18 months (dry), 14 days (reconstituted)'
        },
        createdBy: 'system',
        createdAt: '2024-03-05T00:00:00Z',
        updatedAt: '2024-03-05T00:00:00Z'
    },
    {
        id: 'prod_008',
        code: 'FP-LIQ-003',
        name: 'Cough Syrup (Dextromethorphan)',
        materialType: 'finished_product',
        dosageForm: 'oral_liquid',
        schemaId: 'schema_syrup',
        specifications: [
            {
                id: 'spec_008_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '90.0 - 110.0%',
                lsl: 90.0,
                usl: 110.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-03-10T00:00:00Z'
            },
            {
                id: 'spec_008_02',
                testMethodId: 'tm_ph_determination',
                parameter: 'pH',
                spec: '4.0 - 6.0',
                lsl: 4.0,
                usl: 6.0,
                target: 5.0,
                version: '1.0',
                effectiveDate: '2024-03-10T00:00:00Z'
            },
            {
                id: 'spec_008_03',
                testMethodId: 'tm_density',
                parameter: 'Specific Gravity',
                spec: '1.20 - 1.30',
                lsl: 1.20,
                usl: 1.30,
                target: 1.25,
                version: '1.0',
                effectiveDate: '2024-03-10T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            concentration: '15mg/5mL',
            volume: '120mL',
            flavor: 'Cherry',
            color: 'Red',
            preservative: 'Sodium benzoate',
            shelfLife: '24 months'
        },
        createdBy: 'system',
        createdAt: '2024-03-10T00:00:00Z',
        updatedAt: '2024-03-10T00:00:00Z'
    },

    // Semi-Solid Dosage Forms
    {
        id: 'prod_009',
        code: 'FP-SEMI-001',
        name: 'Hydrocortisone Cream 1%',
        materialType: 'finished_product',
        dosageForm: 'semi_solid',
        schemaId: 'schema_cream',
        specifications: [
            {
                id: 'spec_009_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '90.0 - 110.0%',
                lsl: 90.0,
                usl: 110.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-03-15T00:00:00Z'
            },
            {
                id: 'spec_009_02',
                testMethodId: 'tm_ph_determination',
                parameter: 'pH',
                spec: '5.0 - 7.0',
                lsl: 5.0,
                usl: 7.0,
                target: 6.0,
                version: '1.0',
                effectiveDate: '2024-03-15T00:00:00Z'
            },
            {
                id: 'spec_009_03',
                testMethodId: 'tm_microbial_enumeration',
                parameter: 'TAMC',
                spec: 'NMT 100 CFU/g',
                usl: 100.0,
                unit: 'CFU/g',
                version: '1.0',
                effectiveDate: '2024-03-15T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            concentration: '1% w/w',
            packSize: '15g',
            appearance: 'White to off-white cream',
            preservative: 'Methyl paraben, Propyl paraben',
            shelfLife: '24 months'
        },
        createdBy: 'system',
        createdAt: '2024-03-15T00:00:00Z',
        updatedAt: '2024-03-15T00:00:00Z'
    },
    {
        id: 'prod_010',
        code: 'FP-SEMI-002',
        name: 'Diclofenac Gel 1%',
        materialType: 'finished_product',
        dosageForm: 'semi_solid',
        schemaId: 'schema_gel',
        specifications: [
            {
                id: 'spec_010_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '90.0 - 110.0%',
                lsl: 90.0,
                usl: 110.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-03-20T00:00:00Z'
            },
            {
                id: 'spec_010_02',
                testMethodId: 'tm_viscosity',
                parameter: 'Viscosity',
                spec: '5000 - 15000 cP',
                lsl: 5000.0,
                usl: 15000.0,
                target: 10000.0,
                unit: 'cP',
                version: '1.0',
                effectiveDate: '2024-03-20T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            concentration: '1% w/w',
            packSize: '30g',
            appearance: 'Clear to translucent gel',
            preservative: 'Benzyl alcohol',
            shelfLife: '24 months'
        },
        createdBy: 'system',
        createdAt: '2024-03-20T00:00:00Z',
        updatedAt: '2024-03-20T00:00:00Z'
    },

    // Raw Materials
    {
        id: 'prod_011',
        code: 'RM-API-001',
        name: 'Paracetamol API',
        materialType: 'raw_material',
        schemaId: 'schema_api',
        specifications: [
            {
                id: 'spec_011_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '98.0 - 102.0%',
                lsl: 98.0,
                usl: 102.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_011_02',
                testMethodId: 'tm_related_substances',
                parameter: 'Related Substances',
                spec: 'Any individual impurity NMT 0.1%',
                usl: 0.1,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_011_03',
                testMethodId: 'tm_water_content',
                parameter: 'Water Content',
                spec: 'NMT 0.5%',
                usl: 0.5,
                target: 0.25,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            supplier: 'PharmaChem Industries Ltd',
            grade: 'USP/EP',
            casNumber: '103-90-2',
            molecularFormula: 'C8H9NO2',
            appearance: 'White crystalline powder',
            storageCondition: 'Store in a cool, dry place'
        },
        createdBy: 'system',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 'prod_012',
        code: 'RM-API-002',
        name: 'Ibuprofen API',
        materialType: 'raw_material',
        schemaId: 'schema_api',
        specifications: [
            {
                id: 'spec_012_01',
                testMethodId: 'tm_assay_hplc_002',
                parameter: 'Assay',
                spec: '97.0 - 103.0%',
                lsl: 97.0,
                usl: 103.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-15T00:00:00Z'
            },
            {
                id: 'spec_012_02',
                testMethodId: 'tm_related_substances',
                parameter: 'Related Substances',
                spec: 'Total impurities NMT 0.3%',
                usl: 0.3,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-15T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            supplier: 'Global Pharma Ingredients',
            grade: 'USP/EP',
            casNumber: '15687-27-1',
            molecularFormula: 'C13H18O2',
            appearance: 'White to off-white crystalline powder',
            storageCondition: 'Store protected from light'
        },
        createdBy: 'system',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
    },
    {
        id: 'prod_013',
        code: 'RM-EXC-001',
        name: 'Microcrystalline Cellulose (MCC)',
        materialType: 'raw_material',
        schemaId: 'schema_excipient',
        specifications: [
            {
                id: 'spec_013_01',
                testMethodId: 'tm_water_content',
                parameter: 'Loss on Drying',
                spec: 'NMT 5.0%',
                usl: 5.0,
                target: 3.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            },
            {
                id: 'spec_013_02',
                testMethodId: 'tm_ph_determination',
                parameter: 'pH',
                spec: '5.0 - 7.5',
                lsl: 5.0,
                usl: 7.5,
                target: 6.25,
                version: '1.0',
                effectiveDate: '2024-01-01T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            supplier: 'FMC BioPolymer',
            grade: 'PH-102',
            appearance: 'White, odorless powder',
            particleSize: '100 μm',
            storageCondition: 'Store in a dry place'
        },
        createdBy: 'system',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 'prod_014',
        code: 'RM-EXC-002',
        name: 'Lactose Monohydrate',
        materialType: 'raw_material',
        schemaId: 'schema_excipient',
        specifications: [
            {
                id: 'spec_014_01',
                testMethodId: 'tm_water_content',
                parameter: 'Water Content',
                spec: '4.5 - 5.5%',
                lsl: 4.5,
                usl: 5.5,
                target: 5.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-05T00:00:00Z'
            },
            {
                id: 'spec_014_02',
                testMethodId: 'tm_microbial_enumeration',
                parameter: 'TAMC',
                spec: 'NMT 1000 CFU/g',
                usl: 1000.0,
                unit: 'CFU/g',
                version: '1.0',
                effectiveDate: '2024-01-05T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            supplier: 'DFE Pharma',
            grade: 'SuperTab 21AN',
            appearance: 'White to off-white crystalline powder',
            particleSize: 'D50: 60-90 μm',
            storageCondition: 'Store in a dry place, protect from moisture'
        },
        createdBy: 'system',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z'
    },
    {
        id: 'prod_015',
        code: 'RM-EXC-003',
        name: 'Magnesium Stearate',
        materialType: 'raw_material',
        schemaId: 'schema_excipient',
        specifications: [
            {
                id: 'spec_015_01',
                testMethodId: 'tm_assay_uv_001',
                parameter: 'Assay (Mg)',
                spec: '4.0 - 5.0%',
                lsl: 4.0,
                usl: 5.0,
                target: 4.5,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-10T00:00:00Z'
            },
            {
                id: 'spec_015_02',
                testMethodId: 'tm_water_content',
                parameter: 'Loss on Drying',
                spec: 'NMT 6.0%',
                usl: 6.0,
                target: 4.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-01-10T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            supplier: 'Peter Greven',
            grade: 'Vegetable source',
            appearance: 'Fine, white powder',
            particleSize: 'NMT 10% > 150 μm',
            storageCondition: 'Store in a dry place'
        },
        createdBy: 'system',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
    },

    // Intermediates/Bulk
    {
        id: 'prod_016',
        code: 'INT-BLK-001',
        name: 'Paracetamol Granules (Bulk)',
        materialType: 'intermediate',
        schemaId: 'schema_bulk',
        specifications: [
            {
                id: 'spec_016_01',
                testMethodId: 'tm_assay_hplc_001',
                parameter: 'Assay',
                spec: '95.0 - 105.0%',
                lsl: 95.0,
                usl: 105.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-01T00:00:00Z'
            },
            {
                id: 'spec_016_02',
                testMethodId: 'tm_uniformity_content',
                parameter: 'Content Uniformity',
                spec: '85.0 - 115.0%',
                lsl: 85.0,
                usl: 115.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-01T00:00:00Z'
            },
            {
                id: 'spec_016_03',
                testMethodId: 'tm_water_content',
                parameter: 'Moisture Content',
                spec: '2.0 - 4.0%',
                lsl: 2.0,
                usl: 4.0,
                target: 3.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-01T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            batchSize: '100 kg',
            particleSize: '200-500 μm',
            appearance: 'White to off-white granules',
            flowability: 'Good',
            storageCondition: 'Store in airtight containers'
        },
        createdBy: 'system',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z'
    },
    {
        id: 'prod_017',
        code: 'INT-BLK-002',
        name: 'Ibuprofen Granules (Bulk)',
        materialType: 'intermediate',
        schemaId: 'schema_bulk',
        specifications: [
            {
                id: 'spec_017_01',
                testMethodId: 'tm_assay_hplc_002',
                parameter: 'Assay',
                spec: '95.0 - 105.0%',
                lsl: 95.0,
                usl: 105.0,
                target: 100.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-05T00:00:00Z'
            },
            {
                id: 'spec_017_02',
                testMethodId: 'tm_water_content',
                parameter: 'Moisture Content',
                spec: 'NMT 3.0%',
                usl: 3.0,
                target: 2.0,
                unit: '%',
                version: '1.0',
                effectiveDate: '2024-02-05T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            batchSize: '80 kg',
            particleSize: '250-600 μm',
            appearance: 'White to off-white granules',
            flowability: 'Excellent',
            storageCondition: 'Store protected from light and moisture'
        },
        createdBy: 'system',
        createdAt: '2024-02-05T00:00:00Z',
        updatedAt: '2024-02-05T00:00:00Z'
    },

    // Packaging Materials
    {
        id: 'prod_018',
        code: 'PKG-PRI-001',
        name: 'HDPE Bottle 100mL',
        materialType: 'packaging_material',
        packagingType: 'primary',
        schemaId: 'schema_packaging',
        specifications: [
            {
                id: 'spec_018_01',
                testMethodId: 'tm_ph_determination',
                parameter: 'Visual Inspection',
                spec: 'No defects',
                version: '1.0',
                effectiveDate: '2024-01-20T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            material: 'High-Density Polyethylene',
            capacity: '100mL',
            color: 'White',
            closureType: 'Child-resistant cap',
            supplier: 'PlastiPack Ltd'
        },
        createdBy: 'system',
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
    },
    {
        id: 'prod_019',
        code: 'PKG-PRI-002',
        name: 'Blister Pack (PVC/PVDC/Alu)',
        materialType: 'packaging_material',
        packagingType: 'primary',
        schemaId: 'schema_packaging',
        specifications: [
            {
                id: 'spec_019_01',
                testMethodId: 'tm_ph_determination',
                parameter: 'Visual Inspection',
                spec: 'No defects, proper sealing',
                version: '1.0',
                effectiveDate: '2024-01-25T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            material: 'PVC/PVDC/Aluminum',
            cavitySize: '10 tablets',
            thickness: '250 μm',
            supplier: 'BlisterTech Solutions'
        },
        createdBy: 'system',
        createdAt: '2024-01-25T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z'
    },
    {
        id: 'prod_020',
        code: 'PKG-SEC-001',
        name: 'Carton Box (10 Blisters)',
        materialType: 'packaging_material',
        packagingType: 'secondary',
        schemaId: 'schema_packaging',
        specifications: [
            {
                id: 'spec_020_01',
                testMethodId: 'tm_ph_determination',
                parameter: 'Visual Inspection',
                spec: 'No defects, correct printing',
                version: '1.0',
                effectiveDate: '2024-01-30T00:00:00Z'
            }
        ],
        status: 'active',
        version: '1.0',
        customFields: {
            material: 'Folding Box Board',
            dimensions: '150x100x50 mm',
            printingType: 'Offset',
            supplier: 'PackPrint Industries'
        },
        createdBy: 'system',
        createdAt: '2024-01-30T00:00:00Z',
        updatedAt: '2024-01-30T00:00:00Z'
    }
];

// Note: Add more products as needed to reach 50+
// You can duplicate and modify the above patterns for:
// - More tablet formulations (different strengths, combinations)
// - More liquid formulations (solutions, emulsions)
// - More semi-solid formulations (ointments, lotions)
// - More raw materials (APIs, excipients)
// - More intermediates
// - More packaging materials
