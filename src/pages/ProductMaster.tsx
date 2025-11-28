import React, { useState } from 'react';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useSchemaStore } from '../stores/schemaStore';
import { Plus, Search, Filter, MoreVertical, FileText, Edit2, Download, ChevronDown, Trash2 } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';
import { Product } from '../types';
import { downloadProductImportTemplateCSV, downloadProductImportTemplateXLSX } from '../utils/excelTemplateGenerator';

export const ProductMaster: React.FC = () => {
    const { products, deleteProduct } = useMasterDataStore();
    const { schemas } = useSchemaStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showTemplateMenu, setShowTemplateMenu] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Filter products based on search
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            await deleteProduct(productId);
            setActiveDropdown(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Master</h1>
                    <p className="text-slate-500">Manage products, raw materials, and specifications</p>
                </div>
                <div className="flex gap-3">
                    {/* Template Download Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Template
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {showTemplateMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                <button
                                    onClick={() => {
                                        downloadProductImportTemplateCSV();
                                        setShowTemplateMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Download CSV
                                </button>
                                <button
                                    onClick={() => {
                                        downloadProductImportTemplateXLSX();
                                        setShowTemplateMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-b-lg flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Download XLSX
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Product
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn flex items-center gap-2 ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {showFilters && (
                <div className="card animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="label">Material Type</label>
                            <select className="input">
                                <option value="">All Types</option>
                                <option value="raw_material">Raw Material</option>
                                <option value="intermediate">Intermediate / Bulk</option>
                                <option value="finished_product">Finished Product</option>
                                <option value="packaging_material">Packaging Material</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Status</label>
                            <select className="input">
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button className="btn btn-secondary w-full">Reset Filters</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const schema = schemas[product.schemaId];

                    return (
                        <div key={product.id} className="card group hover:border-primary-300 transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                                        {product.code.split('-')[1]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-slate-500">{product.code}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDropdown(activeDropdown === product.id ? null : product.id);
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    {activeDropdown === product.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditProduct(product);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2 text-slate-700 dark:text-slate-300"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Product
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProduct(product.id, product.name);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-b-lg flex items-center gap-2 text-danger-600 dark:text-danger-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Product
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Dosage Form</span>
                                    <span className="font-medium text-slate-900 dark:text-white capitalize">
                                        {product.dosageForm?.replace('_', ' ') || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Specifications</span>
                                    <span className="badge badge-info">{product.specifications.length} Tests</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Status</span>
                                    <span className={`badge ${product.status === 'active' ? 'badge-success' : 'badge-warning'
                                        }`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Fields Preview */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Key Attributes</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {schema?.fields.slice(0, 4).map(field => (
                                        <div key={field.id} className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-xs">
                                            <span className="text-slate-400 block mb-0.5">{field.label}</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                                                {product.customFields[field.name]?.toString() || '-'} {field.unit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No products found</h3>
                    <p className="text-slate-500">Try adjusting your search or create a new product.</p>
                </div>
            )}

            {/* Product Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productToEdit={selectedProduct}
            />
        </div>
    );
};
