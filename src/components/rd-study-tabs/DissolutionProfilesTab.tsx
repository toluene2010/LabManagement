import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BarChart3, TrendingUp } from 'lucide-react';
import { useRDStudyStore } from '../../stores/rdStudyStore';
import { DissolutionProfile, DISSOLUTION_MEDIA, USP_APPARATUS } from '../../types/rd-studies';
import { DissolutionChart } from '../DissolutionChart';
import { ComparabilityAnalysis } from '../ComparabilityAnalysis';

interface DissolutionProfilesTabProps {
    studyId: string;
}

export const DissolutionProfilesTab: React.FC<DissolutionProfilesTabProps> = ({ studyId }) => {
    const { getStudy, addDissolutionProfile, updateDissolutionProfile, deleteDissolutionProfile } = useRDStudyStore();
    const study = getStudy(studyId);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showChart, setShowChart] = useState(false);
    const [showComparability, setShowComparability] = useState(false);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

    const [formData, setFormData] = useState<Omit<DissolutionProfile, 'id'>>({
        sampleId: '',
        sampleDescription: '',
        batchNumber: '',
        testDate: new Date().toISOString().split('T')[0],
        medium: DISSOLUTION_MEDIA[0],
        apparatus: USP_APPARATUS[1],
        rpm: 50,
        temperature: 37,
        timePoints: [],
        testedBy: '',
        remarks: ''
    });

    const [timePointInput, setTimePointInput] = useState({ time: '', percent: '' });

    if (!study) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            updateDissolutionProfile(studyId, editingId, formData);
            setEditingId(null);
        } else {
            addDissolutionProfile(studyId, formData);
        }

        resetForm();
        setIsAdding(false);
    };

    const resetForm = () => {
        setFormData({
            sampleId: '',
            sampleDescription: '',
            batchNumber: '',
            testDate: new Date().toISOString().split('T')[0],
            medium: DISSOLUTION_MEDIA[0],
            apparatus: USP_APPARATUS[1],
            rpm: 50,
            temperature: 37,
            timePoints: [],
            testedBy: '',
            remarks: ''
        });
        setTimePointInput({ time: '', percent: '' });
    };

    const handleEdit = (profile: DissolutionProfile) => {
        setFormData(profile);
        setEditingId(profile.id);
        setIsAdding(true);
    };

    const handleDelete = (profileId: string) => {
        if (confirm('Are you sure you want to delete this dissolution profile?')) {
            deleteDissolutionProfile(studyId, profileId);
        }
    };

    const addTimePoint = () => {
        if (timePointInput.time && timePointInput.percent) {
            const newTimePoint = {
                time: parseFloat(timePointInput.time),
                percentDissolved: parseFloat(timePointInput.percent),
                unit: '%'
            };

            setFormData({
                ...formData,
                timePoints: [...formData.timePoints, newTimePoint].sort((a, b) => a.time - b.time)
            });

            setTimePointInput({ time: '', percent: '' });
        }
    };

    const removeTimePoint = (index: number) => {
        setFormData({
            ...formData,
            timePoints: formData.timePoints.filter((_, i) => i !== index)
        });
    };

    const toggleProfileSelection = (profileId: string) => {
        setSelectedProfiles(prev =>
            prev.includes(profileId)
                ? prev.filter(id => id !== profileId)
                : [...prev, profileId]
        );
    };

    return (
        <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-3">
                {!isAdding && (
                    <>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Dissolution Profile
                        </button>
                        {(study.dissolutionProfiles?.length || 0) > 0 && (
                            <>
                                <button
                                    onClick={() => setShowChart(!showChart)}
                                    className="btn btn-secondary flex items-center gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    {showChart ? 'Hide Chart' : 'Show Chart'}
                                </button>
                                {selectedProfiles.length >= 2 && (
                                    <button
                                        onClick={() => setShowComparability(!showComparability)}
                                        className="btn btn-info flex items-center gap-2"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        {showComparability ? 'Hide Analysis' : 'Compare Profiles'}
                                    </button>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Dissolution Chart */}
            {showChart && study.dissolutionProfiles && study.dissolutionProfiles.length > 0 && (
                <DissolutionChart
                    profiles={selectedProfiles.length > 0
                        ? study.dissolutionProfiles.filter(p => selectedProfiles.includes(p.id))
                        : study.dissolutionProfiles
                    }
                />
            )}

            {/* Comparability Analysis */}
            {showComparability && selectedProfiles.length >= 2 && study.dissolutionProfiles && (
                <ComparabilityAnalysis
                    studyId={studyId}
                    profiles={study.dissolutionProfiles.filter(p => selectedProfiles.includes(p.id))}
                />
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="card bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {editingId ? 'Edit Dissolution Profile' : 'Add New Dissolution Profile'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Sample ID *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.sampleId}
                                    onChange={(e) => setFormData({ ...formData, sampleId: e.target.value })}
                                    className="input"
                                    placeholder="e.g., SAMPLE-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Batch Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.batchNumber}
                                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                    className="input"
                                    placeholder="e.g., BATCH-2024-001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Sample Description *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.sampleDescription}
                                onChange={(e) => setFormData({ ...formData, sampleDescription: e.target.value })}
                                className="input"
                                placeholder="e.g., Reference Standard, Test Batch, etc."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Dissolution Medium *
                                </label>
                                <select
                                    required
                                    value={formData.medium}
                                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                                    className="input"
                                >
                                    {DISSOLUTION_MEDIA.map((medium) => (
                                        <option key={medium} value={medium}>{medium}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    USP Apparatus *
                                </label>
                                <select
                                    required
                                    value={formData.apparatus}
                                    onChange={(e) => setFormData({ ...formData, apparatus: e.target.value })}
                                    className="input"
                                >
                                    {USP_APPARATUS.map((apparatus) => (
                                        <option key={apparatus} value={apparatus}>{apparatus}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    RPM *
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.rpm}
                                    onChange={(e) => setFormData({ ...formData, rpm: parseInt(e.target.value) })}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Temperature (°C) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.temperature}
                                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Test Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.testDate}
                                    onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Tested By *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.testedBy}
                                onChange={(e) => setFormData({ ...formData, testedBy: e.target.value })}
                                className="input"
                            />
                        </div>

                        {/* Time Points */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Dissolution Time Points *
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="number"
                                    value={timePointInput.time}
                                    onChange={(e) => setTimePointInput({ ...timePointInput, time: e.target.value })}
                                    className="input flex-1"
                                    placeholder="Time (min)"
                                    step="0.1"
                                />
                                <input
                                    type="number"
                                    value={timePointInput.percent}
                                    onChange={(e) => setTimePointInput({ ...timePointInput, percent: e.target.value })}
                                    className="input flex-1"
                                    placeholder="% Dissolved"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                />
                                <button
                                    type="button"
                                    onClick={addTimePoint}
                                    className="btn btn-secondary"
                                >
                                    Add Point
                                </button>
                            </div>

                            {formData.timePoints.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        {formData.timePoints.map((tp, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded px-3 py-2"
                                            >
                                                <span className="text-sm text-slate-900 dark:text-white">
                                                    {tp.time} min: {tp.percentDissolved}%
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTimePoint(index)}
                                                    className="text-danger-500 hover:text-danger-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Remarks
                            </label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                className="input min-h-[60px]"
                                placeholder="Any additional notes..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Profile' : 'Add Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Profiles List */}
            {(!study.dissolutionProfiles || study.dissolutionProfiles.length === 0) ? (
                <div className="card text-center py-8">
                    <p className="text-slate-500">No dissolution profiles added yet. Add your first profile to get started.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {study.dissolutionProfiles.map((profile) => (
                        <div
                            key={profile.id}
                            className={`card transition-all ${selectedProfiles.includes(profile.id)
                                    ? 'border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                                    : 'hover:border-primary-300 dark:hover:border-primary-700'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedProfiles.includes(profile.id)}
                                        onChange={() => toggleProfileSelection(profile.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                            {profile.sampleId} - {profile.sampleDescription}
                                        </h4>
                                        {profile.batchNumber && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                Batch: {profile.batchNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(profile)}
                                        className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(profile.id)}
                                        className="p-2 text-slate-400 hover:text-danger-600 dark:hover:text-danger-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-3">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Medium</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.medium}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Apparatus</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.apparatus}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Conditions</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {profile.rpm} RPM, {profile.temperature}°C
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Test Date</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {new Date(profile.testDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 mb-2">Time Points ({profile.timePoints.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.timePoints.map((tp, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-secondary text-xs"
                                        >
                                            {tp.time}min: {tp.percentDissolved}%
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {profile.remarks && (
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 mb-1">Remarks</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{profile.remarks}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
