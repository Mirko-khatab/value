# HTTPS Security & Auth Fix Guide

## Issues Fixed

1. ✅ **UntrustedHost Error**: Added `trustHost: true` to Auth.js configuration
2. ✅ **HTTPS Redirect**: Added middleware to force HTTPS in production
3. ✅ **Security**: All HTTP requests now redirect to HTTPS

## Changes Made

### 1. Updated `auth.ts`

- Added `trustHost: true` to NextAuth configuration
- This allows Auth.js to work with your production domain

### 2. Updated `middleware.ts`

- Added HTTPS redirect middleware
- Checks for `x-forwarded-proto` header (works with most reverse proxies)
- Automatically redirects HTTP to HTTPS in production

## Deployment Steps

### Step 1: Build the Application

```bash
npm run build
```

### Step 2: Deploy to Production Server

**Option A: Using the existing deployment script**

```bash
./deploy-production.sh
```

**Option B: Manual deployment**

```bash
# SSH to your server
ssh root@valuearch.com

# Navigate to project directory
cd /root/Documents/value

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build the project
npm run build

# Restart PM2
pm2 restart valuearch-app
pm2 save
```

### Step 3: Configure Nginx/Apache for HTTPS

Make sure your reverse proxy is configured to:

1. Serve traffic over HTTPS (port 443)
2. Redirect HTTP (port 80) to HTTPS
3. Set the `X-Forwarded-Proto` header

**Example Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name valuearch.com www.valuearch.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name valuearch.com www.valuearch.com;

    ssl_certificate /etc/letsencrypt/live/valuearch.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/valuearch.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: Verify Environment Variables

Make sure your production server has the following environment variables set:

```bash
# On your server
cd /root/Documents/value

# Create .env.production.local file
cat > .env.production.local << 'EOF'
MYSQL_HOST=127.0.0.1
MYSQL_USER=admin
MYSQL_PASSWORD=gM7-3$F<1&4^!
MYSQL_DATABASE=dashboard
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc

CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

# Important: Set NODE_ENV for production
NODE_ENV=production

# Auth.js will now trust the host
AUTH_TRUST_HOST=true
EOF
```

### Step 5: Setup SSL Certificate (if not already done)

If you don't have SSL certificate yet:

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d valuearch.com -d www.valuearch.com

# Auto-renewal (certbot usually sets this up automatically)
sudo certbot renew --dry-run
```

## Testing

After deployment, test the following:

1. **HTTP to HTTPS Redirect**:

   ```bash
   curl -I http://valuearch.com
   # Should return 301 or 302 redirect to https://
   ```

2. **HTTPS Access**:

   ```bash
   curl -I https://valuearch.com
   # Should return 200 OK
   ```

3. **Auth Session**:

   - Open https://valuearch.com
   - Try to login
   - Check browser console for no auth errors

4. **Check PM2 Logs**:
   ```bash
   pm2 logs valuearch-app --lines 50
   # Should show no UntrustedHost errors
   ```

## Troubleshooting

### Still seeing UntrustedHost errors?

1. Check that `NODE_ENV=production` is set
2. Verify `AUTH_TRUST_HOST=true` in environment
3. Restart PM2: `pm2 restart valuearch-app`
4. Clear Next.js cache: `rm -rf .next`

### HTTP still accessible?

1. Check Nginx/Apache configuration
2. Verify SSL certificate is valid
3. Ensure port 80 redirects to 443

### Auth still not working?

1. Check `AUTH_SECRET` is set and matches across deployments
2. Verify database connection
3. Check PM2 logs for other errors

## Quick Deploy Command

For fastest deployment:

```bash
# On your local machine, commit and push
git add .
git commit -m "Fix HTTPS redirect and auth trust host"
git push origin main

# On your server
ssh root@valuearch.com "cd /root/Documents/value && git pull && npm install && npm run build && pm2 restart valuearch-app"
```

## Security Notes

- ✅ HTTPS is now enforced in production
- ✅ All HTTP traffic redirects to HTTPS
- ✅ Auth.js trusts your production domain
- ✅ No plain HTTP connections allowed
- 🔒 Make sure to keep your SSL certificate up to date
- 🔒 Consider adding HSTS header for additional security

## Next Steps

After successful deployment:

1. Monitor PM2 logs for any errors
2. Test all authentication flows
3. Verify API endpoints work correctly
4. Check that all images and assets load properly




