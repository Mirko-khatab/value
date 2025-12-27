#!/bin/bash

echo "🚀 Deploying to Production Server..."
echo ""

# Configuration
SERVER="root@167.235.28.79"
REMOTE_PATH="/root/Documents/value"

echo "📦 Step 1: Building locally..."
npm run build

echo ""
echo "📤 Step 2: Uploading files to server..."

# Upload the files
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ $SERVER:$REMOTE_PATH/

echo ""
echo "🔧 Step 3: Setting up on server..."

ssh $SERVER << 'ENDSSH'
cd /root/Documents/value

echo "📦 Installing dependencies..."
npm install --production

echo "🏗️  Building application..."
npm run build

echo "📁 Copying public files to standalone..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "♻️  Restarting PM2..."
pm2 restart valuearch-app

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking status..."
pm2 status valuearch-app

echo ""
echo "📝 Recent logs:"
pm2 logs valuearch-app --lines 20 --nostream

ENDSSH

echo ""
echo "🎉 Deployment finished!"
echo "Visit https://valuearch.com to test"
echo ""

