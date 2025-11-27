import { create } from 'zustand';
import { Product, TestMethod } from '../types';
import { supabase } from '../lib/supabase';

interface MasterDataState {
    products: Product[];
    testMethods: TestMethod[];
    isLoading: boolean;
    error: string | null;

    // Data Fetching
    fetchMasterData: () => Promise<void>;

    // Product Actions
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;

    // Test Method Actions
    addTestMethod: (method: Omit<TestMethod, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
    updateTestMethod: (id: string, updates: Partial<TestMethod>) => Promise<void>;
    deleteTestMethod: (id: string) => Promise<void>;
    getTestMethod: (id: string) => TestMethod | undefined;
    createMethodVersion: (id: string) => Promise<void>;
}

export const useMasterDataStore = create<MasterDataState>((set, get) => ({
    products: [],
    testMethods: [],
    isLoading: false,
    error: null,

    fetchMasterData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch Products with specifications
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select(`
                    *,
                    specifications (*)
                `)
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;

            // Fetch Test Methods
            const { data: methodsData, error: methodsError } = await supabase
                .from('test_methods')
                .select('*')
                .order('created_at', { ascending: false });

            if (methodsError) throw methodsError;

            // Map database results to TypeScript types with defaults for missing fields
            const mappedProducts: Product[] = (productsData || []).map((p: any) => ({
                id: p.id,
                code: p.code,
                name: p.name,
                materialType: p.material_type || 'finished_product',
                dosageForm: p.dosage_form,
                packagingType: p.packaging_type,
                schemaId: p.schema_id || '',
                status: p.status || 'active',
                version: p.version || '1.0',
                customFields: p.custom_fields || {},
                createdBy: p.created_by || '',
                description: p.description,
                specifications: (p.specifications || []).map((s: any) => ({
                    id: s.id,
                    testMethodId: s.test_method_id,
                    parameter: s.parameter,
                    spec: s.specification_text,
                    lsl: s.lsl || s.min_value,
                    usl: s.usl || s.max_value,
                    target: s.target_value,
                    unit: s.unit,
                    version: s.version || '1.0',
                    effectiveDate: s.effective_date || s.created_at,
                    expiryDate: s.expiry_date,
                    frequency: s.frequency
                })),
                createdAt: p.created_at,
                updatedAt: p.updated_at || p.created_at
            }));

            const mappedMethods: TestMethod[] = (methodsData || []).map((m: any) => ({
                id: m.id,
                code: m.code,
                name: m.name,
                description: m.description || '',
                category: m.category || '',
                resultSchemaId: m.result_schema_id || '',
                acceptanceCriteria: m.acceptance_criteria,
                procedure: m.procedure,
                equipment: m.equipment || [],
                reagents: m.reagents || [],
                status: m.status || 'active',
                version: m.version || '1.0',
                createdBy: m.created_by || '',
                createdAt: m.created_at,
                updatedAt: m.updated_at || m.created_at
            }));

            set({ products: mappedProducts, testMethods: mappedMethods });

        } catch (error: any) {
            console.error('Error fetching master data:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addProduct: async (product) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Insert Product
            const { data, error } = await supabase
                .from('products')
                .insert({
                    code: product.code,
                    name: product.name,
                    material_type: product.materialType,
                    dosage_form: product.dosageForm,
                    packaging_type: product.packagingType,
                    schema_id: product.schemaId,
                    status: product.status,
                    version: product.version,
                    custom_fields: product.customFields,
                    description: product.description,
                    created_by: user?.id
                })
                .select()
                .single();

            if (error) throw error;

            // Insert Specifications
            if (product.specifications && product.specifications.length > 0) {
                const specsToInsert = product.specifications.map(spec => ({
                    product_id: data.id,
                    test_method_id: spec.testMethodId,
                    parameter: spec.parameter,
                    specification_text: spec.spec,
                    lsl: spec.lsl,
                    usl: spec.usl,
                    min_value: spec.lsl,  // Keep for compatibility
                    max_value: spec.usl,  // Keep for compatibility
                    target_value: spec.target,
                    unit: spec.unit,
                    version: spec.version,
                    effective_date: spec.effectiveDate,
                    expiry_date: spec.expiryDate,
                    frequency: spec.frequency
                }));

                const { error: specError } = await supabase
                    .from('specifications')
                    .insert(specsToInsert);

                if (specError) throw specError;
            }

            // Refresh data
            await get().fetchMasterData();
            return data.id;
        } catch (error: any) {
            console.error('Error adding product:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateProduct: async (id, updates) => {
        try {
            // Update Product fields
            const updateData: any = {};
            if (updates.code) updateData.code = updates.code;
            if (updates.name) updateData.name = updates.name;
            if (updates.materialType) updateData.material_type = updates.materialType;
            if (updates.dosageForm) updateData.dosage_form = updates.dosageForm;
            if (updates.packagingType) updateData.packaging_type = updates.packagingType;
            if (updates.schemaId) updateData.schema_id = updates.schemaId;
            if (updates.status) updateData.status = updates.status;
            if (updates.version) updateData.version = updates.version;
            if (updates.customFields) updateData.custom_fields = updates.customFields;
            if (updates.description !== undefined) updateData.description = updates.description;
            updateData.updated_at = new Date().toISOString();

            const { error } = await supabase
                .from('products')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            // Handle Specifications update
            if (updates.specifications) {
                // Delete existing
                await supabase.from('specifications').delete().eq('product_id', id);

                // Insert new
                const specsToInsert = updates.specifications.map(spec => ({
                    product_id: id,
                    test_method_id: spec.testMethodId,
                    parameter: spec.parameter,
                    specification_text: spec.spec,
                    lsl: spec.lsl,
                    usl: spec.usl,
                    min_value: spec.lsl,
                    max_value: spec.usl,
                    target_value: spec.target,
                    unit: spec.unit,
                    version: spec.version,
                    effective_date: spec.effectiveDate,
                    expiry_date: spec.expiryDate,
                    frequency: spec.frequency
                }));

                if (specsToInsert.length > 0) {
                    await supabase.from('specifications').insert(specsToInsert);
                }
            }

            await get().fetchMasterData();
        } catch (error: any) {
            console.error('Error updating product:', error);
            set({ error: error.message });
        }
    },

    deleteProduct: async (id) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            }));
        } catch (error: any) {
            console.error('Error deleting product:', error);
            set({ error: error.message });
        }
    },

    getProduct: (id) => {
        return get().products.find((p) => p.id === id);
    },

    addTestMethod: async (method) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('test_methods')
                .insert({
                    code: method.code,
                    name: method.name,
                    description: method.description,
                    category: method.category,
                    result_schema_id: method.resultSchemaId,
                    acceptance_criteria: method.acceptanceCriteria,
                    procedure: method.procedure,
                    equipment: method.equipment,
                    reagents: method.reagents,
                    status: method.status,
                    version: method.version,
                    created_by: user?.id
                })
                .select()
                .single();

            if (error) throw error;

            await get().fetchMasterData();
            return data.id;
        } catch (error: any) {
            console.error('Error adding test method:', error);
            set({ error: error.message });
            return null;
        }
    },

    updateTestMethod: async (id, updates) => {
        try {
            const updateData: any = { updated_at: new Date().toISOString() };
            if (updates.code) updateData.code = updates.code;
            if (updates.name) updateData.name = updates.name;
            if (updates.description !== undefined) updateData.description = updates.description;
            if (updates.category) updateData.category = updates.category;
            if (updates.resultSchemaId) updateData.result_schema_id = updates.resultSchemaId;
            if (updates.acceptanceCriteria) updateData.acceptance_criteria = updates.acceptanceCriteria;
            if (updates.procedure) updateData.procedure = updates.procedure;
            if (updates.equipment) updateData.equipment = updates.equipment;
            if (updates.reagents) updateData.reagents = updates.reagents;
            if (updates.status) updateData.status = updates.status;
            if (updates.version) updateData.version = updates.version;

            const { error } = await supabase
                .from('test_methods')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            await get().fetchMasterData();
        } catch (error: any) {
            console.error('Error updating test method:', error);
            set({ error: error.message });
        }
    },

    deleteTestMethod: async (id) => {
        try {
            const { error } = await supabase
                .from('test_methods')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                testMethods: state.testMethods.filter((tm) => tm.id !== id)
            }));
        } catch (error: any) {
            console.error('Error deleting test method:', error);
            set({ error: error.message });
        }
    },

    getTestMethod: (id) => {
        return get().testMethods.find((tm) => tm.id === id);
    },

    createMethodVersion: async (id) => {
        const state = get();
        const oldMethod = state.testMethods.find(m => m.id === id);
        if (!oldMethod) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const newVersionNum = (parseFloat(oldMethod.version) + 1.0).toFixed(1);

            const { error } = await supabase
                .from('test_methods')
                .insert({
                    code: oldMethod.code,
                    name: oldMethod.name,
                    description: oldMethod.description,
                    category: oldMethod.category,
                    result_schema_id: oldMethod.resultSchemaId,
                    acceptance_criteria: oldMethod.acceptanceCriteria,
                    procedure: oldMethod.procedure,
                    equipment: oldMethod.equipment,
                    reagents: oldMethod.reagents,
                    status: 'active',
                    version: newVersionNum,
                    created_by: user?.id
                });

            if (error) throw error;

            // Optionally mark old version as inactive
            await supabase
                .from('test_methods')
                .update({ status: 'inactive' })
                .eq('id', id);

            await get().fetchMasterData();
        } catch (error: any) {
            console.error('Error creating method version:', error);
            set({ error: error.message });
        }
    }
}));
