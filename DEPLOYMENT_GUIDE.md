# Deployment Guide - Pharma QC System

## Current Status
- ✅ Code pushed to GitHub: https://github.com/toluene2010/LabManagement
- ✅ Supabase database configured
- ✅ Mock login credentials removed from UI
- ⚠️ TypeScript type mismatches between code and database schema
- ⚠️ Need to complete Supabase integration

## Issue Summary
The application has TypeScript types that expect more fields than the current Supabase database schema provides. This needs to be resolved before deployment.

## Two Deployment Options

### Option A: Deploy Current Version (With Mock Data)
**Fastest - 5 minutes**

1. The current deployed version on Netlify works with mock data stored in browser
2. Users can test all features immediately
3. Data is not shared between users
4. Good for: Demos, testing, proof of concept

**To update the deployed version:**
- Just drag the `dist` folder to Netlify again
- Or trigger a redeploy from Netlify dashboard

### Option B: Complete Supabase Integration (Production Ready)
**Recommended - 2-3 hours of work**

This requires:

1. **Fix Type Mismatches**
   - Update TypeScript interfaces to match Supabase schema
   - OR update Supabase schema to match TypeScript types
   - Files to update: `src/types/index.ts`, all stores

2. **Complete Store Refactoring**
   - ✅ authStore.ts - DONE
   - ✅ masterDataStore.ts - DONE (but has type errors)
   - ⏳ sampleStore.ts - TODO
   - ⏳ deviationStore.ts - TODO
   - ⏳ stabilityStore.ts - TODO
   - ⏳ rdStudyStore.ts - TODO
   - ⏳ laboratoryStore.ts - TODO

3. **Add Data Initialization**
   - Create initial admin user in Supabase
   - Optionally seed test methods and products

4. **Environment Variables**
   - Ensure Netlify has correct Supabase credentials

## Recommended Next Steps

### Immediate (Today):
1. **Keep current deployment running** with mock data for testing
2. **Create first admin user in Supabase**:
   ```sql
   -- Run this in Supabase SQL Editor
   -- First, sign up a user through Supabase Auth dashboard
   -- Then run this to create their profile:
   INSERT INTO profiles (id, username, first_name, last_name, role, department, is_active)
   VALUES (
     'USER_ID_FROM_AUTH',  -- Replace with actual user ID from auth.users
     'admin',
     'System',
     'Administrator',
     'admin',
     'IT',
     true
   );
   ```

### This Week:
1. **Decide on schema approach**:
   - Simplify TypeScript types to match current DB schema (faster)
   - OR expand DB schema to match TypeScript types (more features)

2. **Complete one store at a time**:
   - Start with sampleStore (most critical)
   - Test thoroughly before moving to next

3. **Deploy incrementally**:
   - Deploy each completed store
   - Test in production
   - Fix issues before continuing

## Quick Fix for Immediate Deployment

If you want to deploy NOW with the changes made (no mock login credentials):

1. **Temporarily revert to mock data in stores**:
   ```bash
   git checkout HEAD~1 -- src/stores/masterDataStore.ts
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   ```

3. **Upload `dist` folder to Netlify**

This gives you a clean login page without credentials shown, but still using mock data.

## Contact for Help
- TypeScript errors need to be resolved before full Supabase integration
- Estimate: 2-3 hours to complete all store refactoring
- Alternative: Hire a developer familiar with Supabase + TypeScript

## Files Modified (Not Yet Deployed)
- src/pages/Login.tsx - ✅ Credentials removed
- src/stores/authStore.ts - ✅ Supabase auth integrated
- src/stores/masterDataStore.ts - ⚠️ Has type errors

## Next Session Priorities
1. Fix TypeScript type mismatches
2. Complete sampleStore Supabase integration
3. Test authentication flow end-to-end
4. Deploy to Netlify with environment variables
