#!/bin/bash

echo "🚀 Deploying Umrah Project Updates"
echo "=================================="
echo ""

SERVER="root@46.224.48.179"
PROJECT_PATH="/root/Documents/umrah"

echo "📡 Connecting to server..."
ssh $SERVER << 'ENDSSH'

echo "📂 Navigating to project directory..."
cd /root/Documents/umrah

echo ""
echo "📥 Pulling latest changes from GitHub..."
git fetch origin

# Handle conflicts automatically (keep server ecosystem.config.js)
echo "🔧 Checking for conflicts..."
git stash
git pull origin main

# Keep server version of ecosystem.config.js (production config)
if git stash list | grep -q "stash@{0}"; then
    git checkout stash@{0} -- ecosystem.config.js 2>/dev/null || true
    git stash drop 2>/dev/null || true
fi

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed! Check the errors above."
    exit 1
fi

echo "✅ Code updated successfully"

echo ""
echo "📦 Installing/updating dependencies..."
npm install

echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

echo ""
echo "🔄 Restarting PM2 application..."
pm2 restart umrah-app

echo ""
echo "⏳ Waiting for application to start..."
sleep 5

echo ""
echo "📊 Current status:"
pm2 status umrah-app

echo ""
echo "📝 Recent logs:"
pm2 logs umrah-app --lines 20 --nostream

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Visit: https://umrah.mirkokawa.dev"
echo ""

ENDSSH

if [ $? -eq 0 ]; then
    echo "🎉 Umrah project updated successfully!"
    echo ""
    echo "Test your changes at: https://umrah.mirkokawa.dev"
else
    echo "❌ Deployment failed. Check the errors above."
    exit 1
fi
