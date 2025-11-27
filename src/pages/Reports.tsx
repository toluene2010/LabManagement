import React, { useState } from 'react';
import { useSampleStore } from '../stores/sampleStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useAuthStore } from '../stores/authStore';
import { useDeviationStore } from '../stores/deviationStore';
import { useStabilityStore } from '../stores/stabilityStore';
import { FileText, Download, BarChart3, AlertTriangle, CheckCircle2, FlaskConical, Beaker } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateDeviationReport, generateCAPAReport, generateSampleReport } from '../utils/reportGenerator';
import { generateStabilityReport } from '../utils/stabilityReportGenerator';
import { generateBatchAnalysisReport } from '../utils/batchReportGenerator';
import { useCompanyConfig } from '../stores/companyConfigStore';

export const Reports: React.FC = () => {
    const { samples } = useSampleStore();
    const { products } = useMasterDataStore();
    const { user } = useAuthStore();
    const { deviations, capas } = useDeviationStore();
    const { studies } = useStabilityStore();

    const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSample, setSelectedSample] = useState('');
    const [selectedStabilityStudy, setSelectedStabilityStudy] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');

    // Work Done Report Generator
    const generateWorkDoneReport = () => {
        const doc = new jsPDF();
        const { config } = useCompanyConfig.getState();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Helper function to convert hex to RGB
        const hexToRgb = (hex: string): [number, number, number] => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                : [59, 130, 246];
        };

        const bgColor = hexToRgb(config.headerBackgroundColor);
        const textColor = hexToRgb(config.headerTextColor);

        // Header with custom colors
        doc.setFillColor(...bgColor);
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Company Logo
        if (config.logoFile) {
            try {
                doc.addImage(config.logoFile, 'PNG', 15, 5, 25, 25);
            } catch (e) {
                console.error('Failed to add logo', e);
            }
        }

        // Company Name
        doc.setTextColor(...textColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(config.companyName, pageWidth / 2, 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(config.companyAddress, pageWidth / 2, 18, { align: 'center' });
        doc.text(`${config.companyPhone} | ${config.companyEmail}`, pageWidth / 2, 23, { align: 'center' });
        if (config.companyWebsite) {
            doc.text(config.companyWebsite, pageWidth / 2, 28, { align: 'center' });
        }

        // Report Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`Work Done Report - ${reportType.toUpperCase()}`, pageWidth / 2, 45, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 55);
        doc.text(`Report Period: ${selectedDate}`, 14, 61);

        // Filter samples based on date and type
        const date = new Date(selectedDate);
        const filteredSamples = samples.filter(sample => {
            const sampleDate = new Date(sample.receivedDate);
            if (reportType === 'daily') {
                return sampleDate.toDateString() === date.toDateString();
            } else if (reportType === 'weekly') {
                const diffTime = Math.abs(date.getTime() - sampleDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
            } else {
                return sampleDate.getMonth() === date.getMonth() && sampleDate.getFullYear() === date.getFullYear();
            }
        });

        // Summary Statistics
        const completedSamples = filteredSamples.filter(s => s.status === 'approved').length;
        const inProgressSamples = filteredSamples.filter(s => s.status === 'in_analysis').length;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary', 14, 71);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Samples: ${filteredSamples.length}`, 14, 77);
        doc.text(`Completed: ${completedSamples}`, 14, 83);
        doc.text(`In Progress: ${inProgressSamples}`, 14, 89);

        // Table Data
        const tableData = filteredSamples.map(sample => {
            const product = products.find(p => p.id === sample.productId);
            const analystName = sample.assignedTo ? 'Assigned' : 'Unassigned';
            const completedTests = sample.results.filter(r => r.status === 'approved').length;
            const totalTests = sample.results.length;

            return [
                sample.sampleNumber,
                product?.name || 'Unknown',
                sample.batchNumber,
                new Date(sample.receivedDate).toLocaleDateString(),
                sample.status,
                analystName,
                `${completedTests}/${totalTests}`
            ];
        });

        autoTable(doc, {
            head: [['Sample ID', 'Product', 'Batch', 'Received', 'Status', 'Analyst', 'Tests']],
            body: tableData,
            startY: 97,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
        });

        doc.save(`work_done_report_${reportType}_${selectedDate}.pdf`);
    };

    // Analyst Performance Report
    const generateAnalystPerformanceReport = () => {
        const doc = new jsPDF();
        const { config } = useCompanyConfig.getState();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Helper function to convert hex to RGB
        const hexToRgb = (hex: string): [number, number, number] => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                : [59, 130, 246];
        };

        const bgColor = hexToRgb(config.headerBackgroundColor);
        const textColor = hexToRgb(config.headerTextColor);

        // Header with custom colors
        doc.setFillColor(...bgColor);
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Company Logo
        if (config.logoFile) {
            try {
                doc.addImage(config.logoFile, 'PNG', 15, 5, 25, 25);
            } catch (e) {
                console.error('Failed to add logo', e);
            }
        }

        // Company Name
        doc.setTextColor(...textColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(config.companyName, pageWidth / 2, 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(config.companyAddress, pageWidth / 2, 18, { align: 'center' });
        doc.text(`${config.companyPhone} | ${config.companyEmail}`, pageWidth / 2, 23, { align: 'center' });
        if (config.companyWebsite) {
            doc.text(config.companyWebsite, pageWidth / 2, 28, { align: 'center' });
        }

        // Report Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Analyst Performance Report', pageWidth / 2, 45, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 55);

        // Calculate performance metrics per analyst
        // Note: Analyst performance requires user management integration
        const performanceData: any[] = []; // Temporarily disabled until user management is connected
        /*
        const performanceData = analysts.map((analyst: any) => {
            const assignedSamples = samples.filter(s => s.assignedTo === analyst.id);
            const completedSamples = assignedSamples.filter(s => s.status === 'approved');
            const avgTurnaround = assignedSamples.length > 0
                ? assignedSamples.reduce((acc, s) => {
                    const received = new Date(s.receivedDate).getTime();
                    const updated = new Date(s.updatedAt).getTime();
                    return acc + (updated - received) / (1000 * 60 * 60 * 24);
                }, 0) / assignedSamples.length
                : 0;

            return [
                `${analyst.firstName} ${analyst.lastName}`,
                assignedSamples.length.toString(),
                completedSamples.length.toString(),
                `${assignedSamples.length > 0 ? ((completedSamples.length / assignedSamples.length) * 100).toFixed(1) : 0}%`,
                avgTurnaround.toFixed(1) + ' days'
            ];
        });
        */

        autoTable(doc, {
            head: [['Analyst', 'Assigned', 'Completed', 'Completion %', 'Avg. Turnaround']],
            body: performanceData,
            startY: 65,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] },
        });

        doc.save(`analyst_performance_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Certificate of Analysis (COA) Generator
    const generateCOA = () => {
        if (!selectedSample) {
            alert('Please select a sample');
            return;
        }

        const sample = samples.find(s => s.id === selectedSample);
        if (!sample) {
            alert('Sample not found');
            return;
        }

        generateSampleReport(sample, user ? `${user.firstName} ${user.lastName}` : 'System');
    };

    // Stability Study Report Generator
    const generateStabilityStudyReport = () => {
        if (!selectedStabilityStudy) {
            alert('Please select a stability study');
            return;
        }

        const study = studies.find(s => s.id === selectedStabilityStudy);
        if (!study) {
            alert('Study not found');
            return;
        }

        generateStabilityReport(study, user ? `${user.firstName} ${user.lastName}` : 'System');
    };

    // Batch Analysis Report Generator
    const generateBatchReport = () => {
        if (!selectedBatch) {
            alert('Please select a batch');
            return;
        }

        generateBatchAnalysisReport(selectedBatch, samples, user ? `${user.firstName} ${user.lastName}` : 'System');
    };

    // Get unique batch numbers
    const uniqueBatches = Array.from(new Set(samples.map(s => s.batchNumber).filter(Boolean)));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Certificates</h1>
                    <p className="text-slate-500">Generate comprehensive reports and certificates</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Done Report */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        Work Done Report
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value as any)}
                                className="input"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input"
                            />
                        </div>
                        <button onClick={generateWorkDoneReport} className="btn btn-primary w-full flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Generate PDF
                        </button>
                    </div>
                </div>

                {/* Analyst Performance Report */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-success-600" />
                        Analyst Performance
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generate a comprehensive report showing analyst workload, completion rates, and turnaround times.
                        </p>
                        <button onClick={generateAnalystPerformanceReport} className="btn btn-success w-full flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Generate Performance Report
                        </button>
                    </div>
                </div>

                {/* Certificate of Analysis (COA) */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-blue-600" />
                        Certificate of Analysis (COA)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Select Sample</label>
                            <select
                                value={selectedSample}
                                onChange={(e) => setSelectedSample(e.target.value)}
                                className="input"
                            >
                                <option value="">Choose a sample...</option>
                                {samples.filter(s => s.status === 'approved' || s.status === 'under_review').map(sample => {
                                    const product = products.find(p => p.id === sample.productId);
                                    return (
                                        <option key={sample.id} value={sample.id}>
                                            {sample.sampleNumber} - {product?.name} ({sample.batchNumber}) - {sample.status.toUpperCase()}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <button onClick={generateCOA} className="btn btn-primary w-full flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Generate COA
                        </button>
                    </div>
                </div>

                {/* Deviation Report */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning-600" />
                        Deviation Summary Report
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generate a comprehensive summary of all deviations with statistics and details.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                                <div className="text-slate-500">Total</div>
                                <div className="font-bold text-lg">{deviations.length}</div>
                            </div>
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                <div className="text-slate-500">Critical</div>
                                <div className="font-bold text-lg text-red-600">{deviations.filter(d => d.severity === 'critical').length}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => generateDeviationReport(deviations, user ? `${user.firstName} ${user.lastName}` : 'System')}
                            className="btn btn-warning w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate Deviation Report
                        </button>
                    </div>
                </div>

                {/* CAPA Report */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success-600" />
                        CAPA Effectiveness Report
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generate a report analyzing the effectiveness of Corrective and Preventive Actions.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                                <div className="text-slate-500">Total CAPAs</div>
                                <div className="font-bold text-lg">{capas.length}</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <div className="text-slate-500">Effective</div>
                                <div className="font-bold text-lg text-green-600">
                                    {capas.filter(c => c.effectivenessCheck?.isEffective === true).length}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => generateCAPAReport(capas, user ? `${user.firstName} ${user.lastName}` : 'System')}
                            className="btn btn-success w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate CAPA Report
                        </button>
                    </div>
                </div>

                {/* Batch Report */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Batch Analysis Report
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generate batch-wise analysis reports with trend analysis and statistical data.
                        </p>
                        <div>
                            <label className="label">Select Batch</label>
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="input"
                            >
                                <option value="">Choose a batch...</option>
                                {uniqueBatches.map(batch => (
                                    <option key={batch} value={batch}>
                                        {batch} ({samples.filter(s => s.batchNumber === batch).length} samples)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={generateBatchReport}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate Batch Report
                        </button>
                    </div>
                </div>

                {/* Stability Study Report */}
                <div className="card">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Beaker className="w-5 h-5 text-indigo-600" />
                        Stability Study Report
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Generate comprehensive stability study reports with all time points and test results.
                        </p>
                        <div>
                            <label className="label">Select Study</label>
                            <select
                                value={selectedStabilityStudy}
                                onChange={(e) => setSelectedStabilityStudy(e.target.value)}
                                className="input"
                            >
                                <option value="">Choose a study...</option>
                                {studies.map(study => (
                                    <option key={study.id} value={study.id}>
                                        {study.studyNumber} - {study.productName} ({study.batchNumber})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={generateStabilityStudyReport}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate Stability Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
