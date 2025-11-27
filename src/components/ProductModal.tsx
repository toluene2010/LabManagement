import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useSchemaStore } from '../stores/schemaStore';
import { Product, DosageForm, MaterialType, PackagingType } from '../types';
import { Save, X, Settings2 } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product | null;
}

interface SpecConfig {
    methodId: string;
    spec: string;
    lsl: string;
    usl: string;
    target: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
    const { addProduct, updateProduct, testMethods } = useMasterDataStore();
    const { schemas } = useSchemaStore();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        materialType: 'finished_product' as MaterialType,
        dosageForm: 'oral_liquid' as DosageForm,
        packagingType: 'primary' as PackagingType,
        schemaId: '',
        description: '',
        selectedMethodIds: [] as string[],
        specDetails: {} as Record<string, SpecConfig>
    });

    useEffect(() => {
        if (productToEdit) {
            const specDetails: Record<string, SpecConfig> = {};
            productToEdit.specifications.forEach(spec => {
                specDetails[spec.testMethodId] = {
                    methodId: spec.testMethodId,
                    spec: spec.spec,
                    lsl: spec.lsl?.toString() || '',
                    usl: spec.usl?.toString() || '',
                    target: spec.target?.toString() || ''
                };
            });

            setFormData({
                name: productToEdit.name,
                code: productToEdit.code,
                materialType: productToEdit.materialType || 'finished_product',
                dosageForm: productToEdit.dosageForm || 'oral_liquid',
                packagingType: productToEdit.packagingType || 'primary',
                schemaId: productToEdit.schemaId || '',
                description: productToEdit.description || '',
                selectedMethodIds: productToEdit.specifications.map(s => s.testMethodId),
                specDetails
            });
        } else {
            setFormData({
                name: '',
                code: '',
                materialType: 'finished_product',
                dosageForm: 'oral_liquid',
                packagingType: 'primary',
                schemaId: '',
                description: '',
                selectedMethodIds: [],
                specDetails: {}
            });
        }
    }, [productToEdit, isOpen]);

    const handleMethodToggle = (methodId: string, checked: boolean) => {
        setFormData(prev => {
            const newSelected = checked
                ? [...prev.selectedMethodIds, methodId]
                : prev.selectedMethodIds.filter(id => id !== methodId);

            // Initialize spec details if checking
            const newSpecDetails = { ...prev.specDetails };
            if (checked && !newSpecDetails[methodId]) {
                newSpecDetails[methodId] = {
                    methodId,
                    spec: '',
                    lsl: '',
                    usl: '',
                    target: ''
                };
            }

            return {
                ...prev,
                selectedMethodIds: newSelected,
                specDetails: newSpecDetails
            };
        });
    };

    const handleSpecChange = (methodId: string, field: keyof SpecConfig, value: string) => {
        setFormData(prev => ({
            ...prev,
            specDetails: {
                ...prev.specDetails,
                [methodId]: {
                    ...prev.specDetails[methodId],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const specifications = formData.selectedMethodIds.map((methodId, index) => {
            const method = testMethods.find(m => m.id === methodId);
            const details = formData.specDetails[methodId];
            return {
                id: productToEdit?.specifications.find(s => s.testMethodId === methodId)?.id || `spec-${Date.now()}-${index}`,
                testMethodId: methodId,
                parameter: method?.name || '',
                spec: details.spec || 'N/A',
                lsl: details.lsl ? Number(details.lsl) : undefined,
                usl: details.usl ? Number(details.usl) : undefined,
                target: details.target ? Number(details.target) : undefined,
                unit: method?.category || '',
                version: '1.0',
                effectiveDate: new Date().toISOString(),
            };
        });

        const productData = {
            name: formData.name,
            code: formData.code,
            materialType: formData.materialType,
            // Only include dosageForm if it's a finished product or intermediate
            dosageForm: (formData.materialType === 'finished_product' || formData.materialType === 'intermediate')
                ? formData.dosageForm
                : undefined,
            // Only include packagingType if it's packaging material
            packagingType: formData.materialType === 'packaging_material'
                ? formData.packagingType
                : undefined,
            schemaId: formData.schemaId,
            description: formData.description,
            specifications
        };

        if (productToEdit) {
            updateProduct(productToEdit.id, productData);
        } else {
            const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
                ...productData,
                customFields: {},
                status: 'active',
                version: '1.0',
                createdBy: 'current-user'
            };
            addProduct(newProduct);
        }

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={productToEdit ? "Edit Product" : "Create New Product"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="e.g., Paracetamol Syrup"
                        />
                    </div>

                    {/* Product Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Product Code *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="input"
                            placeholder="e.g., PROD-001"
                        />
                    </div>

                    {/* Material Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Material Type *
                        </label>
                        <select
                            required
                            value={formData.materialType}
                            onChange={(e) => setFormData({ ...formData, materialType: e.target.value as MaterialType })}
                            className="input"
                        >
                            <option value="raw_material">Raw Material</option>
                            <option value="intermediate">Intermediate / Bulk</option>
                            <option value="finished_product">Finished Product</option>
                            <option value="packaging_material">Packaging Material</option>
                        </select>
                    </div>

                    {/* Dosage Form - Only for Finished/Intermediate */}
                    {(formData.materialType === 'finished_product' || formData.materialType === 'intermediate') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Dosage Form *
                            </label>
                            <select
                                required
                                value={formData.dosageForm}
                                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as DosageForm })}
                                className="input"
                            >
                                <option value="oral_liquid">Oral Liquid</option>
                                <option value="oral_solid">Oral Solid</option>
                                <option value="semi_solid">Semi-Solid</option>
                            </select>
                        </div>
                    )}

                    {/* Packaging Type - Only for Packaging Material */}
                    {formData.materialType === 'packaging_material' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Packaging Type *
                            </label>
                            <select
                                required
                                value={formData.packagingType}
                                onChange={(e) => setFormData({ ...formData, packagingType: e.target.value as PackagingType })}
                                className="input"
                            >
                                <option value="primary">Primary (Direct Contact)</option>
                                <option value="secondary">Secondary (Cartons/Labels)</option>
                                <option value="tertiary">Tertiary (Shippers)</option>
                                <option value="accessories">Accessories (Spoons/Cups)</option>
                            </select>
                        </div>
                    )}

                    {/* Schema */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Configuration Schema *
                        </label>
                        <select
                            required
                            value={formData.schemaId}
                            onChange={(e) => setFormData({ ...formData, schemaId: e.target.value })}
                            className="input"
                        >
                            <option value="">Select Schema</option>
                            {Object.entries(schemas).map(([id, schema]) => (
                                <option key={id} value={id}>
                                    {schema.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input"
                        rows={3}
                        placeholder="Product description..."
                    />
                </div>

                {/* Test Methods Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Select Test Methods
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        {testMethods.map((method) => (
                            <label key={method.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.selectedMethodIds.includes(method.id)}
                                    onChange={(e) => handleMethodToggle(method.id, e.target.checked)}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{method.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Specification Configuration */}
                {formData.selectedMethodIds.length > 0 && (
                    <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Settings2 className="w-4 h-4" />
                            Configure Specifications
                        </h3>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {formData.selectedMethodIds.map(methodId => {
                                const method = testMethods.find(m => m.id === methodId);
                                const details = formData.specDetails[methodId];
                                if (!method || !details) return null;

                                return (
                                    <div key={methodId} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <h4 className="font-medium text-sm mb-3 text-primary-600">{method.name}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="label text-xs">Specification Text (e.g. "90.0 - 110.0")</label>
                                                <input
                                                    type="text"
                                                    value={details.spec}
                                                    onChange={(e) => handleSpecChange(methodId, 'spec', e.target.value)}
                                                    className="input text-sm py-1"
                                                    placeholder="Enter specification text"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="label text-xs">Lower Limit (LSL)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={details.lsl}
                                                    onChange={(e) => handleSpecChange(methodId, 'lsl', e.target.value)}
                                                    className="input text-sm py-1"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div>
                                                <label className="label text-xs">Upper Limit (USL)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={details.usl}
                                                    onChange={(e) => handleSpecChange(methodId, 'usl', e.target.value)}
                                                    className="input text-sm py-1"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {productToEdit ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
