# Issues Fixed & Troubleshooting Guide

## ✅ Issues Addressed

### 1. **Stability Studies Not Showing in Navigation** ✅ FIXED
**Problem:** Stability Studies menu item was missing from sidebar  
**Solution:** Added "Stability Studies" to navigation menu in `Layout.tsx`  
**Location:** Between "Test Methods" and "Analytics & CPK"  
**Icon:** Timer icon  
**Route:** `/stability`

---

### 2. **COA Generation Dropdown Not Working** ℹ️ NEEDS DATA
**Status:** The dropdown IS working, but needs approved samples  
**Location:** Reports page → Certificate of Analysis (COA) section  
**How it works:**
- Dropdown shows only **approved samples**
- If empty, you need to:
  1. Go to Sample Management
  2. Create samples
  3. Enter test results
  4. Approve the samples
  5. Then they'll appear in COA dropdown

**To test:**
```
1. Go to /samples
2. Add a sample
3. Click "Enter Results"
4. Fill in test results
5. Approve the sample
6. Go back to /reports
7. COA dropdown will now show the sample
```

---

### 3. **CPK Charts/Graphs Not Displaying** ℹ️ NEEDS DATA
**Status:** Charts ARE implemented, but need data to display  
**Location:** Analytics & CPK page (`/analytics`)  
**Requirements:**
- Select a Product
- Select a Test Method
- Need at least **2 approved test results** for CPK calculation
- Need at least **9 data points** for trend analysis

**Why charts might not show:**
1. **No product selected** - Select from dropdown
2. **No test selected** - Select from dropdown
3. **Insufficient data** - Need approved samples with results
4. **No approved samples** - Samples must be in "approved" status

**What you'll see when it works:**
- Control Chart (line graph with USL/LSL/Target lines)
- CPK values (CPK, CP, CPKL, CPKU)
- Process capability status (Excellent/Adequate/Marginal/Inadequate)
- Trend analysis (Increasing/Decreasing/Stable)
- OOS/OOT detection
- Control limits (UCL, LCL, UWL, LWL)

---

### 4. **More Reports Needed** ✅ AVAILABLE
**Current Reports:**
1. ✅ Work Done Report (Daily/Weekly/Monthly)
2. ✅ Analyst Performance Report
3. ✅ Certificate of Analysis (COA)
4. ✅ Deviation Summary Report
5. ✅ CAPA Effectiveness Report
6. 🔜 Batch Analysis Report (Coming Soon)

**All reports generate PDFs with:**
- Professional formatting
- Tables with data
- Statistics and summaries
- Date stamps
- Proper headers

---

## 🔧 Quick Fixes

### Fix 1: Add Sample Data for Testing

**Option A: Create Sample Manually**
1. Go to `/samples`
2. Click "New Sample"
3. Fill in details
4. Click "Enter Results"
5. Add test results
6. Click "Approve"

**Option B: Use Mock Data** (Recommended for testing)
The app already has mock data in `src/data/mockData.ts` with 20+ products and test methods.

To see charts immediately, you need to:
1. Create a few samples
2. Link them to existing products
3. Enter test results
4. Approve them

---

## 📊 How to See CPK Charts

### Step-by-Step Guide:

1. **Go to Sample Management** (`/samples`)
   - Click "New Sample"
   - Select Product: "Paracetamol Tablets 500mg"
   - Enter Batch Number: "BATCH-001"
   - Set status to "approved"
   - Save

2. **Enter Test Results**
   - Click "Enter Results" on the sample
   - For "Assay by HPLC" test:
     - Enter result: 98.5
     - Status: Approved
   - Save

3. **Repeat for More Batches**
   - Create at least 5-10 samples with different batches
   - Enter results (vary between 96-104 for realistic data)
   - Approve all samples

4. **View CPK Charts**
   - Go to `/analytics`
   - Select Product: "Paracetamol Tablets 500mg"
   - Select Test: "Assay by HPLC - Assay"
   - **Charts will now display!**

---

## 🎯 What Each Page Does

### `/stability` - Stability Studies
- Create long-term, accelerated, intermediate studies
- Track time points (0M, 3M, 6M, etc.)
- Monitor storage conditions
- ICH guideline compliant

### `/reports` - Reports & Certificates
- Generate work done reports
- Create COAs for approved samples
- Analyst performance metrics
- Deviation and CAPA reports

### `/analytics` - CPK & Trending
- Statistical process control
- CPK calculation
- Control charts
- Trend analysis
- OOS/OOT detection

---

## 🐛 Troubleshooting

### "Stability not in menu"
✅ **FIXED** - Refresh your browser (Ctrl+F5)

### "COA dropdown is empty"
- Create and approve samples first
- Only approved samples appear in dropdown

### "No charts showing"
- Select a product AND test method
- Need at least 2 approved samples with results
- Check browser console for errors (F12)

### "Charts show but no CPK values"
- Need specification limits (LSL/USL) defined on product
- Need at least 2 data points
- Results must be numeric

### "Dropdown not clickable"
- Check if there are approved samples
- Try refreshing the page
- Check browser console for errors

---

## ✨ Testing Checklist

- [ ] Stability menu item visible in sidebar
- [ ] Can navigate to `/stability`
- [ ] Stability page loads without errors
- [ ] Can select product in Analytics
- [ ] Can select test method in Analytics
- [ ] Charts display when data exists
- [ ] COA dropdown shows approved samples
- [ ] Can generate PDF reports
- [ ] All report buttons work

---

## 📝 Next Steps

1. **Add Sample Data**
   - Create 10-15 samples
   - Enter test results
   - Approve them

2. **Test All Features**
   - Generate COA
   - View CPK charts
   - Create stability study
   - Generate reports

3. **Customize**
   - Add your own products
   - Define test methods
   - Set specifications

---

## 🆘 Still Having Issues?

If problems persist:

1. **Check Browser Console** (F12 → Console tab)
   - Look for red errors
   - Share error messages

2. **Clear Browser Cache**
   - Ctrl+Shift+Delete
   - Clear cached images and files
   - Refresh page

3. **Check Network Tab** (F12 → Network)
   - See if resources are loading
   - Check for 404 errors

4. **Verify Dev Server Running**
   - Should see "npm run dev" running
   - Check terminal for errors

---

**Last Updated:** 2025-11-25  
**Version:** 1.0.0
