#!/bin/bash

# Complete Server Fix Script
# Run this on your LOCAL machine

echo "🔧 Fixing server configuration..."
echo ""

sshpass -p "$1" ssh root@46.224.48.179 << 'ENDSSH' || ssh root@46.224.48.179 << 'ENDSSH'

echo "Fixing Umrah Nginx config..."
cat > /etc/nginx/sites-available/umrah.mirkokawa.dev << 'EOF'
server {
    listen 80;
    server_name umrah.mirkokawa.dev;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
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
EOF

echo "Testing Nginx..."
nginx -t && systemctl reload nginx

echo ""
echo "✅ Fixed! Access phpMyAdmin at:"
echo "   https://valuearch.com/phpmyadmin"
echo ""
echo "Login: phpmyadmin / PhpMyAdmin2024Pass"

ENDSSH

echo ""
echo "✅ Done!"




