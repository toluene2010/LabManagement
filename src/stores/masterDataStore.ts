import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useMasterDataStore = create<MasterDataState>()(
    persist(
        (set, get) => ({
            products: [],
            testMethods: [],
            isLoading: false,
            error: null,

            fetchMasterData: async () => {
                set({ isLoading: true, error: null });
                try {
                    // Fetch Products
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

                    // Transform data to match types if necessary (Supabase returns snake_case, types might be camelCase)
                    // Assuming types match or we map them. For now, direct assignment if schema matches.
                    // Note: You might need a mapper function if your DB schema uses snake_case and TS types use camelCase.
                    // Based on the SQL schema provided earlier, DB is snake_case.
                    // We need to map snake_case DB results to camelCase TS objects.

                    const mappedProducts: Product[] = (productsData || []).map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        genericName: p.generic_name,
                        code: p.code,
                        type: p.type,
                        category: p.category,
                        description: p.description,
                        specifications: (p.specifications || []).map((s: any) => ({
                            id: s.id,
                            testMethodId: s.test_method_id,
                            parameter: s.parameter,
                            spec: s.specification_text,
                            min: s.min_value,
                            max: s.max_value,
                            target: s.target_value,
                            unit: s.unit
                        })),
                        createdAt: p.created_at,
                        updatedAt: p.created_at // Supabase doesn't auto-update this in our schema yet, using created_at for now
                    }));

                    const mappedMethods: TestMethod[] = (methodsData || []).map((m: any) => ({
                        id: m.id,
                        name: m.name,
                        code: m.code,
                        version: m.version,
                        description: m.description,
                        category: m.category,
                        status: 'active', // Default or add to schema
                        createdAt: m.created_at,
                        updatedAt: m.created_at
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
                    // Insert Product
                    const { data, error } = await supabase
                        .from('products')
                        .insert({
                            name: product.name,
                            generic_name: product.genericName,
                            code: product.code,
                            type: product.type,
                            category: product.category,
                            description: product.description
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
                            min_value: spec.min,
                            max_value: spec.max,
                            target_value: spec.target,
                            unit: spec.unit
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
                    const { error } = await supabase
                        .from('products')
                        .update({
                            name: updates.name,
                            generic_name: updates.genericName,
                            code: updates.code,
                            type: updates.type,
                            category: updates.category,
                            description: updates.description
                        })
                        .eq('id', id);

                    if (error) throw error;

                    // Handle Specifications update (Delete all and re-insert is simplest for now, or smart update)
                    // For simplicity in this refactor:
                    if (updates.specifications) {
                        // Delete existing
                        await supabase.from('specifications').delete().eq('product_id', id);

                        // Insert new
                        const specsToInsert = updates.specifications.map(spec => ({
                            product_id: id,
                            test_method_id: spec.testMethodId,
                            parameter: spec.parameter,
                            specification_text: spec.spec,
                            min_value: spec.min,
                            max_value: spec.max,
                            target_value: spec.target,
                            unit: spec.unit
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
                    const { data, error } = await supabase
                        .from('test_methods')
                        .insert({
                            name: method.name,
                            code: method.code,
                            version: method.version,
                            description: method.description,
                            category: method.category
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
                    const { error } = await supabase
                        .from('test_methods')
                        .update({
                            name: updates.name,
                            code: updates.code,
                            version: updates.version,
                            description: updates.description,
                            category: updates.category
                        })
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
                    // 1. Deactivate old method (if we had a status field in DB, which we should)
                    // For now, assuming we just create a new one with incremented version

                    const newVersionNum = (parseFloat(oldMethod.version) + 1.0).toFixed(1);

                    const { error } = await supabase
                        .from('test_methods')
                        .insert({
                            name: oldMethod.name,
                            code: oldMethod.code,
                            version: newVersionNum,
                            description: oldMethod.description,
                            category: oldMethod.category
                        });

                    if (error) throw error;

                    await get().fetchMasterData();
                } catch (error: any) {
                    console.error('Error creating method version:', error);
                    set({ error: error.message });
                }
            }
        }),
        {
            name: 'pharma-qc-master-data',
            partialize: (state) => ({
                // We can choose to persist data or fetch on load. 
                // Persisting helps with offline/fast load, but we must sync.
                products: state.products,
                testMethods: state.testMethods
            })
        }
    )
);
