# Supabase Migration Complete

## Overview
All core application stores have been refactored to use Supabase for data persistence. Local storage (`persist` middleware) has been removed to ensure Supabase is the single source of truth.

## Refactored Stores
1.  **`sampleStore.ts`**: Samples, Test Results
2.  **`deviationStore.ts`**: Deviations, CAPAs
3.  **`stabilityStore.ts`**: Stability Studies, Protocols, Time Points, Test Results
4.  **`rdStudyStore.ts`**: R&D Studies, Dissolution Profiles, Comparability Analyses
5.  **`laboratoryStore.ts`**: Instruments, Reagents, Glassware, Refrigerator Items, Reference Samples, SOPs
6.  **`masterDataStore.ts`**: Products, Test Methods (removed `persist` middleware)

## Database Schema Updates
A consolidated SQL script `supabase_schema_complete.sql` has been created in the project root. This script includes:
*   Creation of base tables (`products`, `test_methods`, etc.) if they don't exist.
*   Updates to base tables (new columns).
*   Creation of new tables (`capas`, `stability_protocols`, `rd_studies`, etc.).
*   Row Level Security (RLS) policies for all tables.

## CRITICAL NEXT STEPS
**You MUST execute the SQL script to update your Supabase database.**

1.  Go to your Supabase Project Dashboard.
2.  Navigate to the **SQL Editor**.
3.  Open the `supabase_schema_complete.sql` file from your project root.
4.  Copy the entire content of the file.
5.  Paste it into the Supabase SQL Editor.
6.  Click **Run**.

**If you encounter errors regarding existing columns (e.g., "column already exists"), you can ignore them as the script uses `IF NOT EXISTS` where appropriate, or you can comment out the conflicting lines.**

## User Management Note
The `reportedBy`, `createdBy`, `closedBy`, etc., fields now store the User ID (UUID) in the database but are mapped to display names (First Name + Last Name or Username) in the application stores by joining with the `profiles` table.
Ensure your `profiles` table is populated with user data.

## Verification
After running the SQL script:
1.  Restart your development server (`npm run dev`).
2.  Navigate to each module (Samples, Deviations, Stability, R&D, Laboratory).
3.  Try creating new items.
4.  Verify that data persists after refreshing the page.
