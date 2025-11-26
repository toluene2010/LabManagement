import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RDStudy, ComparabilityAnalysis, DissolutionProfile } from '../types/rd-studies';
import { useCompanyConfig } from '../stores/companyConfigStore';

export const generateRDStudyReport = (
    study: RDStudy,
    reportType: string,
    comparabilityAnalyses: ComparabilityAnalysis[]
) => {
    const doc = new jsPDF();
    const { config } = useCompanyConfig.getState();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Helper function to add header
    const addHeader = () => {
        doc.setFillColor(59, 130, 246); // Primary blue
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(config.companyName, pageWidth / 2, 12, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(config.companyAddress, pageWidth / 2, 18, { align: 'center' });
        doc.text(`Phone: ${config.companyPhone} | Email: ${config.companyEmail}`, pageWidth / 2, 23, { align: 'center' });
        if (config.companyWebsite) {
            doc.text(config.companyWebsite, pageWidth / 2, 28, { align: 'center' });
        }
    };

    // Helper function to add footer
    const addFooter = (pageNum: number) => {
        doc.setTextColor(100);
        doc.setFontSize(8);
        doc.text(
            `Page ${pageNum} | Generated: ${new Date().toLocaleString()}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
            return true;
        }
        return false;
    };

    // Add header
    addHeader();
    yPos = 40;

    // Study Information Section
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Study Information', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const studyInfo = [
        ['Study Number:', study.studyNumber],
        ['Study Title:', study.studyTitle],
        ['Study Type:', study.studyType.replace('_', ' ').toUpperCase()],
        ['Product:', study.productName],
        ['Status:', study.status.replace('_', ' ').toUpperCase()],
        ['Lead Scientist:', study.leadScientist],
        ['Start Date:', new Date(study.startDate).toLocaleDateString()],
        ['End Date:', study.endDate ? new Date(study.endDate).toLocaleDateString() : 'Ongoing']
    ];

    autoTable(doc, {
        startY: yPos,
        head: [],
        body: studyInfo,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
            1: { cellWidth: 'auto' }
        }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Study Objective
    checkNewPage(30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Study Objective', 14, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const objectiveLines = doc.splitTextToSize(study.objective, pageWidth - 28);
    doc.text(objectiveLines, 14, yPos);
    yPos += objectiveLines.length * 5 + 10;

    // Team Members
    if (study.teamMembers && study.teamMembers.length > 0) {
        checkNewPage(30);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Team Members', 14, yPos);
        yPos += 7;

        // Team members are strings in the current type definition
        const teamData = study.teamMembers.map(member => [member]);
        autoTable(doc, {
            startY: yPos,
            head: [['Name']],
            body: teamData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 10 }
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Study Parameters
    if ((reportType === 'full_study' || reportType === 'parameters') && study.parameters && study.parameters.length > 0) {
        checkNewPage(40);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Study Parameters', 14, yPos);
        yPos += 10;

        const paramData = study.parameters.map(param => [
            param.category,
            param.parameterName,
            param.targetValue || '-',
            param.unit || '-',
            param.acceptanceCriteria || '-'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Category', 'Parameter', 'Target', 'Unit', 'Criteria']],
            body: paramData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9 }
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Dissolution Profiles
    if ((reportType === 'full_study' || reportType === 'dissolution') && study.dissolutionProfiles && study.dissolutionProfiles.length > 0) {
        checkNewPage(40);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Dissolution Profiles', 14, yPos);
        yPos += 10;

        study.dissolutionProfiles.forEach((profile, index) => {
            checkNewPage(40);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Profile ${index + 1}: ${profile.sampleDescription}`, 14, yPos);
            yPos += 7;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Conditions: ${profile.medium} | ${profile.apparatus} | ${profile.rpm} RPM`, 14, yPos);
            yPos += 5;

            const timePointsData = profile.timePoints.map(tp => [
                tp.time.toString(),
                tp.percentDissolved.toString(),
                '-' // RSD not in type definition
            ]);

            autoTable(doc, {
                startY: yPos,
                head: [['Time (min)', 'Dissolution (%)', 'RSD (%)']],
                body: timePointsData,
                theme: 'grid',
                headStyles: { fillColor: [100, 116, 139] },
                styles: { fontSize: 9 },
                margin: { left: 14, right: pageWidth / 2 }
            });

            yPos = (doc as any).lastAutoTable.finalY + 10;
        });
    }

    // Comparability Analysis Section
    if ((reportType === 'full_study' || reportType === 'comparability') && comparabilityAnalyses.length > 0) {
        checkNewPage(40);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Comparability Analysis', 14, yPos);
        yPos += 10;

        comparabilityAnalyses.forEach((analysis, index) => {
            checkNewPage(50);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Analysis ${index + 1}: ${analysis.analysisTitle}`, 14, yPos);
            yPos += 7;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Method: ${analysis.comparisonMethod.toUpperCase()} | Date: ${new Date(analysis.analysisDate).toLocaleDateString()}`, 14, yPos);
            yPos += 5;
            doc.text(`Analyzed By: ${analysis.analyzedBy}`, 14, yPos);
            yPos += 8;

            // F1/F2 Results
            if (analysis.f1Value !== undefined && analysis.f2Value !== undefined) {
                const resultsData = [
                    ['F1 (Difference Factor)', analysis.f1Value.toFixed(2), analysis.f1Value <= 15 ? 'PASS' : 'FAIL'],
                    ['F2 (Similarity Factor)', analysis.f2Value.toFixed(2), analysis.f2Value >= 50 ? 'PASS' : 'FAIL'],
                    ['Conclusion', analysis.conclusion.toUpperCase(), '']
                ];

                autoTable(doc, {
                    startY: yPos,
                    head: [['Parameter', 'Value', 'Result']],
                    body: resultsData,
                    theme: 'striped',
                    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
                    styles: { fontSize: 9, cellPadding: 3 }
                });

                yPos = (doc as any).lastAutoTable.finalY + 5;
            }

            // Interpretation
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            const interpretation = analysis.conclusion === 'similar'
                ? 'The dissolution profiles are considered SIMILAR according to FDA guidance (F2 ≥ 50).'
                : analysis.conclusion === 'not_similar'
                    ? 'The dissolution profiles are NOT SIMILAR. Further investigation required.'
                    : 'The analysis is INCONCLUSIVE. Please review the data.';

            const interpretationLines = doc.splitTextToSize(interpretation, pageWidth - 28);
            doc.text(interpretationLines, 14, yPos);
            yPos += interpretationLines.length * 4 + 10;

            // Find profiles for charting
            const refProfile = study.dissolutionProfiles?.find(p => p.id === analysis.referenceProfile);
            const testProfiles = study.dissolutionProfiles?.filter(p => analysis.testProfiles.includes(p.id)) || [];

            // Draw Dissolution Chart
            if (refProfile && testProfiles.length > 0) {
                checkNewPage(100);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('Dissolution Profile Comparison Graph', 14, yPos);
                yPos += 10;

                // Chart dimensions
                const chartX = 20;
                const chartY = yPos;
                const chartWidth = pageWidth - 40;
                const chartHeight = 80;

                // Draw axes
                doc.setDrawColor(0);
                doc.setLineWidth(0.5);
                doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight); // X axis
                doc.line(chartX, chartY, chartX, chartY + chartHeight); // Y axis

                // Draw labels
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');

                // Y-axis labels (0 to 100)
                for (let i = 0; i <= 5; i++) {
                    const val = i * 20;
                    const y = chartY + chartHeight - (val / 100) * chartHeight;
                    doc.text(val.toString(), chartX - 2, y, { align: 'right' });
                    doc.setDrawColor(200);
                    doc.line(chartX, y, chartX + chartWidth, y); // Grid line
                }

                // Get all time points
                const allTimePoints = new Set<number>();
                refProfile.timePoints.forEach(tp => allTimePoints.add(tp.time));
                const sortedTimePoints = Array.from(allTimePoints).sort((a, b) => a - b);
                const maxTime = sortedTimePoints[sortedTimePoints.length - 1] || 60;

                // X-axis labels
                sortedTimePoints.forEach(time => {
                    const x = chartX + (time / maxTime) * chartWidth;
                    doc.text(time.toString(), x, chartY + chartHeight + 5, { align: 'center' });
                    doc.setDrawColor(200);
                    doc.line(x, chartY, x, chartY + chartHeight); // Grid line
                });

                // Helper to plot line
                const plotProfile = (profile: DissolutionProfile, color: [number, number, number], style: 'solid' | 'dashed' = 'solid') => {
                    doc.setDrawColor(...color);
                    doc.setLineWidth(0.5);
                    if (style === 'dashed') {
                        doc.setLineDashPattern([3, 3], 0);
                    } else {
                        doc.setLineDashPattern([], 0);
                    }

                    let prevX: number | null = null;
                    let prevY: number | null = null;

                    // Start from 0,0
                    const startX = chartX;
                    const startY = chartY + chartHeight;
                    prevX = startX;
                    prevY = startY;

                    // Sort time points
                    const sortedPoints = [...profile.timePoints].sort((a, b) => a.time - b.time);

                    sortedPoints.forEach((tp) => {
                        const x = chartX + (tp.time / maxTime) * chartWidth;
                        const y = chartY + chartHeight - (tp.percentDissolved / 100) * chartHeight;

                        if (prevX !== null && prevY !== null) {
                            doc.line(prevX, prevY, x, y);
                        }

                        // Draw point
                        doc.setFillColor(...color);
                        doc.circle(x, y, 1, 'F');

                        prevX = x;
                        prevY = y;
                    });

                    // Reset dash
                    doc.setLineDashPattern([], 0);
                };

                // Plot Reference (Blue)
                plotProfile(refProfile, [59, 130, 246]);

                // Plot Tests (Red, Green, etc.)
                const colors: [number, number, number][] = [[239, 68, 68], [34, 197, 94], [245, 158, 11]];
                testProfiles.forEach((profile, idx) => {
                    plotProfile(profile, colors[idx % colors.length] || [0, 0, 0]);
                });

                // Legend
                let legendX = chartX + 10;
                const legendY = chartY + 5;

                // Reference Legend
                doc.setFillColor(59, 130, 246);
                doc.circle(legendX, legendY, 2, 'F');
                doc.setTextColor(0);
                doc.text('Reference', legendX + 5, legendY + 1);
                legendX += 30;

                // Test Legend
                testProfiles.forEach((_, idx) => {
                    const color = colors[idx % colors.length];
                    doc.setFillColor(...color);
                    doc.circle(legendX, legendY, 2, 'F');
                    doc.text(`Test ${idx + 1}`, legendX + 5, legendY + 1);
                    legendX += 30;
                });

                yPos += chartHeight + 15;
            }

            yPos += 10;
        });
    }

    // Conclusions and Recommendations
    if (reportType === 'full_study') {
        if (study.conclusions) {
            checkNewPage(30);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Conclusions', 14, yPos);
            yPos += 7;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const conclusionLines = doc.splitTextToSize(study.conclusions, pageWidth - 28);
            doc.text(conclusionLines, 14, yPos);
            yPos += conclusionLines.length * 5 + 10;
        }

        if (study.recommendations) {
            checkNewPage(30);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Recommendations', 14, yPos);
            yPos += 7;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const recommendationLines = doc.splitTextToSize(study.recommendations, pageWidth - 28);
            doc.text(recommendationLines, 14, yPos);
            yPos += recommendationLines.length * 5 + 10;
        }
    }

    // Signature Section
    checkNewPage(60);
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Approvals', 14, yPos);
    yPos += 10;

    const signatureWidth = 70;
    const signatureHeight = 25;

    // Prepared By
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Prepared By (Scientist):', 14, yPos);
    doc.rect(14, yPos + 2, signatureWidth, signatureHeight);
    doc.setFontSize(8);
    doc.text('Signature: _____________________', 16, yPos + signatureHeight - 8);
    doc.text('Date: _____________', 16, yPos + signatureHeight - 2);

    // Approved By
    const approveX = 14 + signatureWidth + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Approved By (R&D Manager):', approveX, yPos);
    doc.rect(approveX, yPos + 2, signatureWidth, signatureHeight);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature: _____________________', approveX + 2, yPos + signatureHeight - 8);
    doc.text('Date: _____________', approveX + 2, yPos + signatureHeight - 2);

    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addFooter(i);
    }

    doc.save(`RD_Study_Report_${study.studyNumber}_${new Date().toISOString().split('T')[0]}.pdf`);
};
