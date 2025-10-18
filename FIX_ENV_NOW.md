# ⚠️ URGENT: Fix Your .env.local File

## 🚨 Current Problem

Your `.env.local` file has **incorrect variable names**. The code won't work until this is fixed.

### What You Have Now (WRONG ❌)

```bash
value-bord="199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb"
value-site="2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0"
bucket_id="b843b188-87d6-4c8e-b2aa-eb2ebc65c362"
```

**Problems**:
- ❌ Wrong variable names (`value-bord` should be `CLOUD_API_KEY_FULL`)
- ❌ Has unnecessary quotes around values
- ❌ Missing `CLOUD_API_BASE_URL`

---

## ✅ SOLUTION: Replace With This

**Copy this EXACTLY into your `.env.local` file:**

```bash
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb
CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
```

---

## 📝 Step-by-Step Instructions

### Option 1: Edit Your Existing File (Recommended)

1. **Open `.env.local`** in your editor:
   ```bash
   code .env.local
   # or
   nano .env.local
   # or
   vim .env.local
   ```

2. **Find these three lines**:
   ```bash
   value-bord="..."
   value-site="..."
   bucket_id="..."
   ```

3. **Replace them with**:
   ```bash
   CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
   CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb
   CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0
   CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
   ```

4. **Save the file** (Ctrl+S or :wq)

5. **Keep all other variables** in the file (database, auth, etc.)

---

### Option 2: Copy from Template File

1. **Open the template**:
   ```bash
   cat env.local.TEMPLATE
   ```

2. **Copy the cloud storage section**

3. **Paste into your `.env.local`**

4. **Keep your other variables** (database, auth, etc.)

---

## 🔄 After Fixing

### 1. Verify the Fix

Run the verification script:
```bash
node scripts/verify-cloud-setup.js
```

**Expected output**: ✅ ALL CHECKS PASSED!

---

### 2. Restart Development Server

```bash
# Stop current server (Ctrl+C in terminal)

# Start again
npm run dev
```

**Important**: Environment variables only load when the server starts!

---

### 3. Test the Integration

#### Test Upload:
1. Go to `http://localhost:3000/dashboard/products`
2. Click "Create Product"
3. Try uploading an image or video
4. Should succeed and show a public URL

#### Test Display:
1. View a product on the public website
2. Images/videos should load correctly
3. Check browser console for errors (F12)

---

## ✅ Verification Checklist

After making changes, verify:

- [ ] `.env.local` has `CLOUD_API_BASE_URL` (without quotes)
- [ ] `.env.local` has `CLOUD_API_KEY_FULL` (without quotes)
- [ ] `.env.local` has `CLOUD_API_KEY_READ` (without quotes)
- [ ] No variables named `value-bord`, `value-site`, or `bucket_id`
- [ ] Development server restarted
- [ ] Verification script passes
- [ ] Test upload works
- [ ] Test display works

---

## 🔍 How to Check Your File

View your current `.env.local`:
```bash
cat .env.local | grep CLOUD
```

**Should show**:
```
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb
CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
```

---

## ❓ Common Questions

### Q: Why are the variable names different?

**A**: The code in `app/lib/cloud-storage.ts` looks for specific variable names:
```typescript
const CLOUD_API_KEY_FULL = process.env.CLOUD_API_KEY_FULL;
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ;
```

If your `.env.local` uses different names (like `value-bord`), the code can't find them.

---

### Q: Do I need to remove the quotes?

**A**: Yes! In `.env` files:
- ❌ Wrong: `KEY="value"`
- ✅ Right: `KEY=value`

Quotes are not needed and will be included in the value itself.

---

### Q: What if I have other variables in .env.local?

**A**: Keep them! Only replace the cloud storage variables. Example:

```bash
# Database (keep these)
POSTGRES_URL=your-database-url
POSTGRES_USER=your-user

# Cloud Storage (replace these)
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb
CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0

# Auth (keep these)
AUTH_SECRET=your-auth-secret
```

---

### Q: Do I need to restart after changing .env.local?

**A**: **YES!** Environment variables are loaded only when the server starts.

Stop server (Ctrl+C) → Change .env.local → Start server (`npm run dev`)

---

## 🆘 Still Having Issues?

### Error: "Cannot find module"

**Solution**: Make sure you're in the project directory:
```bash
cd /Users/miko/Documents/web/value
npm run dev
```

---

### Error: "Upload failed with status 401"

**Cause**: API keys not loaded or incorrect

**Solution**:
1. Verify `.env.local` has correct variable names
2. Restart development server
3. Run verification script

---

### Error: "CLOUD_API_KEY_FULL is undefined"

**Cause**: Variable name mismatch

**Solution**: Follow the exact format above, no quotes, correct names

---

## 📞 Next Steps After Fix

Once your `.env.local` is fixed:

1. ✅ **Verification passes**: `node scripts/verify-cloud-setup.js`
2. ✅ **Server restarted**: `npm run dev`
3. ✅ **Test upload works**: Try uploading in admin dashboard
4. ✅ **Test display works**: View files on public website

Then you can:
- Read `CUSTOM_CLOUD_SETUP.md` for complete documentation
- Read `ENV_SETUP_REFERENCE.md` for quick reference
- Read `CLOUD_INTEGRATION_SUMMARY.md` for integration details

---

## 🎯 TL;DR (Too Long; Didn't Read)

**Quick fix in 3 steps:**

1. Open `.env.local`
2. Replace `value-bord=`, `value-site=`, `bucket_id=` with the correct format from above
3. Restart server: `npm run dev`

**Done!** ✅

