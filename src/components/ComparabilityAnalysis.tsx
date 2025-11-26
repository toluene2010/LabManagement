import React, { useState } from 'react';
import { TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRDStudyStore } from '../stores/rdStudyStore';
import { DissolutionProfile, F2_CRITERIA } from '../types/rd-studies';
import { useAuthStore } from '../stores/authStore';

interface ComparabilityAnalysisProps {
    studyId: string;
    profiles: DissolutionProfile[];
}

export const ComparabilityAnalysis: React.FC<ComparabilityAnalysisProps> = ({ studyId, profiles }) => {
    const { calculateF1F2, addComparabilityAnalysis } = useRDStudyStore();
    const { user } = useAuthStore();
    const [referenceProfileId, setReferenceProfileId] = useState<string>('');
    const [testProfileIds, setTestProfileIds] = useState<string[]>([]);
    const [results, setResults] = useState<Array<{
        testProfile: DissolutionProfile;
        f1: number;
        f2: number;
        conclusion: 'similar' | 'not_similar' | 'inconclusive';
    }>>([]);

    const handleAnalyze = () => {
        const referenceProfile = profiles.find(p => p.id === referenceProfileId);
        if (!referenceProfile) return;

        const analysisResults = testProfileIds.map(testId => {
            const testProfile = profiles.find(p => p.id === testId);
            if (!testProfile) return null;

            try {
                const { f1, f2 } = calculateF1F2(referenceProfile, testProfile);

                // Determine conclusion based on F2 value
                let conclusion: 'similar' | 'not_similar' | 'inconclusive';
                if (f2 >= F2_CRITERIA.SIMILAR_THRESHOLD) {
                    conclusion = 'similar';
                } else if (f2 < F2_CRITERIA.SIMILAR_THRESHOLD && f2 > 0) {
                    conclusion = 'not_similar';
                } else {
                    conclusion = 'inconclusive';
                }

                // Save the analysis
                addComparabilityAnalysis({
                    rdStudyId: studyId,
                    analysisTitle: `Comparability: ${referenceProfile.sampleDescription} vs ${testProfile.sampleDescription}`,
                    referenceProfile: referenceProfileId,
                    testProfiles: [testId],
                    comparisonMethod: 'f1_f2',
                    f1Value: f1,
                    f2Value: f2,
                    conclusion,
                    analysisDate: new Date().toISOString(),
                    analyzedBy: user ? `${user.firstName} ${user.lastName}` : 'System'
                });

                return {
                    testProfile,
                    f1,
                    f2,
                    conclusion
                };
            } catch (error) {
                console.error('Error calculating F1/F2:', error);
                return null;
            }
        }).filter(r => r !== null) as typeof results;

        setResults(analysisResults);
    };

    const getConclusionBadge = (conclusion: string) => {
        switch (conclusion) {
            case 'similar':
                return (
                    <span className="badge badge-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Similar
                    </span>
                );
            case 'not_similar':
                return (
                    <span className="badge badge-danger flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Not Similar
                    </span>
                );
            default:
                return (
                    <span className="badge badge-warning flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Inconclusive
                    </span>
                );
        }
    };

    return (
        <div className="card bg-gradient-to-br from-primary-50 to-info-50 dark:from-primary-900/20 dark:to-info-900/20">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Dissolution Profile Comparability Analysis
                </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Reference Profile *
                        </label>
                        <select
                            value={referenceProfileId}
                            onChange={(e) => setReferenceProfileId(e.target.value)}
                            className="input"
                        >
                            <option value="">Select Reference Profile</option>
                            {profiles.map((profile) => (
                                <option key={profile.id} value={profile.id}>
                                    {profile.sampleDescription} ({profile.sampleId})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Test Profiles *
                        </label>
                        <select
                            multiple
                            value={testProfileIds}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setTestProfileIds(selected);
                            }}
                            className="input min-h-[100px]"
                        >
                            {profiles
                                .filter(p => p.id !== referenceProfileId)
                                .map((profile) => (
                                    <option key={profile.id} value={profile.id}>
                                        {profile.sampleDescription} ({profile.sampleId})
                                    </option>
                                ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={!referenceProfileId || testProfileIds.length === 0}
                    className="btn btn-primary w-full"
                >
                    Calculate F1 & F2 Similarity Factors
                </button>
            </div>

            {/* F1/F2 Criteria Information */}
            <div className="bg-info-50 dark:bg-info-900/20 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-info-900 dark:text-info-300 mb-2">
                    FDA Guidance - Similarity Factor Criteria
                </h4>
                <ul className="text-sm text-info-800 dark:text-info-400 space-y-1">
                    <li>• <strong>F2 ≥ 50</strong>: Dissolution profiles are considered similar</li>
                    <li>• <strong>F1 ≤ 15</strong>: Additional confirmation of similarity (optional)</li>
                    <li>• Minimum of 3 time points required</li>
                    <li>• Time points until 85% dissolution or first point &gt; 85%</li>
                    <li>• RSD ≤ 20% at early time points, ≤ 10% at other time points</li>
                </ul>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Analysis Results
                    </h4>
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-700"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        {result.testProfile.sampleDescription}
                                    </h5>
                                    <p className="text-sm text-slate-500">
                                        Sample ID: {result.testProfile.sampleId}
                                    </p>
                                </div>
                                {getConclusionBadge(result.conclusion)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">F1 (Difference Factor)</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {result.f1.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {result.f1 <= 15 ? '✓ Within criteria (≤15)' : '✗ Outside criteria (≤15)'}
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">F2 (Similarity Factor)</p>
                                    <p className={`text-2xl font-bold ${result.f2 >= F2_CRITERIA.SIMILAR_THRESHOLD
                                        ? 'text-success-600 dark:text-success-400'
                                        : 'text-danger-600 dark:text-danger-400'
                                        }`}>
                                        {result.f2.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {result.f2 >= F2_CRITERIA.SIMILAR_THRESHOLD
                                            ? '✓ Similar (≥50)'
                                            : '✗ Not Similar (<50)'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <strong>Interpretation:</strong>{' '}
                                    {result.conclusion === 'similar' ? (
                                        <span className="text-success-600 dark:text-success-400">
                                            The dissolution profiles are considered similar according to FDA guidance.
                                            The F2 value of {result.f2.toFixed(2)} meets the acceptance criterion (≥50).
                                        </span>
                                    ) : result.conclusion === 'not_similar' ? (
                                        <span className="text-danger-600 dark:text-danger-400">
                                            The dissolution profiles are NOT considered similar. The F2 value of{' '}
                                            {result.f2.toFixed(2)} does not meet the acceptance criterion (≥50).
                                            Further investigation may be required.
                                        </span>
                                    ) : (
                                        <span className="text-warning-600 dark:text-warning-400">
                                            The analysis is inconclusive. Please verify the data and ensure all
                                            criteria are met.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Methodology Note */}
            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Note:</strong> F1 and F2 calculations are performed according to FDA guidance.
                    F1 measures the percent difference between two dissolution profiles, while F2 measures
                    the similarity. This analysis is saved automatically for regulatory documentation.
                </p>
            </div>
        </div>
    );
};
