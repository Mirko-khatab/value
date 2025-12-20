#!/bin/bash

echo "🔧 Setting up Production Environment Variables..."
echo ""

# Configuration
SERVER="root@46.224.48.179"
REMOTE_PATH="/root/Documents/value"

echo "📝 Creating .env file on production server..."

ssh $SERVER << 'ENDSSH'
cd /root/Documents/value

# Create .env file with production values
cat > .env << 'EOF'
# Database Configuration
MYSQL_HOST=127.0.0.1
MYSQL_USER=admin
MYSQL_PASSWORD=gM7-3$F<1&4^!
MYSQL_DATABASE=dashboard

# Auth.js Configuration
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc
AUTH_URL=https://valuearch.com
AUTH_TRUST_HOST=true

# Cloud Storage Configuration
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

# Environment
NODE_ENV=production
EOF

echo "✅ .env file created successfully"
echo ""
echo "📋 Verifying .env file:"
cat .env
echo ""

ENDSSH

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: ./deploy-production.sh"
echo "2. Or manually restart: ssh $SERVER 'cd $REMOTE_PATH && pm2 restart valuearch-app --update-env'"
echo ""




