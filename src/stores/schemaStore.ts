import { create } from 'zustand';
import { EntitySchema } from '../types';
import { supabase } from '../lib/supabase';

interface SchemaState {
    schemas: Record<string, EntitySchema>;
    isLoading: boolean;
    error: string | null;
    fetchSchemas: () => Promise<void>;
    addSchema: (schema: Omit<EntitySchema, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
    updateSchema: (id: string, schema: Partial<EntitySchema>) => Promise<void>;
    deleteSchema: (id: string) => Promise<void>;
    getSchema: (id: string) => EntitySchema | undefined;
    getAllSchemas: () => EntitySchema[];
    getSchemasByType: (type: 'entity' | 'test_result') => EntitySchema[];
}

export const useSchemaStore = create<SchemaState>((set, get) => ({
    schemas: {},
    isLoading: false,
    error: null,

    fetchSchemas: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('schemas')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: true });

            if (error) throw error;

            const schemasMap = (data || []).reduce((acc, schema) => {
                acc[schema.id] = {
                    id: schema.id,
                    name: schema.name,
                    description: schema.description || '',
                    version: schema.version || '1.0',
                    fields: schema.fields || [],
                    createdBy: schema.created_by || 'system',
                    createdAt: schema.created_at,
                    updatedAt: schema.updated_at
                };
                return acc;
            }, {} as Record<string, EntitySchema>);

            set({ schemas: schemasMap, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching schemas:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    addSchema: async (schema) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('schemas')
                .insert([{
                    name: schema.name,
                    description: schema.description,
                    version: schema.version,
                    schema_type: schema.name.toLowerCase().includes('test') ? 'test_result' : 'entity',
                    fields: schema.fields,
                    is_system: false,
                    status: 'active',
                    created_by: schema.createdBy
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newSchema: EntitySchema = {
                    id: data.id,
                    name: data.name,
                    description: data.description || '',
                    version: data.version || '1.0',
                    fields: data.fields || [],
                    createdBy: data.created_by || 'system',
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                };

                set((state) => ({
                    schemas: {
                        ...state.schemas,
                        [data.id]: newSchema
                    },
                    isLoading: false
                }));

                return data.id;
            }

            set({ isLoading: false });
            return null;
        } catch (error: any) {
            console.error('Error adding schema:', error);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    updateSchema: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('schemas')
                .update({
                    name: updates.name,
                    description: updates.description,
                    version: updates.version,
                    fields: updates.fields,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                schemas: {
                    ...state.schemas,
                    [id]: {
                        ...state.schemas[id],
                        ...updates,
                        updatedAt: new Date().toISOString()
                    }
                },
                isLoading: false
            }));
        } catch (error: any) {
            console.error('Error updating schema:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    deleteSchema: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // Check if schema is a system schema
            const schema = get().schemas[id];
            if (!schema) {
                throw new Error('Schema not found');
            }

            // Soft delete by setting status to 'archived'
            const { error } = await supabase
                .from('schemas')
                .update({ status: 'archived' })
                .eq('id', id)
                .eq('is_system', false); // Only allow deletion of non-system schemas

            if (error) throw error;

            set((state) => {
                const { [id]: _, ...rest } = state.schemas;
                return { schemas: rest, isLoading: false };
            });
        } catch (error: any) {
            console.error('Error deleting schema:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    getSchema: (id) => {
        return get().schemas[id];
    },

    getAllSchemas: () => {
        return Object.values(get().schemas);
    },

    getSchemasByType: (type: 'entity' | 'test_result') => {
        return Object.values(get().schemas).filter(schema => {
            // Determine type based on schema name or ID
            const isTestSchema = schema.id.startsWith('test_schema_') ||
                schema.name.toLowerCase().includes('test');
            return type === 'test_result' ? isTestSchema : !isTestSchema;
        });
    }
}));
