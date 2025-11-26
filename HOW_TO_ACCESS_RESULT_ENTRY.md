# How to Access Result Entry

## 📍 **Where is Result Entry?**

**Result Entry** is NOT a separate menu item. It's accessed by clicking on a sample!

---

## 🎯 **Step-by-Step Navigation:**

### **Method 1: From Sample Management (Main Way)**

1. **Click on "Sample Management"** in the left sidebar
   - Icon: Flask/Beaker icon
   - Should be near the top of the menu

2. **You'll see a list of sample cards**
   - Each card shows:
     - Sample Number (e.g., S-2024-001)
     - Product Name
     - Batch Number
     - Status badge (RECEIVED, IN_ANALYSIS, etc.)
     - Received date

3. **Click on ANY sample card**
   - The entire card is clickable
   - This opens the Result Entry page for that sample

4. **You're now in Result Entry!**
   - You'll see the sample details at the top
   - Test methods listed on the left sidebar
   - Result entry form in the main area

---

## 📱 **What You'll See in Sample Management:**

```
┌─────────────────────────────────────────┐
│  Sample Management                      │
│  ┌─────────────────────────────────┐   │
│  │ 🧪 S-2024-001                   │   │ ← Click this card!
│  │ Product: Paracetamol 500mg      │   │
│  │ Batch: B-2024-001               │   │
│  │ Status: RECEIVED                │   │
│  │ Received: 2024-11-25            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 🧪 S-2024-002                   │   │ ← Or this one!
│  │ Product: Ibuprofen 400mg        │   │
│  │ Batch: B-2024-002               │   │
│  │ Status: IN_ANALYSIS             │   │
│  │ Received: 2024-11-24            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🎨 **What Result Entry Looks Like:**

```
┌─────────────────────────────────────────────────────────┐
│ ← Back    S-2024-001 | Paracetamol 500mg               │
│           Batch: B-2024-001 • Received: 2024-11-25      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌────────────────────────────────────┐  │
│  │ Tests    │  │ Result Entry                        │  │
│  │          │  │                                      │  │
│  │ ✓ pH     │  │ Specification: 6.0 - 8.0            │  │
│  │   Assay  │  │                                      │  │
│  │   Purity │  │ pH Value: [_______]                 │  │
│  │          │  │ Temperature: [_______]              │  │
│  │          │  │                                      │  │
│  │          │  │ [Save Draft] [Submit Result]        │  │
│  └──────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗺️ **Full Navigation Path:**

```
Dashboard
   ↓
Sample Management (click in sidebar)
   ↓
Click on a Sample Card
   ↓
Result Entry Page Opens!
```

---

## 💡 **Quick Tips:**

### **If you don't see any samples:**
1. Click **"+ New Sample"** button (top right)
2. Register a sample first
3. Then click on it to enter results

### **If you're already in Sample Management:**
- Look for rectangular cards with sample information
- Each card is clickable
- Click anywhere on the card to open Result Entry

### **Sample Card Features:**
- **Hover effect**: Card highlights when you hover over it
- **Status badge**: Shows current status (color-coded)
- **Quick info**: All key details visible at a glance

---

## 🎯 **Alternative: Direct URL**

If you know the sample ID, you can also navigate directly:
```
http://localhost:3000/results/SAMPLE_ID_HERE
```

But the easiest way is just clicking the sample card! 🖱️

---

## 📋 **Complete Workflow Reminder:**

1. **Sample Management** → Click sample card
2. **Result Entry** opens → Enter test results
3. Click **"Submit Result"** for each test
4. When all tests submitted → Sample status → `UNDER_REVIEW`
5. Go to **Reports** → Generate COA

---

## ❓ **Still Can't Find It?**

Make sure you're looking at the **left sidebar menu**:
- 📊 Dashboard
- 🧪 **Sample Management** ← Click here first!
- 📦 Master Data
- 🔬 Test Methods
- 📋 Specifications
- 📊 Analytics
- 📄 Reports
- ⚙️ Configuration

Then click on any sample card to open Result Entry!
