# Setup Guide - Pharma QC System

## ⚠️ Important: Google Drive Installation Issue

The npm installation is encountering errors because the project is located in Google Drive. Google Drive's file syncing can interfere with npm's file operations.

## ✅ Recommended Solution

### Option 1: Copy to Local Directory (Recommended)

1. **Copy the entire project folder** to a local directory:
   ```
   C:\Projects\pharma-qc-system
   ```
   or
   ```
   C:\Users\YourUsername\Documents\pharma-qc-system
   ```

2. **Open the local copy** in your terminal/command prompt

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. The application will open at `http://localhost:3000`

### Option 2: Disable Google Drive Sync Temporarily

1. Right-click the project folder in Google Drive
2. Select "Available offline" → "Remove offline access"
3. Run `npm install`
4. After installation completes, re-enable sync

### Option 3: Use a Different Package Manager

Try using `yarn` or `pnpm` which sometimes handle Google Drive better:

```bash
# Using yarn
npm install -g yarn
yarn install
yarn dev

# Using pnpm
npm install -g pnpm
pnpm install
pnpm dev
```

## 📋 System Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Browser**: Modern browser (Chrome, Firefox, Edge, Safari)
- **RAM**: Minimum 4GB
- **Disk Space**: ~500MB for dependencies

## 🔧 Troubleshooting

### Issue: "vite is not recognized"
**Solution**: Dependencies not installed. Follow Option 1 above.

### Issue: Port 3000 already in use
**Solution**: Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to any available port
}
```

### Issue: Module not found errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
**Solution**: The project uses strict TypeScript. Errors should resolve after dependencies are installed.

## 🎯 Quick Start After Installation

1. **Login** with demo credentials:
   - Username: `admin`
   - Password: `admin123`

2. **Explore the Dashboard** to see sample data

3. **Try the Configuration Builder** to create a new schema

4. **Register a sample** and enter results

5. **Check the Audit Trail** to see logged actions

## 📚 Next Steps

After successful installation:

1. Read the `README.md` for feature overview
2. Review the `implementation_plan.md` for architecture details
3. Explore the code starting from `src/App.tsx`
4. Customize the system for your needs

## 🆘 Still Having Issues?

If you continue to experience problems:

1. Ensure you're using a **local directory** (not cloud-synced)
2. Check your **Node.js version**: `node --version`
3. Clear npm cache: `npm cache clean --force`
4. Try a fresh installation in a new directory

## 📞 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)
