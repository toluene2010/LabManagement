# Backup & Dashboard Customization Features

## Overview
This document describes the new backup/restore and dashboard customization features added to the Pharma QC application.

## Features Implemented

### 1. Data Backup & Restore System

#### Admin-Only Access
- Only users with the `admin` role can access backup and restore functionality
- Located in Settings page (`/settings`)

#### Backup Functionality
- **Complete Data Backup**: Creates a comprehensive backup of all application data including:
  - Samples
  - Products
  - Test Methods
  - Specifications
  - Deviations
  - Stability Studies
  - R&D Studies
  - Laboratory Data
  - Audit Logs
  - User Data
  - Configuration Settings

- **Backup File Format**: JSON file with metadata
  - Timestamp
  - Version information
  - Record count
  - Created by (username)

- **Download**: Automatically downloads backup file with date-stamped filename
  - Format: `pharma-qc-backup-YYYY-MM-DD.json`

#### Restore Functionality
- **File Upload**: Accepts JSON backup files
- **Validation**: Validates backup file structure before restoration
- **Confirmation Dialog**: Shows backup details and requires confirmation
- **Data Overwrite Warning**: Clear warning that restoration will overwrite all current data
- **Auto-Refresh**: Automatically refreshes the page after successful restoration

#### Safety Features
- Validation of backup file structure
- Confirmation dialogs before destructive operations
- Error handling with user-friendly messages
- Status notifications (success/error/info)

### 2. Dashboard Customization

#### Layout Options
Users can choose from three dashboard layouts:
1. **Grid Layout** (Default)
   - 4-column grid on large screens
   - 2-column grid on medium screens
   - 1-column on mobile

2. **List Layout**
   - Single column layout
   - Stacked cards for easy scanning

3. **Compact Layout**
   - 2-column grid
   - Space-efficient design

#### Display Options

**Show Trends**
- Toggle to show/hide trend indicators on stat cards
- Displays "Active" badge and trend text

**Compact Mode**
- Reduces padding and font sizes
- Smaller icons
- More information in less space

**Widget Visibility**
- Show/Hide Recent Samples section
- Show/Hide Quick Actions section

#### Preferences Persistence
- All preferences are saved to localStorage
- Persists across browser sessions
- Per-user customization

### 3. Settings Page

#### Sections

**Data Backup & Restore** (Admin Only)
- Create and download backups
- Upload and restore backups
- View last backup information

**Dashboard Preferences** (All Users)
- Layout selection (Grid/List/Compact)
- Display options toggles
- Reset to defaults button

**Security Settings** (All Users)
- View current user information
- Change password (Coming Soon)

**Application Info** (All Users)
- Version number
- Build date
- Environment

## Usage Instructions

### Creating a Backup

1. Navigate to Settings (`/settings`)
2. Locate the "Data Backup & Restore" section (Admin only)
3. Click "Create Backup" button
4. Backup file will automatically download
5. Save the file in a secure location

### Restoring a Backup

1. Navigate to Settings (`/settings`)
2. Locate the "Data Backup & Restore" section (Admin only)
3. Click "Select Backup File"
4. Choose a previously downloaded backup JSON file
5. Review the backup information in the confirmation dialog
6. Click "OK" to confirm restoration
7. Page will automatically refresh after successful restoration

### Customizing Dashboard

1. Navigate to Dashboard (`/`)
2. Click the "Customize" button in the top-right corner
3. Or navigate directly to Settings (`/settings`)
4. Select your preferred layout (Grid/List/Compact)
5. Toggle display options as desired:
   - Show Trends
   - Compact Mode
6. Changes are applied immediately
7. Click "Reset to Defaults" to restore default settings

## Technical Details

### Files Created

1. **`src/utils/backupRestore.ts`**
   - Backup creation logic
   - Restore logic
   - File handling
   - Validation functions

2. **`src/stores/dashboardPreferencesStore.ts`**
   - Dashboard preferences state management
   - Zustand store with persistence
   - Preference update functions

3. **`src/pages/Settings.tsx`**
   - Settings page component
   - Backup/Restore UI
   - Dashboard preferences UI
   - Security and app info sections

### Files Modified

1. **`src/pages/Dashboard.tsx`**
   - Integrated dashboard preferences
   - Dynamic layout based on user preferences
   - Conditional widget rendering
   - Customize button

2. **`src/App.tsx`**
   - Added Settings route

### Data Storage

**LocalStorage Keys:**
- `pharma-qc-samples` - Sample data
- `pharma-qc-master-data` - Products, test methods, specifications
- `pharma-qc-deviations` - Deviation records
- `pharma-qc-stability` - Stability studies
- `pharma-qc-rd-studies` - R&D studies
- `pharma-qc-laboratory` - Laboratory data
- `pharma-qc-config` - Configuration settings
- `pharma-qc-auth` - User data
- `pharma-qc-dashboard-preferences` - Dashboard preferences
- `auditLogs` - Audit trail logs

## Security Considerations

1. **Admin-Only Backup/Restore**: Only admin users can create or restore backups
2. **Confirmation Dialogs**: Prevents accidental data loss
3. **Validation**: Backup files are validated before restoration
4. **Audit Trail**: All backup/restore operations should be logged (future enhancement)

## Future Enhancements

1. **Scheduled Backups**: Automatic backup creation on a schedule
2. **Cloud Storage**: Upload backups to cloud storage
3. **Selective Restore**: Restore only specific data types
4. **Backup Encryption**: Encrypt backup files for security
5. **Backup History**: Track all backup/restore operations
6. **Change Password**: Implement password change functionality
7. **More Dashboard Widgets**: Additional customizable widgets
8. **Drag-and-Drop**: Reorder dashboard widgets via drag-and-drop
9. **Custom Stat Cards**: Allow users to choose which stats to display
10. **Export Formats**: Support additional export formats (CSV, Excel)

## Troubleshooting

### Backup Creation Fails
- Check browser console for errors
- Ensure sufficient localStorage space
- Try refreshing the page and trying again

### Restore Fails
- Verify backup file is valid JSON
- Check that backup file structure matches expected format
- Ensure file is not corrupted
- Try creating a new backup and comparing structure

### Preferences Not Saving
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Dashboard Not Updating
- Refresh the page
- Check that preferences are being saved in localStorage
- Reset to defaults and reconfigure

## Support

For issues or questions, please contact the development team or refer to the main application documentation.
