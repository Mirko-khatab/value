#!/bin/bash

echo "🚀 Quick Deploy - Responsive & Music Fixes"
echo ""
echo "This will:"
echo "  1. Commit your changes"
echo "  2. Push to git"
echo "  3. Deploy to production server"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "📝 Step 1: Committing changes..."
git add app/layout.tsx app/ui/global-audio-player.tsx
git commit -m "Fix: Add viewport meta tag and improve music autoplay

- Added viewport metadata for responsive design
- Fixed music autoplay on subsequent visits
- Improved mobile audio controls sizing
- Added retry logic for better autoplay success"

echo ""
echo "📤 Step 2: Pushing to repository..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Git push failed. Please resolve conflicts and try again."
    exit 1
fi

echo ""
echo "🌐 Step 3: Deploying to production..."
echo "Enter your server password when prompted..."
echo ""

ssh root@46.224.48.179 << 'ENDSSH'
cd /root/Documents/value

echo "📥 Pulling latest changes..."
git pull origin main

echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

echo "📁 Copying public files..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "♻️  Restarting PM2..."
pm2 restart valuearch-app

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Application status:"
pm2 status valuearch-app

echo ""
echo "📝 Recent logs:"
pm2 logs valuearch-app --lines 10 --nostream

ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "🧪 Test your site:"
    echo "  1. Visit https://valuearch.com on mobile"
    echo "  2. Check if page scales correctly"
    echo "  3. Test music on homepage (after intro)"
    echo "  4. Navigate to /projects - music should continue"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Check errors above."
    exit 1
fi

