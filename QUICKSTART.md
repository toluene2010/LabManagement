# 🚀 Quick Start Guide - Pharma QC Application

## ⚡ 5-Minute Setup

### 1. Start the Application
```bash
npm run dev
```

### 2. Login
- URL: `http://localhost:5173`
- Username: `admin`
- Password: `admin123`

### 3. Try These Features

#### ✅ **Register Your First Sample**
1. Click **Sample Management** in sidebar
2. Click **Register Sample** button
3. Select a product (e.g., "Paracetamol Syrup")
4. Enter batch number: `BATCH-001`
5. Assign to analyst: `John Smith`
6. Click **Register Sample**

#### ✅ **Enter Test Results**
1. Click on the sample you just created
2. Select a test method from the left sidebar
3. Fill in the result fields
4. Click **Submit Result**

#### ✅ **Generate a Report**
1. Go to **Reports** in sidebar
2. Click **Work Done Report**
3. Select **Daily** and today's date
4. Click **Generate PDF**

#### ✅ **Download Import Template**
1. Go to **Product Master**
2. Click **Template** dropdown
3. Select **Download XLSX**
4. Open the file to see the format

---

## 🎯 Key Features to Explore

### **1. Product Management**
- Create products with specifications
- Support for packaging materials
- Bulk import via CSV/XLSX

### **2. Sample Testing**
- Register samples
- Assign to analysts
- Track progress
- Multi-level approval

### **3. Deviation & CAPA**
- Report deviations
- Create corrective actions
- Track effectiveness

### **4. Reports**
- Certificate of Analysis (COA)
- Work Done (Daily/Weekly/Monthly)
- Analyst Performance
- Deviation & CAPA Reports

### **5. Administration**
- User management
- Company settings
- Audit logs

---

## 📱 User Roles

| Role | What You Can Do |
|------|-----------------|
| **Admin** | Everything! Full system access |
| **QA Manager** | Approve results, manage deviations, view reports |
| **Analyst** | Enter test results, register samples |
| **Reviewer** | Review completed test results |

---

## 🔑 Test Accounts

Try logging in with different roles:

```
Admin:
  Username: admin
  Password: admin123

QA Manager:
  Username: qa_manager
  Password: qa123

Analyst:
  Username: analyst1
  Password: analyst123

Reviewer:
  Username: reviewer1
  Password: reviewer123
```

---

## 📊 Sample Workflow

```
1. Register Sample (Any User)
   ↓
2. Enter Results (Analyst)
   ↓
3. Review Results (Reviewer) [Optional]
   ↓
4. Approve Results (QA Manager)
   ↓
5. Generate COA (Any User)
```

---

## 🎨 Customization

### Change Company Name
1. Login as **admin**
2. Go to **System Admin**
3. Click **Company Settings** tab
4. Update company name
5. Click **Save Changes**

### Add New User
1. Login as **admin**
2. Go to **System Admin**
3. Click **User Management** tab
4. Click **Add User**
5. Fill in details
6. Click **Create User**

---

## 🐛 Common Issues

### Template Not Downloading?
✅ **Fixed!** Now supports both CSV and XLSX formats.
- Make sure `xlsx` package is installed
- Try both CSV and XLSX options

### Can't Submit Results?
- Make sure you're logged in as **Analyst** or higher
- Check that all required fields are filled
- Verify sample is not already approved

### Reports Not Generating?
- Ensure you have data for the selected period
- Check browser console for errors
- Try a different date range

---

## 📞 Need Help?

1. Check the main **README.md** for detailed documentation
2. Review the **User Workflows** section
3. Check browser console (F12) for errors
4. Review **Audit Trail** for data changes

---

## 🎉 You're Ready!

Start exploring the application. Everything is set up and ready to use!

**Recommended First Steps:**
1. ✅ Register a sample
2. ✅ Enter some test results
3. ✅ Generate a report
4. ✅ Create a deviation
5. ✅ Download an import template

**Have fun! 🚀**
