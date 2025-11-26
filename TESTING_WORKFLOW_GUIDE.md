# Complete Testing Workflow Guide

## How to Complete a Test and Generate COA

### 📋 **Complete Workflow from Sample to COA**

---

## Step 1: Register Sample
1. Go to **Sample Management**
2. Click **"+ New Sample"**
3. Fill in sample details:
   - Product
   - Batch Number
   - Lot Number (optional)
   - Select test methods required
4. Click **"Register Sample"**
5. **Sample Status:** `RECEIVED` ✅

---

## Step 2: Enter Test Results
1. Go to **Result Entry** page
2. Select your sample from the list
3. You'll see all assigned test methods in the left sidebar
4. Click on each test method to enter results:
   - Fill in all required fields
   - Click **"Save Draft"** to save progress (optional)
   - Click **"Submit Result"** when done with that test
5. **Individual Test Status:** `PENDING` → `IN_PROGRESS` → `COMPLETED` ✅
6. Repeat for all test methods

---

## Step 3: Automatic Status Update ⭐ **NEW FIX**
**When you submit the LAST test:**
- System automatically checks if all tests are completed
- **Sample Status** changes from `IN_ANALYSIS` → `UNDER_REVIEW` ✅
- Sample now appears in COA dropdown!

### What Changed:
**Before:** Sample stayed in `IN_ANALYSIS` even after all tests were done  
**After:** Sample automatically moves to `UNDER_REVIEW` when all tests are submitted

---

## Step 4: Generate COA
1. Go to **Reports** page
2. Scroll to **"Certificate of Analysis (COA)"** section
3. Select your sample from dropdown
   - Shows samples with status: `UNDER_REVIEW` or `APPROVED`
   - Format: `Sample Number - Product (Batch) - STATUS`
4. Click **"Generate COA"**
5. PDF downloads automatically! 📄

---

## Step 5: QA Approval (Optional)
If you want the sample to show as `APPROVED`:

1. Go back to **Result Entry**
2. Select the sample
3. **For QA Managers/Admins:**
   - Click **"Approve Result"** for each test
   - When ALL tests are approved
   - **Sample Status:** `UNDER_REVIEW` → `APPROVED` ✅

---

## 🎯 **Status Flow Chart**

### Sample Status:
```
RECEIVED
   ↓ (start entering results)
IN_ANALYSIS
   ↓ (all tests submitted) ⭐ AUTOMATIC
UNDER_REVIEW ← COA Available
   ↓ (QA approves all tests) ⭐ AUTOMATIC
APPROVED ← COA Available
```

### Individual Test Status:
```
PENDING
   ↓ (analyst starts entering)
IN_PROGRESS
   ↓ (analyst clicks "Submit Result")
COMPLETED
   ↓ (reviewer reviews - optional)
REVIEWED
   ↓ (QA manager clicks "Approve")
APPROVED
```

---

## 🔑 **Key Points**

### ✅ **What Makes a Test "Complete":**
- All required fields filled
- Click **"Submit Result"** button
- Test status shows `COMPLETED`

### ✅ **What Makes a Sample Ready for COA:**
- **ALL** assigned tests are submitted (status: `COMPLETED` or higher)
- Sample status automatically becomes `UNDER_REVIEW`
- Sample appears in COA dropdown

### ✅ **Automatic Status Updates (NEW):**
1. **When last test is submitted:**
   - Sample → `UNDER_REVIEW`
   
2. **When last test is approved:**
   - Sample → `APPROVED`

---

## 🎨 **Visual Indicators**

### In Result Entry Page:
- **Green checkmark** ✓ = Test approved
- **Blue badge** = Test completed
- **Gray badge** = Test pending/in progress

### In Sample List:
- **RECEIVED** = Just registered
- **IN_ANALYSIS** = Some tests in progress
- **UNDER_REVIEW** = All tests done, awaiting approval
- **APPROVED** = All tests approved by QA
- **REJECTED** = Failed QA review
- **ON_HOLD** = Temporarily paused

---

## 🚀 **Quick Checklist**

To generate a COA, ensure:
- [ ] Sample registered
- [ ] All test methods assigned
- [ ] All tests have results entered
- [ ] All tests submitted (click "Submit Result" for each)
- [ ] Sample status shows `UNDER_REVIEW` or `APPROVED`
- [ ] Go to Reports → COA → Select sample → Generate

---

## ⚠️ **Troubleshooting**

**Q: I submitted all tests but sample still shows `IN_ANALYSIS`**
- Make sure you clicked **"Submit Result"** (not just "Save Draft")
- Check that ALL assigned tests show `COMPLETED` status
- Refresh the page

**Q: Sample not appearing in COA dropdown**
- Check sample status (must be `UNDER_REVIEW` or `APPROVED`)
- Ensure all tests are submitted
- Refresh the Reports page

**Q: Can I edit results after submission?**
- No, once submitted, results are locked for data integrity
- Contact QA manager if changes are needed

**Q: Do I need QA approval to generate COA?**
- No! You can generate COA when status is `UNDER_REVIEW`
- QA approval changes status to `APPROVED` but COA works for both

---

## 📊 **User Roles & Permissions**

| Action | Analyst | Reviewer | QA Manager | Admin |
|--------|---------|----------|------------|-------|
| Enter Results | ✅ | ✅ | ✅ | ✅ |
| Submit Results | ✅ | ✅ | ✅ | ✅ |
| Review Results | ❌ | ✅ | ✅ | ✅ |
| Approve Results | ❌ | ❌ | ✅ | ✅ |
| Generate COA | ✅ | ✅ | ✅ | ✅ |

---

## 🎉 **Summary**

The workflow is now **fully automatic**:
1. Submit all tests → Sample becomes `UNDER_REVIEW`
2. Approve all tests → Sample becomes `APPROVED`
3. Generate COA anytime after step 1!

No manual status changes needed! 🚀
