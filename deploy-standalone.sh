#!/bin/bash

echo "🚀 Deploying Standalone Build to Production..."
echo ""

# Configuration
SERVER="root@46.224.48.179"
REMOTE_PATH="/root/Documents/value"

echo "📦 Step 1: Building locally with standalone output..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📁 Step 2: Preparing standalone bundle..."
# Copy public and static to standalone
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo ""
echo "📤 Step 3: Uploading standalone build to server..."

# Stop PM2 first
ssh $SERVER "pm2 stop valuearch-app"

# Upload the complete standalone build
rsync -avz --delete \
  .next/standalone/ $SERVER:$REMOTE_PATH/.next/standalone/

# Also upload package files for reference
rsync -avz \
  package.json \
  package-lock.json \
  $SERVER:$REMOTE_PATH/

echo ""
echo "♻️  Step 4: Restarting PM2 with new build..."

ssh $SERVER << 'ENDSSH'
cd /root/Documents/value

# Restart PM2 with environment update
pm2 restart valuearch-app --update-env

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking status..."
pm2 status valuearch-app

echo ""
echo "📝 Recent logs (waiting 3 seconds for startup)..."
sleep 3
pm2 logs valuearch-app --lines 30 --nostream

ENDSSH

echo ""
echo "🎉 Deployment finished!"
echo "Visit https://valuearch.com to test"
echo ""
echo "🔍 To monitor logs in real-time:"
echo "   ssh $SERVER pm2 logs valuearch-app"
echo ""
