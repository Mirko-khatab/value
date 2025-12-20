#!/bin/bash

echo "🚀 Quick Deploy to Production (Pre-built)..."
echo ""

# Configuration
SERVER="root@46.224.48.179"
REMOTE_PATH="/root/Documents/value"

echo "📦 Building locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📤 Uploading built files to server..."

# Upload only the necessary files
rsync -avz --delete \
  .next/ $SERVER:$REMOTE_PATH/.next/

rsync -avz --delete \
  public/ $SERVER:$REMOTE_PATH/public/

rsync -avz \
  package.json \
  package-lock.json \
  $SERVER:$REMOTE_PATH/

echo ""
echo "🔧 Setting up on server..."

ssh $SERVER << 'ENDSSH'
cd /root/Documents/value

echo "📦 Installing production dependencies..."
npm install --production --omit=dev

echo "📁 Copying public and static files to standalone..."
mkdir -p .next/standalone
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

echo "♻️  Restarting PM2 with environment update..."
pm2 restart valuearch-app --update-env

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking status..."
pm2 status valuearch-app

echo ""
echo "📝 Recent logs:"
pm2 logs valuearch-app --lines 30 --nostream

ENDSSH

echo ""
echo "🎉 Deployment finished!"
echo "Visit https://valuearch.com to test"
echo ""




