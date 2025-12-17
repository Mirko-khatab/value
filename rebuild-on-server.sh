#!/bin/bash

echo "🔧 Rebuilding application on production server with environment variables..."
echo ""

SERVER="root@46.224.48.179"
REMOTE_PATH="/root/Documents/value"

ssh $SERVER << 'ENDSSH'
cd /root/Documents/value

echo "📝 Setting environment variables..."
export NODE_ENV=production
export MYSQL_HOST=127.0.0.1
export MYSQL_USER=root
export MYSQL_PASSWORD='gM7-3$F<1&4^!'
export MYSQL_DATABASE=dashboard
export AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc
export AUTH_URL=https://valuearch.com
export AUTH_TRUST_HOST=true
export CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
export CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
export CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
export CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

echo "🏗️  Rebuilding application (this may take a few minutes)..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📁 Copying public and static files to standalone..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "♻️  Restarting PM2..."
pm2 restart valuearch-app

echo ""
echo "✅ Rebuild complete!"
echo ""

sleep 5

echo "🧪 Testing API endpoints..."
echo ""
echo "1. Testing /api/projects/public?limit=2"
curl -s http://localhost:3000/api/projects/public?limit=2 | head -100
echo ""
echo ""
echo "2. Testing /api/footer-properties"
curl -s http://localhost:3000/api/footer-properties | head -100
echo ""

ENDSSH

echo ""
echo "🎉 Done! Check the test results above."
echo "Visit https://valuearch.com to verify the fix."
echo ""
