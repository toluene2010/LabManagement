# Certificate of Analysis (COA) - Usage Guide

## What is a COA?

A **Certificate of Analysis (COA)** is an official document that certifies a product has been tested and meets its specifications. It's a critical regulatory document in pharmaceutical manufacturing.

## When to Generate a COA

Generate a COA when:
1. ✅ Sample has been received
2. ✅ All required tests have been performed
3. ✅ Test results have been entered
4. ✅ Sample is either:
   - **UNDER_REVIEW** - Tests complete, awaiting QA approval
   - **APPROVED** - Tests complete and approved by QA

## Workflow

### Step 1: Sample Registration
- Navigate to **Sample Management**
- Register a new sample
- Sample starts with status: `RECEIVED`

### Step 2: Perform Analysis
- Navigate to **Result Entry**
- Select the sample
- Enter test results for all required tests
- Sample status changes to: `IN_ANALYSIS` → `UNDER_REVIEW`

### Step 3: Generate COA
- Navigate to **Reports** page
- Scroll to **Certificate of Analysis (COA)** section
- Select your sample from the dropdown
  - **Now shows:** Samples with status `UNDER_REVIEW` or `APPROVED`
  - **Display format:** `Sample Number - Product Name (Batch) - STATUS`
- Click **Generate COA**
- PDF downloads automatically

### Step 4: Review & Approval (Optional)
- If sample is `UNDER_REVIEW`, QA Manager can approve it
- Once approved, status becomes `APPROVED`
- COA can be regenerated with approved status

## What's Included in the COA

The generated COA PDF includes:
- ✅ Company header (name, address, contact info)
- ✅ Sample information (number, product, batch, lot)
- ✅ Test results table (all parameters tested)
- ✅ Specifications and acceptance criteria
- ✅ Test status (Pass/Fail)
- ✅ Analyst information
- ✅ Date of analysis
- ✅ Professional formatting

## Recent Fix Applied

**Issue:** After running analysis, samples weren't showing in the COA dropdown.

**Root Cause:** Dropdown was only showing samples with status `APPROVED`, but samples after testing are typically `UNDER_REVIEW`.

**Solution:** Updated the filter to show both:
- `UNDER_REVIEW` - Tests completed, awaiting approval
- `APPROVED` - Tests completed and approved

Now you can generate COA immediately after completing analysis!

## Sample Status Flow

```
RECEIVED
   ↓
IN_ANALYSIS (during testing)
   ↓
UNDER_REVIEW (tests complete) ← COA can be generated
   ↓
APPROVED (QA approved) ← COA can be generated
```

## Troubleshooting

**Q: My sample still doesn't appear in the dropdown**
- Check the sample status (should be UNDER_REVIEW or APPROVED)
- Ensure test results have been entered
- Refresh the Reports page

**Q: Can I generate COA for samples still in analysis?**
- No, samples must have completed testing (UNDER_REVIEW or APPROVED)
- This ensures the COA contains all required test data

**Q: What if I need to regenerate a COA?**
- Simply select the sample again and click Generate COA
- A new PDF will be created with current data
