#!/bin/bash

# SECURITY AUDIT AND CLEANUP SCRIPT
# Created: December 2025
# Purpose: Audit and secure server after DDoS attack incident

SERVER="root@46.224.48.179"

echo "🚨 SECURITY AUDIT FOR SERVER 46.224.48.179"
echo "=========================================="
echo ""
echo "⚠️  This server was used in a DDoS attack on 2025-12-18"
echo "    Target: 37.59.181.219:22 (SSH brute force)"
echo ""

ssh $SERVER << 'ENDSSH'

echo "📋 Step 1: System Information"
echo "=============================="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime)"
echo "Kernel: $(uname -r)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)"
echo ""

echo "👤 Step 2: Checking for Unauthorized Users"
echo "=========================================="
echo "Current users with shell access:"
grep -E ':/bin/(bash|sh)$' /etc/passwd
echo ""
echo "Recently logged in users:"
last -n 20
echo ""
echo "Current logged in users:"
who
echo ""
echo "Failed login attempts (last 50):"
lastb -n 50 2>/dev/null || echo "No failed login records"
echo ""

echo "🔐 Step 3: SSH Security Check"
echo "============================="
echo "SSH configuration:"
grep -E '^(PermitRootLogin|PasswordAuthentication|Port|PubkeyAuthentication)' /etc/ssh/sshd_config
echo ""
echo "Active SSH connections:"
ss -tnp | grep :22 || netstat -tnp | grep :22
echo ""

echo "🔥 Step 4: Firewall Status"
echo "========================="
if command -v ufw >/dev/null 2>&1; then
    echo "UFW Status:"
    ufw status verbose
elif command -v firewalld >/dev/null 2>&1; then
    echo "Firewalld Status:"
    firewall-cmd --list-all
else
    echo "⚠️  No firewall detected!"
fi
echo ""

echo "🌐 Step 5: Network Connections"
echo "=============================="
echo "Active network connections:"
ss -tupn 2>/dev/null | head -30 || netstat -tupn | head -30
echo ""
echo "Listening ports:"
ss -tlnp 2>/dev/null | grep LISTEN || netstat -tlnp | grep LISTEN
echo ""

echo "⚙️  Step 6: Running Processes"
echo "============================"
echo "Top 20 processes by CPU:"
ps aux --sort=-%cpu | head -21
echo ""
echo "Suspicious process check:"
ps aux | grep -E '(bitcoin|miner|xmrig|cgminer|bfgminer|masscan|nmap)' | grep -v grep || echo "No obvious malware processes found"
echo ""

echo "📦 Step 7: Cron Jobs Check"
echo "========================="
echo "Root cron jobs:"
crontab -l 2>/dev/null || echo "No root cron jobs"
echo ""
echo "All user cron jobs:"
for user in $(cut -f1 -d: /etc/passwd); do
    echo "User: $user"
    crontab -u $user -l 2>/dev/null || echo "  No cron jobs"
done
echo ""

echo "📂 Step 8: Recently Modified Files (last 48 hours)"
echo "================================================="
echo "System binaries:"
find /usr/bin /usr/sbin /bin /sbin -type f -mtime -2 2>/dev/null | head -20 || echo "None found"
echo ""
echo "Suspicious locations:"
find /tmp /var/tmp /dev/shm -type f -mtime -2 2>/dev/null | head -20 || echo "None found"
echo ""

echo "🔍 Step 9: Check for Rootkits/Backdoors"
echo "======================================"
echo "Checking for common rootkit files:"
for file in /tmp/.ICE-unix /tmp/.X11-unix /dev/shm/.* /var/tmp/.* ; do
    if [ -f "$file" ]; then
        echo "⚠️  Suspicious file found: $file"
        ls -la "$file"
    fi
done
echo ""

echo "📝 Step 10: System Logs Analysis"
echo "==============================="
echo "Recent auth log entries (last 50):"
tail -50 /var/log/auth.log 2>/dev/null || tail -50 /var/log/secure 2>/dev/null || echo "Cannot read auth logs"
echo ""

echo "🔑 Step 11: SSH Key Check"
echo "========================"
echo "Authorized keys for root:"
if [ -f /root/.ssh/authorized_keys ]; then
    cat /root/.ssh/authorized_keys
else
    echo "No authorized_keys file"
fi
echo ""

echo "📊 Step 12: Disk Usage"
echo "===================="
df -h
echo ""

echo "✅ AUDIT COMPLETE"
echo "================="
echo ""
echo "Next steps:"
echo "1. Review the output above carefully"
echo "2. Look for suspicious users, processes, or files"
echo "3. Run the security hardening script"
echo "4. Change all passwords"
echo ""

ENDSSH

echo ""
echo "🔒 Security audit complete!"
echo ""
echo "Would you like to proceed with hardening? (Run ./secure-server.sh)"
