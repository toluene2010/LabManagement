# Mock Data Removal Guide

## ⚠️ IMPORTANT: Remove Mock Data Before Production

This application currently uses mock data for development and testing purposes. **All mock data MUST be removed before deploying to production.**

---

## 📁 Files Containing Mock Data

### 1. **`src/data/mockData.ts`** ⚠️ DELETE THIS ENTIRE FILE
This file contains all the centralized mock data including:
- 20+ Test Methods
- 20+ Products (Tablets, Liquids, Semi-solids, Raw Materials, Intermediates, Packaging)
- Realistic pharmaceutical specifications

**Action:** Delete this entire file before production.

---

## 🔧 Steps to Remove Mock Data

### Step 1: Delete Mock Data File
```bash
# Delete the mock data file
rm src/data/mockData.ts
```

### Step 2: Update `masterDataStore.ts`

**File:** `src/stores/masterDataStore.ts`

**Find these lines:**
```typescript
import { MOCK_PRODUCTS, MOCK_TEST_METHODS } from '../data/mockData';

// ...

products: MOCK_PRODUCTS,
testMethods: MOCK_TEST_METHODS,
```

**Replace with:**
```typescript
// Remove the import line completely

// ...

products: [],
testMethods: [],
```

### Step 3: Update `sampleStore.ts` (if applicable)

**File:** `src/stores/sampleStore.ts`

**Find:**
```typescript
samples: MOCK_SAMPLES,
```

**Replace with:**
```typescript
samples: [],
```

### Step 4: Update `deviationStore.ts` (if applicable)

**File:** `src/stores/deviationStore.ts`

**Find:**
```typescript
deviations: MOCK_DEVIATIONS,
```

**Replace with:**
```typescript
deviations: [],
```

### Step 5: Clear Browser Storage

After removing mock data, users will need to clear their browser's local storage:

**In Chrome/Edge:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Local Storage" → `http://localhost:3001` (or your domain)
4. Right-click → "Clear"
5. Refresh the page

**Or programmatically:**
```javascript
// Add this temporarily to clear storage
localStorage.clear();
sessionStorage.clear();
```

---

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] `src/data/mockData.ts` file is **deleted**
- [ ] `masterDataStore.ts` has empty arrays for `products` and `testMethods`
- [ ] `sampleStore.ts` has empty array for `samples`
- [ ] `deviationStore.ts` has empty array for `deviations`
- [ ] All imports of mock data are removed
- [ ] Application builds without errors
- [ ] Browser storage is cleared
- [ ] Application starts with empty data (no products, test methods, samples)

---

## 🔄 Production Data Integration

After removing mock data, you'll need to integrate with your production database:

### Option 1: REST API Integration
```typescript
// In masterDataStore.ts
const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
};

// Initialize with API data
products: await fetchProducts(),
```

### Option 2: GraphQL Integration
```typescript
// Use Apollo Client or similar
const { data } = useQuery(GET_PRODUCTS);
```

### Option 3: Database Direct Connection
```typescript
// Use Prisma, TypeORM, or similar
const products = await prisma.product.findMany();
```

---

## 📊 Mock Data Statistics

Current mock data includes:

- **Test Methods:** 20+ (Chemical, Physical, Microbiological)
- **Products:** 20+
  - Finished Products: 10+ (Tablets, Liquids, Semi-solids)
  - Raw Materials: 5+ (APIs, Excipients)
  - Intermediates: 2+
  - Packaging Materials: 3+
- **Specifications:** 50+ test specifications
- **Realistic Data:** Based on actual pharmaceutical industry standards

---

## 🚀 Quick Remove Script

Create a script to automate mock data removal:

**`scripts/remove-mock-data.sh`** (Linux/Mac)
```bash
#!/bin/bash
echo "Removing mock data..."

# Delete mock data file
rm -f src/data/mockData.ts

# Update stores (requires manual verification)
echo "⚠️  Please manually update the following files:"
echo "  - src/stores/masterDataStore.ts"
echo "  - src/stores/sampleStore.ts"
echo "  - src/stores/deviationStore.ts"
echo ""
echo "Change all mock data imports to empty arrays []"
```

**`scripts/remove-mock-data.ps1`** (Windows PowerShell)
```powershell
Write-Host "Removing mock data..." -ForegroundColor Yellow

# Delete mock data file
Remove-Item -Path "src/data/mockData.ts" -ErrorAction SilentlyContinue

Write-Host "⚠️  Please manually update the following files:" -ForegroundColor Red
Write-Host "  - src/stores/masterDataStore.ts"
Write-Host "  - src/stores/sampleStore.ts"
Write-Host "  - src/stores/deviationStore.ts"
Write-Host ""
Write-Host "Change all mock data imports to empty arrays []"
```

---

## 📝 Notes

- Mock data is stored in browser's `localStorage` under the key `pharma-qc-master-data`
- Clearing localStorage will reset all data to the initial state
- In production, replace Zustand's `persist` middleware with API calls
- Consider adding data migration scripts for existing users

---

## 🆘 Need Help?

If you encounter issues removing mock data:

1. Check browser console for errors
2. Verify all imports are removed
3. Clear browser cache and storage
4. Rebuild the application: `npm run build`
5. Test in a fresh browser session

---

**Last Updated:** 2024-11-25
**Version:** 1.0.0
