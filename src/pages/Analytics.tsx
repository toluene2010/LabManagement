import React, { useState } from 'react';
import { useSampleStore } from '../stores/sampleStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useAuthStore } from '../stores/authStore';
import { calculateCPK, analyzeTrend, calculateControlLimits } from '../utils/statistics';
import { generateAnalyticsReport } from '../utils/analyticsReportGenerator';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, BarChart3, Activity, Download } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const Analytics: React.FC = () => {
    const { samples } = useSampleStore();
    const { user } = useAuthStore();
    const { products, testMethods } = useMasterDataStore();
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [selectedTest, setSelectedTest] = useState<string>('');

    // Get historical data for selected product and test
    const getHistoricalData = () => {
        if (!selectedProduct || !selectedTest) return [];

        const productSamples = samples.filter(s => s.productId === selectedProduct && s.status === 'approved');
        const results: { value: number; batch: string; date: string }[] = [];

        productSamples.forEach(sample => {
            const testResult = sample.results.find(r => r.testMethodId === selectedTest && r.status === 'approved');
            if (testResult && testResult.results.result) {
                results.push({
                    value: Number(testResult.results.result),
                    batch: sample.batchNumber,
                    date: new Date(sample.receivedDate).toLocaleDateString()
                });
            }
        });

        return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const historicalDataPoints = getHistoricalData();
    const historicalValues = historicalDataPoints.map(d => d.value);

    const product = products.find(p => p.id === selectedProduct);
    const specification = product?.specifications.find(s => s.testMethodId === selectedTest);
    const testMethod = testMethods.find(t => t.id === selectedTest);

    // Calculate CPK if we have enough data and specification limits
    let cpkResult = null;
    if (historicalValues.length >= 2 && specification?.lsl && specification?.usl) {
        try {
            cpkResult = calculateCPK(
                historicalValues,
                specification.lsl,
                specification.usl
            );
        } catch (error) {
            console.error('CPK calculation error:', error);
        }
    }

    // Calculate trend analysis
    let trendResult = null;
    if (historicalValues.length >= 9 && specification?.lsl && specification?.usl) {
        try {
            trendResult = analyzeTrend(
                historicalValues,
                specification.lsl,
                specification.usl
            );
        } catch (error) {
            console.error('Trend analysis error:', error);
        }
    }

    // Calculate control limits
    let controlLimits = null;
    if (historicalValues.length >= 2) {
        controlLimits = calculateControlLimits(historicalValues);
    }

    const getCPKStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'text-success-600 bg-success-50';
            case 'adequate': return 'text-primary-600 bg-primary-50';
            case 'marginal': return 'text-warning-600 bg-warning-50';
            case 'inadequate': return 'text-danger-600 bg-danger-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'increasing': return TrendingUp;
            case 'decreasing': return TrendingDown;
            case 'stable': return Minus;
            default: return Minus;
        }
    };

    const handleDownloadReport = () => {
        if (!product || !testMethod || !specification || historicalDataPoints.length === 0) return;

        try {
            generateAnalyticsReport({
                productName: product.name,
                testMethodName: testMethod.name,
                historicalData: historicalDataPoints,
                specification: {
                    spec: specification.spec,
                    lsl: specification.lsl,
                    usl: specification.usl,
                    target: specification.target,
                    unit: specification.unit
                },
                controlLimits: controlLimits,
                cpkResult: cpkResult,
                trendResult: trendResult
            }, user?.username || 'Unknown User');
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Failed to generate report. Please try again.');
        }
    };

    // Chart Data Configuration
    const chartData = {
        labels: historicalDataPoints.map(d => d.batch),
        datasets: [
            {
                label: 'Test Result',
                data: historicalValues,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            ...(specification?.usl ? [{
                label: 'USL',
                data: Array(historicalValues.length).fill(specification.usl),
                borderColor: 'rgb(239, 68, 68)',
                borderDash: [5, 5],
                pointRadius: 0,
                borderWidth: 2,
            }] : []),
            ...(specification?.lsl ? [{
                label: 'LSL',
                data: Array(historicalValues.length).fill(specification.lsl),
                borderColor: 'rgb(239, 68, 68)',
                borderDash: [5, 5],
                pointRadius: 0,
                borderWidth: 2,
            }] : []),
            ...(specification?.target ? [{
                label: 'Target',
                data: Array(historicalValues.length).fill(specification.target),
                borderColor: 'rgb(34, 197, 94)',
                borderDash: [2, 2],
                pointRadius: 0,
                borderWidth: 1,
            }] : []),
            ...(controlLimits ? [
                {
                    label: 'UCL (+3σ)',
                    data: Array(historicalValues.length).fill(controlLimits.ucl),
                    borderColor: 'rgb(245, 158, 11)',
                    borderDash: [10, 5],
                    pointRadius: 0,
                    borderWidth: 1,
                    hidden: true,
                },
                {
                    label: 'LCL (-3σ)',
                    data: Array(historicalValues.length).fill(controlLimits.lcl),
                    borderColor: 'rgb(245, 158, 11)',
                    borderDash: [10, 5],
                    pointRadius: 0,
                    borderWidth: 1,
                    hidden: true,
                }
            ] : [])
        ],
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Control Chart',
            },
            tooltip: {
                callbacks: {
                    afterLabel: (context) => {
                        const dataIndex = context.dataIndex;
                        const point = historicalDataPoints[dataIndex];
                        return `Date: ${point.date}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: specification?.unit || 'Value'
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Statistical Process Control</h1>
                    <p className="text-slate-500">CPK Analysis & Trend Monitoring for Quality Control</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={!selectedProduct || !selectedTest || historicalValues.length === 0}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-5 h-5" />
                    Download Report
                </button>
            </div>

            {/* Selection Filters */}
            <div className="card">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Product & Test</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="label">Product / Material</label>
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="input"
                        >
                            <option value="">Select a product...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.materialType.replace('_', ' ').toUpperCase()})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="label">Test Method</label>
                        <select
                            value={selectedTest}
                            onChange={(e) => setSelectedTest(e.target.value)}
                            className="input"
                            disabled={!selectedProduct}
                        >
                            <option value="">Select a test...</option>
                            {product?.specifications.map(spec => {
                                const tm = testMethods.find(t => t.id === spec.testMethodId);
                                return (
                                    <option key={spec.testMethodId} value={spec.testMethodId}>
                                        {tm?.name} - {spec.parameter}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Display */}
            {selectedProduct && selectedTest && (
                <>
                    {/* Control Chart */}
                    {historicalValues.length > 0 && (
                        <div className="card">
                            <Line options={chartOptions} data={chartData} />
                        </div>
                    )}

                    {/* Data Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium text-slate-500">Data Points</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{historicalValues.length}</p>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-5 h-5 text-success-600" />
                                <span className="text-sm font-medium text-slate-500">Mean Value</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {controlLimits ? controlLimits.mean.toFixed(2) : '-'}
                                {specification?.unit && <span className="text-sm ml-1">{specification.unit}</span>}
                            </p>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-slate-500">Specification</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {specification?.spec}
                            </p>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-slate-500">Target</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {specification?.target ? specification.target.toFixed(2) : '-'}
                                {specification?.unit && <span className="text-sm ml-1">{specification.unit}</span>}
                            </p>
                        </div>
                    </div>

                    {/* CPK Analysis */}
                    {cpkResult && (
                        <div className="card">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Process Capability Analysis (CPK)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <p className="text-sm text-slate-500 mb-1">CPK</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{cpkResult.cpk.toFixed(3)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <p className="text-sm text-slate-500 mb-1">CP</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{cpkResult.cp.toFixed(3)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <p className="text-sm text-slate-500 mb-1">CPK Lower</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{cpkResult.cpkl.toFixed(3)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <p className="text-sm text-slate-500 mb-1">CPK Upper</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{cpkResult.cpku.toFixed(3)}</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-lg ${getCPKStatusColor(cpkResult.status)}`}>
                                <div className="flex items-center gap-3">
                                    {cpkResult.status === 'excellent' || cpkResult.status === 'adequate' ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <AlertTriangle className="w-6 h-6" />
                                    )}
                                    <div>
                                        <p className="font-bold capitalize">{cpkResult.status} Process Capability</p>
                                        <p className="text-sm">{cpkResult.interpretation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trend Analysis */}
                    {trendResult && (
                        <div className="card">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Trend Analysis & OOS/OOT Detection
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className={`p-4 rounded-lg ${trendResult.isOOS ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {trendResult.isOOS ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        <p className="font-bold">Out of Specification</p>
                                    </div>
                                    <p className="text-2xl font-bold">{trendResult.isOOS ? 'DETECTED' : 'NONE'}</p>
                                </div>
                                <div className={`p-4 rounded-lg ${trendResult.isOOT ? 'bg-warning-50 text-warning-700' : 'bg-success-50 text-success-700'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {trendResult.isOOT ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        <p className="font-bold">Out of Trend</p>
                                    </div>
                                    <p className="text-2xl font-bold">{trendResult.isOOT ? 'DETECTED' : 'NONE'}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-primary-50 text-primary-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        {React.createElement(getTrendIcon(trendResult.trend), { className: 'w-5 h-5' })}
                                        <p className="font-bold">Trend Direction</p>
                                    </div>
                                    <p className="text-2xl font-bold capitalize">{trendResult.trend}</p>
                                </div>
                            </div>
                            {trendResult.warnings.length > 0 && (
                                <div className="space-y-2">
                                    <p className="font-bold text-slate-900 dark:text-white">Warnings & Alerts:</p>
                                    {trendResult.warnings.map((warning, index) => (
                                        <div key={index} className="flex items-start gap-2 p-3 bg-warning-50 text-warning-700 rounded-lg">
                                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                            <p className="text-sm">{warning}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Control Limits */}
                    {controlLimits && (
                        <div className="card">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Control Limits</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="p-3 rounded-lg bg-danger-50">
                                    <p className="text-xs text-danger-600 mb-1">LCL (-3σ)</p>
                                    <p className="text-lg font-bold text-danger-700">{controlLimits.lcl.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-warning-50">
                                    <p className="text-xs text-warning-600 mb-1">LWL (-2σ)</p>
                                    <p className="text-lg font-bold text-warning-700">{controlLimits.lwl.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-success-50">
                                    <p className="text-xs text-success-600 mb-1">Mean</p>
                                    <p className="text-lg font-bold text-success-700">{controlLimits.mean.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-warning-50">
                                    <p className="text-xs text-warning-600 mb-1">UWL (+2σ)</p>
                                    <p className="text-lg font-bold text-warning-700">{controlLimits.uwl.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-danger-50">
                                    <p className="text-xs text-danger-600 mb-1">UCL (+3σ)</p>
                                    <p className="text-lg font-bold text-danger-700">{controlLimits.ucl.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Data Message */}
                    {historicalValues.length === 0 && (
                        <div className="card text-center py-12">
                            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Data Available</h3>
                            <p className="text-slate-500">No approved test results found for this product and test method.</p>
                        </div>
                    )}

                    {historicalValues.length > 0 && historicalValues.length < 2 && (
                        <div className="card text-center py-12">
                            <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Insufficient Data</h3>
                            <p className="text-slate-500">At least 2 data points are required for CPK calculation.</p>
                        </div>
                    )}
                </>
            )}

            {!selectedProduct && !selectedTest && (
                <div className="card text-center py-12">
                    <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Select Product & Test</h3>
                    <p className="text-slate-500">Choose a product and test method to view statistical analysis.</p>
                </div>
            )}
        </div>
    );
};
