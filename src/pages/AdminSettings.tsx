import React, { useState, useEffect } from 'react';
import { useCompanyConfig } from '../stores/companyConfigStore';
import { useAuthStore } from '../stores/authStore';
import { Building2, Users, Shield, Save, Plus, Trash2, Key, FileText, Upload } from 'lucide-react';
import { User, UserRole } from '../types';

export const AdminSettings: React.FC = () => {
    const { config, updateConfig } = useCompanyConfig();
    const { users, addUser, updateUser, deleteUser, resetPassword } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'company' | 'users' | 'audit'>('company');

    // Company Form State
    const [companyForm, setCompanyForm] = useState({
        name: config.companyName,
        address: config.companyAddress,
        phone: config.companyPhone,
        email: config.companyEmail,
        website: config.companyWebsite,
        logoUrl: config.logoUrl || '',
        logoFile: config.logoFile || null as string | null,
        licenseNumber: '',
        headerBackgroundColor: config.headerBackgroundColor || '#3B82F6',
        headerTextColor: config.headerTextColor || '#FFFFFF'
    });
    const [isDirty, setIsDirty] = useState(false);

    // User Management State
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userFormData, setUserFormData] = useState<Partial<User> & { password?: string }>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'analyst',
        department: '',
        isActive: true,
        permissions: []
    });

    // Audit Log State
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    useEffect(() => {
        setCompanyForm({
            name: config.companyName,
            address: config.companyAddress,
            phone: config.companyPhone,
            email: config.companyEmail,
            website: config.companyWebsite,
            logoUrl: config.logoUrl || '',
            logoFile: config.logoFile || null,
            licenseNumber: '',
            headerBackgroundColor: config.headerBackgroundColor,
            headerTextColor: config.headerTextColor
        });
    }, [config]);

    useEffect(() => {
        if (activeTab === 'audit') {
            const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
            setAuditLogs(logs);
        }
    }, [activeTab]);

    const handleCompanySave = () => {
        updateConfig({
            companyName: companyForm.name,
            companyAddress: companyForm.address,
            companyPhone: companyForm.phone,
            companyEmail: companyForm.email,
            companyWebsite: companyForm.website,
            logoUrl: companyForm.logoUrl,
            logoFile: companyForm.logoFile,
            headerBackgroundColor: companyForm.headerBackgroundColor,
            headerTextColor: companyForm.headerTextColor
        });
        setIsDirty(false);
        alert('Company settings saved successfully!');
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            updateUser(editingUser.id, userFormData);
        } else {
            const newUser: User = {
                id: `user_${Date.now()}`,
                username: userFormData.username!,
                email: userFormData.email!,
                firstName: userFormData.firstName!,
                lastName: userFormData.lastName!,
                role: userFormData.role as UserRole,
                department: userFormData.department,
                isActive: userFormData.isActive!,
                createdAt: new Date().toISOString(),
                permissions: [] // Default permissions based on role could be added here
            };
            addUser(newUser, userFormData.password || 'password123');
        }
        setShowUserModal(false);
        setEditingUser(null);
        setUserFormData({ role: 'analyst', isActive: true, permissions: [] });
    };

    const openUserModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setUserFormData(user);
        } else {
            setEditingUser(null);
            setUserFormData({ role: 'analyst', isActive: true, permissions: [] });
        }
        setShowUserModal(true);
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Administration</h1>
                    <p className="text-slate-500">Configure company details, manage users, and view audit logs</p>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'company' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 font-medium' : 'text-slate-600 hover:bg-white/50'}`}
                    >
                        <Building2 className="w-5 h-5" />
                        Company Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 font-medium' : 'text-slate-600 hover:bg-white/50'}`}
                    >
                        <Users className="w-5 h-5" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 font-medium' : 'text-slate-600 hover:bg-white/50'}`}
                    >
                        <Shield className="w-5 h-5" />
                        Audit Logs
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'company' && (
                        <div className="max-w-2xl space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="label">Company Logo</label>
                                    <div className="flex items-center gap-4">
                                        {companyForm.logoUrl ? (
                                            <div className="relative w-32 h-32 border border-slate-200 rounded-lg overflow-hidden bg-white">
                                                <img
                                                    src={companyForm.logoUrl}
                                                    alt="Company Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setCompanyForm({ ...companyForm, logoUrl: '', logoFile: null });
                                                        setIsDirty(true);
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50"
                                                >
                                                    <Trash2 className="w-4 h-4 text-danger-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
                                                <Building2 className="w-8 h-8 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <label className="btn btn-secondary cursor-pointer inline-flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                Upload Logo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            // Validate file type
                                                            if (!file.type.startsWith('image/')) {
                                                                alert('Please upload an image file');
                                                                return;
                                                            }

                                                            // Validate file size (max 2MB)
                                                            if (file.size > 2 * 1024 * 1024) {
                                                                alert('Image size must be less than 2MB');
                                                                return;
                                                            }

                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                setCompanyForm({
                                                                    ...companyForm,
                                                                    logoUrl: URL.createObjectURL(file),
                                                                    logoFile: event.target?.result as string
                                                                });
                                                                setIsDirty(true);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <p className="mt-2 text-sm text-slate-500">
                                                Recommended size: 200x200px. Max size: 2MB.
                                                Supported formats: PNG, JPG.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="label">Certificate Header Styling</label>
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 mb-1 block">Background Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={companyForm.headerBackgroundColor}
                                                    onChange={(e) => {
                                                        setCompanyForm({ ...companyForm, headerBackgroundColor: e.target.value });
                                                        setIsDirty(true);
                                                    }}
                                                    className="h-9 w-16 rounded border border-slate-300 cursor-pointer"
                                                />
                                                <span className="text-sm font-mono text-slate-600">{companyForm.headerBackgroundColor}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 mb-1 block">Text Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={companyForm.headerTextColor}
                                                    onChange={(e) => {
                                                        setCompanyForm({ ...companyForm, headerTextColor: e.target.value });
                                                        setIsDirty(true);
                                                    }}
                                                    className="h-9 w-16 rounded border border-slate-300 cursor-pointer"
                                                />
                                                <span className="text-sm font-mono text-slate-600">{companyForm.headerTextColor}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-2 mt-2">
                                            <label className="text-sm font-medium text-slate-700 mb-2 block">Preview</label>
                                            <div
                                                className="p-4 rounded-lg flex items-center justify-between"
                                                style={{
                                                    backgroundColor: companyForm.headerBackgroundColor,
                                                    color: companyForm.headerTextColor
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {companyForm.logoUrl && (
                                                        <img src={companyForm.logoUrl} alt="Logo" className="h-10 w-auto object-contain bg-white/10 rounded" />
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-lg leading-none">{companyForm.name || 'Company Name'}</div>
                                                        <div className="text-xs opacity-80 mt-1">{companyForm.address || 'Company Address'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm opacity-90">
                                                    <div>CERTIFICATE OF ANALYSIS</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="label">Company Name</label>
                                    <input
                                        type="text"
                                        value={companyForm.name}
                                        onChange={(e) => { setCompanyForm({ ...companyForm, name: e.target.value }); setIsDirty(true); }}
                                        className="input"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="label">Address</label>
                                    <textarea
                                        value={companyForm.address}
                                        onChange={(e) => { setCompanyForm({ ...companyForm, address: e.target.value }); setIsDirty(true); }}
                                        className="input min-h-[80px]"
                                    />
                                </div>
                                <div>
                                    <label className="label">Phone</label>
                                    <input
                                        type="text"
                                        value={companyForm.phone}
                                        onChange={(e) => { setCompanyForm({ ...companyForm, phone: e.target.value }); setIsDirty(true); }}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        value={companyForm.email}
                                        onChange={(e) => { setCompanyForm({ ...companyForm, email: e.target.value }); setIsDirty(true); }}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">Website</label>
                                    <input
                                        type="text"
                                        value={companyForm.website}
                                        onChange={(e) => { setCompanyForm({ ...companyForm, website: e.target.value }); setIsDirty(true); }}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">License Number</label>
                                    <input
                                        type="text"
                                        value={companyForm.licenseNumber || ''}
                                        onChange={(e) => { setCompanyForm({ ...companyForm, licenseNumber: e.target.value }); setIsDirty(true); }}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={handleCompanySave}
                                    disabled={!isDirty}
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Users ({users.length})</h3>
                                <button onClick={() => openUserModal()} className="btn btn-primary flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add User
                                </button>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {users.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="badge badge-info uppercase">{user.role.replace('_', ' ')}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{user.department || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openUserModal(user)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newPass = prompt('Enter new password for ' + user.username);
                                                                if (newPass) {
                                                                    resetPassword(user.id, newPass);
                                                                    alert('Password updated');
                                                                }
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-warning-600 transition-colors"
                                                            title="Reset Password"
                                                        >
                                                            <Key className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this user?')) {
                                                                    deleteUser(user.id);
                                                                }
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-danger-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">System Audit Logs</h3>
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4">Entity</th>
                                            <th className="px-6 py-4">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {auditLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.userName}</td>
                                                <td className="px-6 py-4">
                                                    <span className="badge badge-secondary uppercase">{log.action}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{log.entityType}</td>
                                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.entityId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={userFormData.firstName}
                                        onChange={e => setUserFormData({ ...userFormData, firstName: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={userFormData.lastName}
                                        onChange={e => setUserFormData({ ...userFormData, lastName: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={userFormData.email}
                                    onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Username</label>
                                <input
                                    required
                                    type="text"
                                    value={userFormData.username}
                                    onChange={e => setUserFormData({ ...userFormData, username: e.target.value })}
                                    className="input"
                                    disabled={!!editingUser}
                                />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="label">Password</label>
                                    <input
                                        required
                                        type="password"
                                        value={userFormData.password || ''}
                                        onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Role</label>
                                    <select
                                        value={userFormData.role}
                                        onChange={e => setUserFormData({ ...userFormData, role: e.target.value as UserRole })}
                                        className="input"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="qa_manager">QA Manager</option>
                                        <option value="analyst">Analyst</option>
                                        <option value="reviewer">Reviewer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Department</label>
                                    <input
                                        type="text"
                                        value={userFormData.department || ''}
                                        onChange={e => setUserFormData({ ...userFormData, department: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={userFormData.isActive}
                                    onChange={e => setUserFormData({ ...userFormData, isActive: e.target.checked })}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Active User</span>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowUserModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
