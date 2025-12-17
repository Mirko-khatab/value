#!/bin/bash

# Deploy HTTPS Security Fix to Production
# This script deploys the HTTPS redirect and auth fixes

set -e  # Exit on any error

echo "🔐 Deploying HTTPS Security Fix..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="root"
SERVER_HOST="valuearch.com"
PROJECT_DIR="/root/Documents/value"
APP_NAME="valuearch-app"

echo -e "${BLUE}Step 1: Building locally...${NC}"
npm run build
echo -e "${GREEN}✓ Local build complete${NC}"
echo ""

echo -e "${BLUE}Step 2: Committing changes...${NC}"
git add auth.ts middleware.ts HTTPS_SECURITY_FIX.md deploy-https-fix.sh
git commit -m "Fix: Add HTTPS redirect and auth trust host for production"
echo -e "${GREEN}✓ Changes committed${NC}"
echo ""

echo -e "${BLUE}Step 3: Pushing to remote...${NC}"
git push origin main
echo -e "${GREEN}✓ Pushed to remote${NC}"
echo ""

echo -e "${BLUE}Step 4: Deploying to server...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
cd /root/Documents/value

echo "📦 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building production bundle..."
npm run build

echo "⚙️  Checking environment variables..."
if [ ! -f .env.production.local ]; then
    echo "⚠️  Warning: .env.production.local not found!"
    echo "Creating from env.txt..."
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

NODE_ENV=production
AUTH_TRUST_HOST=true
EOF
fi

echo "🔄 Restarting PM2..."
pm2 restart valuearch-app
pm2 save

echo "✅ Deployment complete!"

echo ""
echo "📊 PM2 Status:"
pm2 list

ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}Testing HTTPS redirect...${NC}"
curl -I http://${SERVER_HOST} 2>/dev/null | head -n 1 || echo "Could not test HTTP redirect"
echo ""

echo -e "${BLUE}Checking PM2 logs for errors...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} "pm2 logs ${APP_NAME} --lines 20 --nostream"

echo ""
echo -e "${GREEN}🎉 All done!${NC}"
echo ""
echo "Next steps:"
echo "1. Visit https://${SERVER_HOST} to verify HTTPS works"
echo "2. Try to access http://${SERVER_HOST} to verify redirect"
echo "3. Test login functionality"
echo "4. Monitor logs: pm2 logs ${APP_NAME}"
