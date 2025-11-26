import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EntitySchema } from '../types';

interface SchemaState {
    schemas: Record<string, EntitySchema>;
    addSchema: (schema: Omit<EntitySchema, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateSchema: (id: string, schema: Partial<EntitySchema>) => void;
    deleteSchema: (id: string) => void;
    getSchema: (id: string) => EntitySchema | undefined;
    getAllSchemas: () => EntitySchema[];
}

// Default schemas for common pharmaceutical dosage forms
const DEFAULT_SCHEMAS: EntitySchema[] = [
    {
        id: 'schema_tablet',
        name: 'Oral Solid - Tablet',
        description: 'Schema for tablet products',
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
            { id: 'f1', name: 'strength', label: 'Strength', type: 'text', required: true, unit: 'mg' },
            { id: 'f2', name: 'shape', label: 'Shape', type: 'select', required: true, validation: { options: ['Round', 'Oval', 'Oblong', 'Capsule'] } },
            { id: 'f3', name: 'color', label: 'Color', type: 'text', required: true },
            { id: 'f4', name: 'coating', label: 'Coating Type', type: 'select', required: false, validation: { options: ['Film Coated', 'Sugar Coated', 'Enteric Coated', 'Uncoated'] } },
            { id: 'f5', name: 'scoring', label: 'Scoring', type: 'boolean', required: false },
        ]
    },
    {
        id: 'schema_syrup',
        name: 'Oral Liquid - Syrup',
        description: 'Schema for syrup products',
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
            { id: 'f1', name: 'concentration', label: 'Concentration', type: 'text', required: true, unit: 'mg/mL' },
            { id: 'f2', name: 'volume', label: 'Pack Volume', type: 'number', required: true, unit: 'mL', validation: { min: 0 } },
            { id: 'f3', name: 'flavor', label: 'Flavor', type: 'text', required: false },
            { id: 'f4', name: 'preservative', label: 'Preservative', type: 'text', required: false },
            { id: 'f5', name: 'viscosity', label: 'Viscosity Range', type: 'text', required: false, unit: 'cP' },
        ]
    },
    {
        id: 'schema_cream',
        name: 'Semi-Solid - Cream',
        description: 'Schema for cream products',
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
            { id: 'f1', name: 'concentration', label: 'Active Concentration', type: 'text', required: true, unit: '% w/w' },
            { id: 'f2', name: 'tubeSize', label: 'Tube Size', type: 'number', required: true, unit: 'g', validation: { min: 0 } },
            { id: 'f3', name: 'baseType', label: 'Base Type', type: 'select', required: true, validation: { options: ['Oil-in-Water', 'Water-in-Oil', 'Absorption', 'Emulsion'] } },
            { id: 'f4', name: 'appearance', label: 'Appearance', type: 'text', required: true },
            { id: 'f5', name: 'pH', label: 'pH Range', type: 'text', required: false },
        ]
    }
];

// Default test result schemas
const TEST_RESULT_SCHEMAS: EntitySchema[] = [
    {
        id: 'test_schema_assay',
        name: 'Assay Test',
        description: 'Schema for assay test results',
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
            { id: 'r1', name: 'result', label: 'Assay Result', type: 'number', required: true, unit: '%', validation: { min: 0, max: 120 }, helpText: 'Percentage of labeled claim' },
            { id: 'r2', name: 'average', label: 'Average (n=3)', type: 'number', required: true, unit: '%' },
            { id: 'r3', name: 'rsd', label: 'RSD', type: 'number', required: false, unit: '%', validation: { min: 0, max: 10 } },
        ]
    },
    {
        id: 'test_schema_dissolution',
        name: 'Dissolution Test',
        description: 'Schema for dissolution test results',
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
            { id: 'r1', name: 'time', label: 'Time Point', type: 'number', required: true, unit: 'min' },
            { id: 'r2', name: 'q_value', label: 'Q Value', type: 'number', required: true, unit: '%', validation: { min: 0, max: 100 } },
            { id: 'r3', name: 'medium', label: 'Dissolution Medium', type: 'text', required: true },
            { id: 'r4', name: 'apparatus', label: 'Apparatus', type: 'select', required: true, validation: { options: ['USP I (Basket)', 'USP II (Paddle)', 'USP III', 'USP IV'] } },
            { id: 'r5', name: 'rpm', label: 'RPM', type: 'number', required: true, validation: { min: 0 } },
        ]
    },
    {
        id: 'test_schema_ph',
        name: 'pH Test',
        description: 'Schema for pH test results',
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
            { id: 'r1', name: 'ph_value', label: 'pH Value', type: 'number', required: true, validation: { min: 0, max: 14 } },
            { id: 'r2', name: 'temperature', label: 'Temperature', type: 'number', required: true, unit: '°C' },
            { id: 'r3', name: 'instrument', label: 'pH Meter ID', type: 'text', required: true },
        ]
    }
];

export const useSchemaStore = create<SchemaState>()(
    persist(
        (set, get) => ({
            schemas: [...DEFAULT_SCHEMAS, ...TEST_RESULT_SCHEMAS].reduce((acc, schema) => {
                acc[schema.id] = schema;
                return acc;
            }, {} as Record<string, EntitySchema>),

            addSchema: (schema) => {
                const id = `schema_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newSchema: EntitySchema = {
                    ...schema,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    schemas: {
                        ...state.schemas,
                        [id]: newSchema
                    }
                }));

                return id;
            },

            updateSchema: (id, updates) => {
                set((state) => ({
                    schemas: {
                        ...state.schemas,
                        [id]: {
                            ...state.schemas[id],
                            ...updates,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }));
            },

            deleteSchema: (id) => {
                set((state) => {
                    const { [id]: _, ...rest } = state.schemas;
                    return { schemas: rest };
                });
            },

            getSchema: (id) => {
                return get().schemas[id];
            },

            getAllSchemas: () => {
                return Object.values(get().schemas);
            }
        }),
        {
            name: 'pharma-qc-schemas'
        }
    )
);
