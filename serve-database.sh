#!/bin/bash

# Alternative Upload Method - Using Python Web Server
# This will serve the file from your Mac so the server can download it

echo "🌐 ALTERNATIVE DATABASE UPLOAD METHOD"
echo "======================================"
echo ""
echo "This will:"
echo "1. Start a web server on your Mac (port 8000)"
echo "2. Provide commands to download the file from the server"
echo ""

cd /Users/miko/Desktop

echo "✅ Found database file:"
ls -lh value-grng.sql

echo ""
echo "🚀 Starting web server on port 8000..."
echo "   (Press Ctrl+C when done)"
echo ""
echo "📋 COPY THIS AND RUN IN HETZNER CONSOLE:"
echo "=========================================="
echo ""
echo "# Get your Mac's public IP"
echo "YOUR_MAC_IP='$(curl -s ifconfig.me)'"
echo ""
echo "wget http://\$YOUR_MAC_IP:8000/value-grng.sql -O /tmp/dashboard.sql"
echo ""
echo "# Or use this direct command:"
echo "wget http://$(curl -s ifconfig.me):8000/value-grng.sql -O /tmp/dashboard.sql"
echo ""
echo "# Then import:"
echo "mysql -u root -p'gM7-3\$F<1&4^!' dashboard < /tmp/dashboard.sql"
echo "pm2 restart valuearch-app"
echo ""
echo "=========================================="
echo ""
echo "⚠️  Make sure port 8000 is open in your Mac's firewall!"
echo ""

# Start Python web server
python3 -m http.server 8000




