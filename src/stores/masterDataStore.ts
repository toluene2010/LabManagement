import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, TestMethod } from '../types';
import { MOCK_PRODUCTS, MOCK_TEST_METHODS } from '../data/mockData';

interface MasterDataState {
    products: Product[];
    testMethods: TestMethod[];

    // Product Actions
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProduct: (id: string) => Product | undefined;

    // Test Method Actions
    addTestMethod: (method: Omit<TestMethod, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateTestMethod: (id: string, updates: Partial<TestMethod>) => void;
    deleteTestMethod: (id: string) => void;
    getTestMethod: (id: string) => TestMethod | undefined;
    createMethodVersion: (id: string) => void;
}

export const useMasterDataStore = create<MasterDataState>()(
    persist(
        (set, get) => ({
            // Use mock data from centralized file
            // TODO: Before production, change to empty arrays: products: [], testMethods: []
            products: MOCK_PRODUCTS,
            testMethods: MOCK_TEST_METHODS,

            addProduct: (product) => {
                const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newProduct: Product = {
                    ...product,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    products: [...state.products, newProduct]
                }));

                return id;
            },

            updateProduct: (id, updates) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === id
                            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                            : p
                    )
                }));
            },

            deleteProduct: (id) => {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id)
                }));
            },

            getProduct: (id) => {
                return get().products.find((p) => p.id === id);
            },

            addTestMethod: (method) => {
                const id = `tm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const newMethod: TestMethod = {
                    ...method,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set((state) => ({
                    testMethods: [...state.testMethods, newMethod]
                }));

                return id;
            },

            updateTestMethod: (id, updates) => {
                set((state) => ({
                    testMethods: state.testMethods.map((tm) =>
                        tm.id === id
                            ? { ...tm, ...updates, updatedAt: new Date().toISOString() }
                            : tm
                    )
                }));
            },

            deleteTestMethod: (id) => {
                set((state) => ({
                    testMethods: state.testMethods.filter((tm) => tm.id !== id)
                }));
            },

            getTestMethod: (id) => {
                return get().testMethods.find((tm) => tm.id === id);
            },

            createMethodVersion: (id) => {
                const state = get();
                const oldMethod = state.testMethods.find(m => m.id === id);
                if (!oldMethod) return;

                // Deactivate old method
                const updatedMethods = state.testMethods.map(m =>
                    m.id === id ? { ...m, status: 'inactive' as const } : m
                );

                // Create new version
                const newVersionNum = (parseFloat(oldMethod.version) + 1.0).toFixed(1);
                const newMethod: TestMethod = {
                    ...oldMethod,
                    id: `tm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    version: newVersionNum,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set({
                    testMethods: [...updatedMethods, newMethod]
                });
            }
        }),
        {
            name: 'pharma-qc-master-data'
        }
    )
);
