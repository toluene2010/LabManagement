import * as XLSX from 'xlsx';

// CSV Template Generator with data URI fallback
export const downloadProductImportTemplateCSV = () => {
    try {
        // Define headers
        const headers = [
            'Product Name',
            'Product Code',
            'Material Type',
            'Dosage Form',
            'Packaging Type',
            'Description',
            'Test Methods (Comma separated codes)',
            'Specifications (Format: MethodCode:Spec:LSL:USL)'
        ];

        // Create sample rows to guide the user
        const sampleRows = [
            [
                'Paracetamol Tablets 500mg',
                'PROD-001',
                'finished_product',
                'oral_solid',
                '',
                'Standard paracetamol tablets for pain relief',
                'TM-ASSAY,TM-DISS',
                'TM-ASSAY:95.0-105.0%:95:105|TM-DISS:NLT 80% in 30min::80'
            ],
            [
                'Amoxicillin Syrup 125mg/5ml',
                'PROD-002',
                'finished_product',
                'oral_liquid',
                '',
                'Antibiotic suspension',
                'TM-ASSAY,TM-PH',
                'TM-ASSAY:90.0-110.0%:90:110|TM-PH:6.0-7.5:6.0:7.5'
            ],
            [
                'HDPE Bottle 100ml',
                'PKG-001',
                'packaging_material',
                '',
                'primary',
                'High-density polyethylene bottle',
                'TM-VISUAL,TM-LEAK',
                'TM-VISUAL:No defects||TM-LEAK:Pass||'
            ]
        ];

        // Combine headers and sample rows
        const csvContent = [
            headers.join(','),
            ...sampleRows.map(row => row.map(cell => {
                // Escape cells containing commas or quotes
                if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(','))
        ].join('\r\n');

        // Add UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF';
        const csvWithBOM = BOM + csvContent;

        // Try data URI approach first (more compatible)
        const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvWithBOM);

        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'product_import_template.csv');
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('CSV template downloaded successfully');
        alert('CSV template downloaded! Check your Downloads folder for product_import_template.csv');
    } catch (error) {
        console.error('Error downloading CSV template:', error);
        alert('Failed to download CSV template. Error: ' + (error as any).message);
    }
};

// XLSX Template Generator
export const downloadProductImportTemplateXLSX = () => {
    try {
        // Define headers
        const headers = [
            'Product Name',
            'Product Code',
            'Material Type',
            'Dosage Form',
            'Packaging Type',
            'Description',
            'Test Methods',
            'Specifications'
        ];

        // Create sample data
        const data = [
            headers,
            [
                'Paracetamol Tablets 500mg',
                'PROD-001',
                'finished_product',
                'oral_solid',
                '',
                'Standard paracetamol tablets for pain relief',
                'TM-ASSAY,TM-DISS',
                'TM-ASSAY:95.0-105.0%:95:105|TM-DISS:NLT 80% in 30min::80'
            ],
            [
                'Amoxicillin Syrup 125mg/5ml',
                'PROD-002',
                'finished_product',
                'oral_liquid',
                '',
                'Antibiotic suspension',
                'TM-ASSAY,TM-PH',
                'TM-ASSAY:90.0-110.0%:90:110|TM-PH:6.0-7.5:6.0:7.5'
            ],
            [
                'HDPE Bottle 100ml',
                'PKG-001',
                'packaging_material',
                '',
                'primary',
                'High-density polyethylene bottle',
                'TM-VISUAL,TM-LEAK',
                'TM-VISUAL:No defects||TM-LEAK:Pass||'
            ]
        ];

        // Create instructions sheet
        const instructions = [
            ['Product Import Template - Instructions'],
            [''],
            ['Column Descriptions:'],
            ['Product Name', 'Full name of the product'],
            ['Product Code', 'Unique identifier (e.g., PROD-001)'],
            ['Material Type', 'Options: raw_material, intermediate, finished_product, packaging_material'],
            ['Dosage Form', 'Options: oral_liquid, oral_solid, semi_solid (leave empty for packaging)'],
            ['Packaging Type', 'Options: primary, secondary, tertiary, accessories (only for packaging materials)'],
            ['Description', 'Brief description of the product'],
            ['Test Methods', 'Comma-separated test method codes (e.g., TM-001,TM-002)'],
            ['Specifications', 'Format: MethodCode:Spec:LSL:USL separated by | (e.g., TM-001:95-105%:95:105|TM-002:Pass||)'],
            [''],
            ['Notes:'],
            ['- LSL = Lower Specification Limit (optional)'],
            ['- USL = Upper Specification Limit (optional)'],
            ['- Use | to separate multiple specifications'],
            ['- Leave Dosage Form empty for packaging materials'],
            ['- Leave Packaging Type empty for non-packaging materials']
        ];

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Add data sheet
        const wsData = XLSX.utils.aoa_to_sheet(data);

        // Set column widths
        wsData['!cols'] = [
            { wch: 30 }, // Product Name
            { wch: 15 }, // Product Code
            { wch: 20 }, // Material Type
            { wch: 15 }, // Dosage Form
            { wch: 15 }, // Packaging Type
            { wch: 40 }, // Description
            { wch: 25 }, // Test Methods
            { wch: 50 }  // Specifications
        ];

        XLSX.utils.book_append_sheet(wb, wsData, 'Products');

        // Add instructions sheet
        const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
        wsInstructions['!cols'] = [{ wch: 30 }, { wch: 60 }];
        XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

        // Use XLSX.writeFile which handles the download natively
        XLSX.writeFile(wb, 'product_import_template.xlsx', {
            bookType: 'xlsx',
            compression: true
        });

        console.log('XLSX template downloaded successfully');
        alert('XLSX template downloaded! Check your Downloads folder for product_import_template.xlsx');
    } catch (error) {
        console.error('Error downloading XLSX template:', error);
        alert('Failed to download XLSX template. Error: ' + (error as any).message);
    }
};

// Default export for backward compatibility
export const downloadProductImportTemplate = downloadProductImportTemplateCSV;
