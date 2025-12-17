# Environment Variables Setup Guide

## Overview

This guide explains how to properly configure environment variables for both local development and production deployment of the Value Architecture application.

## Environment Variables

### Required Variables

#### Database Configuration

```bash
MYSQL_HOST=127.0.0.1          # Database host
MYSQL_USER=admin              # Database user
MYSQL_PASSWORD=your_password  # Database password
MYSQL_DATABASE=dashboard      # Database name
```

#### Auth.js Configuration

```bash
AUTH_SECRET=your_secret_here          # Secret key for signing tokens
AUTH_URL=https://valuearch.com        # Full URL of your application
AUTH_TRUST_HOST=true                  # Trust the host for production
```

#### Cloud Storage Configuration

```bash
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=your_bucket_id
CLOUD_API_KEY_FULL=your_full_access_key
CLOUD_API_KEY_READ=your_read_only_key
```

#### Environment

```bash
NODE_ENV=production  # Set to 'development' for local, 'production' for server
```

## Setup Instructions

### Local Development

1. Create a `.env.local` file in the project root:

   ```bash
   cd /Users/miko/Documents/web/value
   nano .env.local
   ```

2. Add the following (adjust values as needed):

   ```bash
   MYSQL_HOST=localhost
   MYSQL_USER=admin
   MYSQL_PASSWORD=your_local_password
   MYSQL_DATABASE=dashboard

   AUTH_SECRET=your_local_secret
   AUTH_URL=http://localhost:3000
   AUTH_TRUST_HOST=true

   CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
   CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
   CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
   CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Production Server

#### Option 1: Using .env file (Recommended)

1. SSH to production server:

   ```bash
   ssh root@46.224.48.179
   ```

2. Create `.env` file:

   ```bash
   cd /root/Documents/value
   nano .env
   ```

3. Add production values:

   ```bash
   MYSQL_HOST=127.0.0.1
   MYSQL_USER=admin
   MYSQL_PASSWORD=gM7-3$F<1&4^!
   MYSQL_DATABASE=dashboard

   AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc
   AUTH_URL=https://valuearch.com
   AUTH_TRUST_HOST=true

   CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
   CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
   CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
   CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

   NODE_ENV=production
   ```

4. Restart the application:
   ```bash
   pm2 restart valuearch-app --update-env
   ```

#### Option 2: Using PM2 Ecosystem File

1. Create `ecosystem.config.js` in the project root:

   ```javascript
   module.exports = {
     apps: [
       {
         name: "valuearch-app",
         script: "node",
         args: ".next/standalone/server.js",
         cwd: "/root/Documents/value",
         instances: 1,
         autorestart: true,
         watch: false,
         max_memory_restart: "1G",
         env: {
           NODE_ENV: "production",
           PORT: 3000,
           MYSQL_HOST: "127.0.0.1",
           MYSQL_USER: "admin",
           MYSQL_PASSWORD: "gM7-3$F<1&4^!",
           MYSQL_DATABASE: "dashboard",
           AUTH_SECRET: "asdjfskjdfljspfasldjkfleeygc",
           AUTH_URL: "https://valuearch.com",
           AUTH_TRUST_HOST: "true",
           CLOUD_API_BASE_URL: "https://cloud.mirkokawa.dev/api",
           CLOUD_BUCKET_ID: "b843b188-87d6-4c8e-b2aa-eb2ebc65c362",
           CLOUD_API_KEY_FULL:
             "18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13",
           CLOUD_API_KEY_READ:
             "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d",
         },
       },
     ],
   };
   ```

2. Start with PM2:
   ```bash
   pm2 delete valuearch-app
   pm2 start ecosystem.config.js
   pm2 save
   ```

#### Option 3: System-wide Environment Variables

1. Add to `/etc/environment`:

   ```bash
   sudo nano /etc/environment
   ```

2. Add the variables:

   ```bash
   AUTH_URL="https://valuearch.com"
   AUTH_TRUST_HOST="true"
   AUTH_SECRET="asdjfskjdfljspfasldjkfleeygc"
   ```

3. Reload and restart:
   ```bash
   source /etc/environment
   pm2 restart valuearch-app
   ```

## Verification

### Check if environment variables are loaded:

```bash
# In production server
pm2 logs valuearch-app | grep -i auth
pm2 logs valuearch-app | grep -i mysql

# Or check process environment
pm2 show valuearch-app
```

### Test the application:

```bash
# Test API endpoint
curl https://valuearch.com/api/projects/public?page=1&limit=12

# Check for errors in logs
pm2 logs valuearch-app --err --lines 50
```

## Troubleshooting

### Issue: Auth errors still appearing

**Solution:** Ensure AUTH_URL matches exactly with your domain and protocol (http vs https)

```bash
# Check current environment
pm2 env 0

# Restart with environment update
pm2 restart valuearch-app --update-env
```

### Issue: Database connection errors

**Solution:** Verify MySQL is running and credentials are correct

```bash
# Test MySQL connection
mysql -h 127.0.0.1 -u admin -p dashboard

# Check MySQL status
systemctl status mysql
```

### Issue: Environment variables not loading

**Solution:** Check file permissions and PM2 configuration

```bash
# Check .env file exists and is readable
ls -la .env
cat .env

# Reload PM2 daemon
pm2 kill
pm2 start npm --name valuearch-app -- start
```

## Security Notes

1. **Never commit `.env` files to git** - They contain sensitive credentials
2. **Use different secrets for development and production**
3. **Rotate AUTH_SECRET periodically** for better security
4. **Restrict database user permissions** to only what's needed
5. **Use environment-specific API keys** when possible

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Auth.js Configuration](https://authjs.dev/reference/core#authconfig)
- [PM2 Environment Variables](https://pm2.keymetrics.io/docs/usage/environment/)
