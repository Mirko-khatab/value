# 🔑 Environment Variables - Quick Reference

## Copy This Into Your `.env.local` File

```bash
# ==========================================
# CLOUD STORAGE CONFIGURATION
# ==========================================

# Cloud Storage API Base URL
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api

# Admin Key (value-bord) - FULL ACCESS
# ⚠️ SECRET - Server-side only!
# Permissions: Upload, Delete, List, Read
CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb

# Public Key (value-site) - READ ONLY
# ✅ Safe for public URLs
# Permissions: List, Read
CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0

# Bucket ID (for reference)
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
```

---

## 🔄 After Adding Variables

1. **Save the file** as `.env.local` in your project root
2. **Restart your development server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Then start again:
   npm run dev
   ```
3. **Verify it's working**:
   - Try uploading a file in admin dashboard
   - Check if files display on website

---

## 📝 Variable Name Rules

| What You Have | What It Should Be | Purpose |
|--------------|------------------|---------|
| `value-bord=...` | `CLOUD_API_KEY_FULL=...` | Admin operations |
| `value-site=...` | `CLOUD_API_KEY_READ=...` | Public display |
| `bucket_id=...` | `CLOUD_BUCKET_ID=...` | Reference only |

**Important**: The code looks for these **exact variable names**. Using different names will cause errors!

---

## 🧪 Test Your Setup

### Test 1: Environment Variables Loaded

Create a test file: `test-env.js`

```javascript
// test-env.js
console.log('Base URL:', process.env.CLOUD_API_BASE_URL);
console.log('Admin Key:', process.env.CLOUD_API_KEY_FULL ? '✅ Loaded' : '❌ Missing');
console.log('Public Key:', process.env.CLOUD_API_KEY_READ ? '✅ Loaded' : '❌ Missing');
```

Run:
```bash
node -r dotenv/config test-env.js
```

---

### Test 2: Upload a File

1. Go to admin dashboard
2. Try uploading any file
3. Should see success message with file ID
4. Public URL should be generated

---

### Test 3: View File

Copy the public URL and open in browser. Should display/download the file.

---

## 🚨 Common Errors & Fixes

### Error: "CLOUD_API_KEY_FULL is not defined"

**Fix**: Variable name is wrong. Must be exactly `CLOUD_API_KEY_FULL`

---

### Error: "Upload failed with status 401"

**Fix**: Check that:
1. `.env.local` file exists in project root
2. Variable names are correct
3. API key is correct
4. Server was restarted after adding variables

---

### Error: "File not found (404)"

**Fix**: Check that:
1. File was uploaded successfully
2. File ID is correct
3. Public key is correct in URL

---

## ✅ Checklist

- [ ] `.env.local` file created in project root
- [ ] All three variables added with correct names
- [ ] API keys copied correctly (no extra spaces)
- [ ] Development server restarted
- [ ] Test upload successful
- [ ] Test display successful

---

## 🔒 Security Reminder

**NEVER**:
- Commit `.env.local` to Git
- Share `CLOUD_API_KEY_FULL` publicly
- Use `CLOUD_API_KEY_FULL` in client-side code
- Include API keys in screenshots or documentation

**ALWAYS**:
- Keep `.env.local` in `.gitignore`
- Use `CLOUD_API_KEY_FULL` only in server code
- Use `CLOUD_API_KEY_READ` for public URLs
- Back up `.env.local` securely

---

## 📖 Full Documentation

For complete setup guide, see: `CUSTOM_CLOUD_SETUP.md`

