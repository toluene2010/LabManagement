# Laboratory Management Module - Quick Start Guide

## Accessing the Module

1. **Login** to the Pharma QC application
2. Look for **"Laboratory Management"** in the left sidebar (flask icon 🧪)
3. Click to open the Laboratory Management dashboard

## Dashboard Overview

When you first open Laboratory Management, you'll see:

### Statistics Cards (Top Section)
```
┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐
│ Active Instruments  │ Reagents in Stock   │ Available Glassware │ Active Ref Samples  │
│      15 / 20        │      45 / 50        │      120 / 150      │      25 / 30        │
│ ⚠ 3 calibration due │ ⚠ 5 low stock       │                     │ ⚠ 2 expiring soon   │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
```

### Navigation Tabs
```
┌──────────────┬──────────┬────────────────┬──────────────────┬──────────────┬──────┐
│ Instruments  │ Reagents │ Glassware &    │ Refrigerator     │ Reference    │ SOPs │
│     (20)     │   (50)   │ Tools (150)    │ Inventory (75)   │ Samples (30) │ (40) │
└──────────────┴──────────┴────────────────┴──────────────────┴──────────────┴──────┘
```

## Section-by-Section Guide

### 1. Instruments Tab

**What you'll see:**
- Table with all instruments
- Columns: Instrument #, Name, Manufacturer, Status, Calibration Type, Last Cal, Next Cal
- Color-coded status indicators
- Red warning for calibrations due within 30 days

**Quick Actions:**
- 🔍 **Search** - Find instruments by number, name, or manufacturer
- ➕ **Add Instrument** - Click button to add new equipment

**Example Entry:**
```
Instrument #: HPLC-001
Name: High Performance Liquid Chromatograph
Manufacturer: Agilent
Model: 1260 Infinity II
Status: Active ✓
Calibration Type: Qualification
Last Calibration: 2024-10-15
Next Calibration: 2025-10-15 (in 324 days)
```

### 2. Reagents Tab

**What you'll see:**
- Table with all reagents
- Columns: Catalog #, Name, Lot #, Quantity, Status, Storage, Expiration
- Expiration warnings (30 days)
- Low stock alerts

**Quick Actions:**
- 🔍 **Search** - Find reagents by catalog #, name, or manufacturer
- ➕ **Add Reagent** - Click to add new chemicals

**Example Entry:**
```
Catalog #: ACE-123456
Name: Acetonitrile HPLC Grade
Manufacturer: Fisher Scientific
Lot #: 2024-AB-789
Quantity: 2.5 L
Storage: Room Temperature, Cabinet A, Shelf 2
Expiration: 2025-12-31
Status: In Stock ✓
```

### 3. Glassware & Tools Tab

**What you'll see:**
- Table with lab equipment
- Columns: Item #, Name, Type, Size, Quantity, Status
- Availability tracking

**Quick Actions:**
- 🔍 **Search** - Find glassware by name or type
- ➕ **Add Glassware** - Click to add new items

**Example Entry:**
```
Item #: VF-100-001
Name: Volumetric Flask
Type: Volumetric Flask
Size: 100 mL
Quantity: 10
Status: Available ✓
Requires Calibration: Yes ✓
Last Calibration: 2024-06-01
```

### 4. Refrigerator Inventory Tab

**What you'll see:**
- Items grouped by refrigerator
- Each refrigerator shows a table of its contents
- Columns: Shelf, Item Type, Name, Lot #, Quantity, Temperature, Expiration

**Quick Actions:**
- 🔍 **Search** - Find items by name or refrigerator
- ➕ **Add Item** - Click to add new refrigerator item

**Example Entry:**
```
Refrigerator: QC-FRIDGE-A
Shelf: Shelf 2
Item Type: Reagent
Item Name: Standard Solution A
Lot #: 2024-STD-001
Quantity: 500 mL
Temperature: 2-8°C
Stored Date: 2024-11-01
Expiration: 2025-02-01
```

### 5. Reference Samples Tab

**What you'll see:**
- Table with reference standards
- Columns: Ref #, Name, Type, Lot #, Purity, Quantity, Expiration, Status
- Expiration warnings (30 days)

**Quick Actions:**
- 🔍 **Search** - Find reference samples by number, name, or type
- ➕ **Add Reference Sample** - Click to add new standards

**Example Entry:**
```
Reference #: RS-2024-001
Name: Paracetamol Reference Standard
Type: Working Standard
Manufacturer: USP
Lot #: K1L234
Catalog #: 1551507
Purity: 99.8%
Quantity: 100 mg
Certificate #: COA-2024-K1L234
Expiration: 2026-01-15
Status: Active ✓
```

### 6. SOPs Tab

**What you'll see:**
- Table with all SOPs
- Columns: SOP #, Title, Version, Department, Effective Date, Next Review, Status
- Review due warnings (30 days)
- Overdue alerts

**Quick Actions:**
- 🔍 **Search** - Find SOPs by number, title, or department
- ➕ **Add SOP** - Click to add new procedure

**Example Entry:**
```
SOP #: QC-SOP-001
Title: HPLC Method for Assay Determination
Version: 2.1
Department: Quality Control
Effective Date: 2024-01-15
Review Date: 2024-01-15
Next Review: 2025-01-15 (in 51 days)
Review Frequency: 12 months
Status: Active ✓
Author: John Smith
Approver: Jane Doe
```

## Common Tasks

### Adding a New Item
1. Click the appropriate tab
2. Click "Add [Item Type]" button
3. Fill in required fields (marked with *)
4. Click "Add" to save

### Editing an Item
1. Find the item in the table
2. Click the ✏️ (edit) icon
3. Update the information
4. Click "Update" to save

### Deleting an Item
1. Find the item in the table
2. Click the 🗑️ (trash) icon
3. Confirm deletion

### Searching for Items
1. Use the search box at the top of each tab
2. Type part of the name, number, or other identifier
3. Results filter automatically as you type

## Alert Indicators

### Color Coding
- 🟢 **Green** - Active, In Stock, Available (Good status)
- 🟡 **Yellow** - Warning, Low Stock, Due Soon (Attention needed)
- 🔴 **Red** - Expired, Overdue, Calibration Due (Urgent action needed)
- ⚪ **Gray** - Inactive, Obsolete, Depleted (Not in use)

### Alert Types
- ⚠️ **Calibration Due** - Instrument needs calibration within 30 days
- ⚠️ **Expiring Soon** - Reagent or reference sample expires within 30 days
- ⚠️ **Low Stock** - Reagent quantity below reorder level
- ⚠️ **Review Due** - SOP review due within 30 days
- 🔴 **Overdue** - SOP review is past due date

## Tips for Success

1. **Update Regularly** - Keep information current for accurate tracking
2. **Act on Alerts** - Address warnings before items expire or become overdue
3. **Use Search** - Quickly find items instead of scrolling
4. **Add Details** - Use notes fields for important information
5. **Check Dashboard** - Review statistics regularly for overview

## Need Help?

- 📖 See **LABORATORY_MANAGEMENT_GUIDE.md** for detailed instructions
- 📋 See **LABORATORY_MANAGEMENT_IMPLEMENTATION.md** for technical details
- 💬 Contact your system administrator for support

---

**Quick Reference Card**

| Action | Steps |
|--------|-------|
| Add Item | Tab → Add Button → Fill Form → Save |
| Edit Item | Find Item → Edit Icon → Update → Save |
| Delete Item | Find Item → Trash Icon → Confirm |
| Search | Type in Search Box → Results Filter |
| View Alerts | Check Dashboard Cards → Look for ⚠️ |

---

**Last Updated:** November 25, 2025  
**Version:** 1.0
