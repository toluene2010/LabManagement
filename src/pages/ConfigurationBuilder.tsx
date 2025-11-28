import React, { useState, useEffect } from 'react';
import { useSchemaStore } from '../stores/schemaStore';
import { Plus, Trash2, Save, GripVertical, Type, Settings2 } from 'lucide-react';
import { FieldType, EntitySchema, FieldSchema } from '../types';
import { useAuthStore } from '../stores/authStore';

export const ConfigurationBuilder: React.FC = () => {
    const { schemas, fetchSchemas, addSchema, updateSchema, deleteSchema, isLoading } = useSchemaStore();
    const { user } = useAuthStore();
    const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state for new/editing schema
    const [formData, setFormData] = useState<Partial<EntitySchema>>({
        name: '',
        description: '',
        fields: []
    });

    // Fetch schemas on mount
    useEffect(() => {
        fetchSchemas();
    }, [fetchSchemas]);

    const handleCreateNew = () => {
        setFormData({
            name: '',
            description: '',
            fields: []
        });
        setSelectedSchemaId(null);
        setIsCreating(true);
    };

    const handleSelectSchema = (schema: EntitySchema) => {
        setFormData(schema);
        setSelectedSchemaId(schema.id);
        setIsCreating(false);
    };

    const handleAddField = () => {
        const newField: FieldSchema = {
            id: `field_${Date.now()}`,
            name: '',
            label: '',
            type: 'text',
            required: false
        };
        setFormData(prev => ({
            ...prev,
            fields: [...(prev.fields || []), newField]
        }));
    };

    const handleRemoveField = (fieldId: string) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields?.filter(f => f.id !== fieldId)
        }));
    };

    const handleFieldChange = (fieldId: string, updates: Partial<FieldSchema>) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields?.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        }));
    };

    const handleSave = async () => {
        if (!formData.name) return;

        if (selectedSchemaId && !isCreating) {
            await updateSchema(selectedSchemaId, formData);
        } else {
            const schemaToAdd = {
                ...formData,
                version: formData.version || '1.0',
                createdBy: user?.id || 'system'
            } as Omit<EntitySchema, 'id' | 'createdAt' | 'updatedAt'>;

            const newId = await addSchema(schemaToAdd);
            if (newId) {
                setSelectedSchemaId(newId);
                setIsCreating(false);
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedSchemaId) return;

        if (confirm('Are you sure you want to delete this schema? This action cannot be undone.')) {
            await deleteSchema(selectedSchemaId);
            setSelectedSchemaId(null);
            setFormData({
                name: '',
                description: '',
                fields: []
            });
        }
    };


    const fieldTypes: { value: FieldType; label: string }[] = [
        { value: 'text', label: 'Text Input' },
        { value: 'number', label: 'Number' },
        { value: 'date', label: 'Date' },
        { value: 'select', label: 'Dropdown' },
        { value: 'boolean', label: 'Yes/No Toggle' },
        { value: 'file', label: 'File Upload' },
    ];

    return (
        <div className="h-[calc(100vh-6rem)] flex gap-6">
            {/* Sidebar List */}
            <div className="w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Schemas</h2>
                    <button onClick={handleCreateNew} className="btn btn-primary p-2">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {Object.values(schemas).map(schema => (
                        <div
                            key={schema.id}
                            onClick={() => handleSelectSchema(schema)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedSchemaId === schema.id
                                ? 'bg-primary-50 border-primary-500 shadow-md'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                                }`}
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-white">{schema.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{schema.description}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="badge badge-info">{schema.fields.length} Fields</span>
                                <span className="text-xs text-slate-400">v{schema.version}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                {(selectedSchemaId || isCreating) ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {isCreating ? 'Create New Schema' : 'Edit Schema'}
                                </h2>
                                <p className="text-sm text-slate-500">Define the data structure and validation rules</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isCreating && (
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-danger p-2"
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    className="btn btn-primary flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    <Save className="w-4 h-4" />
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="label">Schema Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="input"
                                        placeholder="e.g., Tablet Product"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="label">Version</label>
                                    <input
                                        type="text"
                                        value={formData.version}
                                        onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                                        className="input"
                                        placeholder="1.0"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="label">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="input min-h-[80px]"
                                        placeholder="Describe what this data structure represents..."
                                    />
                                </div>
                            </div>

                            {/* Fields Editor */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Settings2 className="w-5 h-5" />
                                        Field Definitions
                                    </h3>
                                    <button onClick={handleAddField} className="btn btn-secondary text-sm flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Field
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {formData.fields?.map((field) => (
                                        <div key={field.id} className="group relative bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all hover:shadow-md hover:border-primary-300">
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical className="w-5 h-5" />
                                            </div>

                                            <div className="pl-6 grid grid-cols-12 gap-4 items-start">
                                                <div className="col-span-3 space-y-1">
                                                    <label className="text-xs font-medium text-slate-500">Label</label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => handleFieldChange(field.id, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                                        className="input text-sm py-1.5"
                                                        placeholder="Field Label"
                                                    />
                                                </div>

                                                <div className="col-span-3 space-y-1">
                                                    <label className="text-xs font-medium text-slate-500">Type</label>
                                                    <div className="relative">
                                                        <Type className="absolute left-2.5 top-2 w-4 h-4 text-slate-400" />
                                                        <select
                                                            value={field.type}
                                                            onChange={(e) => handleFieldChange(field.id, { type: e.target.value as FieldType })}
                                                            className="input text-sm py-1.5 pl-9"
                                                        >
                                                            {fieldTypes.map(t => (
                                                                <option key={t.value} value={t.value}>{t.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-xs font-medium text-slate-500">Unit</label>
                                                    <input
                                                        type="text"
                                                        value={field.unit || ''}
                                                        onChange={(e) => handleFieldChange(field.id, { unit: e.target.value })}
                                                        className="input text-sm py-1.5"
                                                        placeholder="e.g. mg"
                                                    />
                                                </div>

                                                <div className="col-span-3 pt-6 flex items-center gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => handleFieldChange(field.id, { required: e.target.checked })}
                                                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        <span className="text-sm text-slate-600">Required</span>
                                                    </label>
                                                </div>

                                                <div className="col-span-1 pt-6 text-right">
                                                    <button
                                                        onClick={() => handleRemoveField(field.id)}
                                                        className="text-slate-400 hover:text-danger-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Extended Options for Select/Number */}
                                                {field.type === 'select' && (
                                                    <div className="col-span-12 pl-6 pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                                        <label className="text-xs font-medium text-slate-500">Options (comma separated)</label>
                                                        <input
                                                            type="text"
                                                            value={field.validation?.options?.join(', ') || ''}
                                                            onChange={(e) => handleFieldChange(field.id, { validation: { ...field.validation, options: e.target.value.split(',').map(s => s.trim()) } })}
                                                            className="input text-sm py-1.5 mt-1"
                                                            placeholder="Option 1, Option 2, Option 3"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {formData.fields?.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                            <p className="text-slate-500">No fields defined yet. Click "Add Field" to start.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <Settings2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a schema to edit or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
};
