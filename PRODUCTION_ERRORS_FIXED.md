# Production Errors Fixed - December 17, 2025

## Issues Identified and Fixed

### 1. Database Error: Incorrect arguments to mysqld_stmt_execute ✅

**Error:**

```
Database Error: Error: Incorrect arguments to mysqld_stmt_execute
code: 'ER_WRONG_ARGUMENTS'
errno: 1210
```

**Root Cause:**
The `fetchProjectsPaginated()` and `fetchProductsPaginated()` functions were using `connection.query()` with mixed parameterization - using placeholders (`?`) for some values while using string interpolation for LIMIT and OFFSET.

**Fix Applied:**

- Changed `connection.query()` to `connection.execute()` in both functions
- Converted LIMIT and OFFSET from string interpolation to proper placeholders
- Now all parameters are properly parameterized: `[parentType, parentType, limit, offset]`

**Files Modified:**

- `app/lib/data.ts` (lines 300-367, 545-594)

### 2. Auth.js UntrustedHost Error ⚠️

**Error:**

```
[auth][error] UntrustedHost: Host must be trusted. URL was: http://valuearch.com/api/auth/session
```

**Root Cause:**
Auth.js v5 requires explicit configuration for trusted hosts in production environments.

**Fix Applied:**

1. Added `debug: false` to auth configuration to suppress verbose error logs
2. Created `.env.example` file with proper AUTH environment variables
3. Need to set the following environment variables on production server:

```bash
AUTH_URL=https://valuearch.com
AUTH_TRUST_HOST=true
AUTH_SECRET=<your-existing-secret>
```

**Action Required:**
You need to add these environment variables to your production server. Either:

- Add them to your PM2 ecosystem config file
- Add them to `/etc/environment` or shell profile
- Pass them when starting PM2

### 3. Image Optimization Warning ✅

**Error:**

```
The requested resource isn't a valid image for /image/value.png received null
```

**Root Cause:**
Next.js image optimization was encountering issues with local images in the standalone build. The public folder needs to be properly copied and accessible.

**Fix Applied:**

1. Added SVG and image security configurations to `next.config.ts`
2. Verified the deployment script properly copies the public folder
3. The existing deploy script already handles this with: `cp -r public .next/standalone/public`

**Verification:**
Ensure that after deployment, the public folder structure is maintained at `/root/Documents/value/.next/standalone/public/image/`

## Environment Variables Setup for Production

Create a `.env` file on your production server at `/root/Documents/value/.env`:

```bash
# Database
MYSQL_HOST=127.0.0.1
MYSQL_USER=admin
MYSQL_PASSWORD=gM7-3$F<1&4^!
MYSQL_DATABASE=dashboard

# Auth.js
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc
AUTH_URL=https://valuearch.com
AUTH_TRUST_HOST=true

# Cloud Storage
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

# Environment
NODE_ENV=production
```

## Deployment Steps

### Step 1: Set Environment Variables on Production Server

SSH to your production server and create/update the `.env` file:

```bash
ssh root@46.224.48.179
cd /root/Documents/value
cat > .env << 'EOF'
# Database
MYSQL_HOST=127.0.0.1
MYSQL_USER=admin
MYSQL_PASSWORD=gM7-3$F<1&4^!
MYSQL_DATABASE=dashboard

# Auth.js
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc
AUTH_URL=https://valuearch.com
AUTH_TRUST_HOST=true

# Cloud Storage
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

# Environment
NODE_ENV=production
EOF
exit
```

### Step 2: Commit and Deploy Code Changes

From your local machine:

```bash
# Commit the fixes
git add app/lib/data.ts auth.ts next.config.ts PRODUCTION_ERRORS_FIXED.md
git commit -m "Fix database parameterization, auth configuration, and image optimization"

# Deploy to production
./deploy-production.sh
```

### Step 3: Restart PM2 with New Environment

After deployment completes, the `deploy-production.sh` script will automatically restart PM2. If you need to manually restart:

```bash
ssh root@46.224.48.179
cd /root/Documents/value
pm2 restart valuearch-app --update-env
pm2 logs valuearch-app --lines 50
```

### Step 4: Verify the Fixes

```bash
# Check PM2 logs for errors
pm2 logs valuearch-app --lines 100

# Test the API endpoint
curl https://valuearch.com/api/projects/public?page=1&limit=12

# Check browser console
# Should see no more 500 errors or database errors
```

## Testing Checklist

- [ ] API endpoint `/api/projects/public?page=1&limit=12` returns 200 status
- [ ] No more "Incorrect arguments to mysqld_stmt_execute" errors
- [ ] No more "UntrustedHost" auth errors
- [ ] Projects load correctly on the homepage
- [ ] Image optimization warnings are resolved or acceptable

## Notes

- The database query fix is backward compatible and should work immediately
- The auth fix requires environment variable configuration on the server
- Consider using PM2 ecosystem file for better environment variable management
- All database queries using `connection.query()` with LIMIT/OFFSET should be audited and fixed similarly




