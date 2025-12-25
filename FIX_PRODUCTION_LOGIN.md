# 🔐 Fix Production Login - valuearch.com

## ✅ Local is Fixed!

Your local development login now works:

- **URL:** http://localhost:3000/login
- **Email:** `admin@valuearch.com`
- **Password:** `admin123`

---

## 🚀 Fix Production Server

You need to update the password on your production server at `valuearch.com`.

### **Method 1: Simple Copy-Paste (Recommended)**

1. **SSH into your server:**

   ```bash
   ssh mirko@195.90.209.92
   # Password: mirko123
   ```

2. **Generate password hash:**

   ```bash
   cd /var/www/dashboard/value

   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10, (err, hash) => { if (err) return console.error(err); console.log(hash); });"
   ```

3. **Copy the hash** (it looks like: `$2b$10$...`)

4. **Update database:**

   ```bash
   mysql -u root -p'gM7-3$F<1&4^!' dashboard -e "UPDATE users SET password = 'PASTE_YOUR_HASH_HERE' WHERE email = 'admin@valuearch.com';"
   ```

5. **Verify:**

   ```bash
   mysql -u root -p'gM7-3$F<1&4^!' dashboard -e "SELECT id, name, email FROM users WHERE email = 'admin@valuearch.com';"
   ```

6. **Restart app:**

   ```bash
   pm2 restart valuearch-app
   ```

7. **Test login:**
   - Go to: https://valuearch.com/login
   - Email: `admin@valuearch.com`
   - Password: `admin123`

---

### **Method 2: Complete Commands (Copy All at Once)**

SSH into server, then paste all these commands:

```bash
# Navigate to project
cd /var/www/dashboard/value

# Generate hash and update database
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10, (err, hash) => { if (err) return console.error(err); const mysql = require('mysql2'); const conn = mysql.createConnection({ host: 'localhost', user: 'root', password: 'gM7-3\$F<1&4^!', database: 'dashboard' }); conn.query('UPDATE users SET password = ? WHERE email = ?', [hash, 'admin@valuearch.com'], (err) => { if (err) console.error(err); else console.log('✅ Password updated!'); conn.end(); }); });"

# Restart app
pm2 restart valuearch-app

# Show user
mysql -u root -p'gM7-3$F<1&4^!' dashboard -e "SELECT id, name, email FROM users WHERE email = 'admin@valuearch.com';"

echo "✅ Done! Login at: https://valuearch.com/login"
echo "   Email: admin@valuearch.com"
echo "   Password: admin123"
```

---

### **Method 3: Via Hetzner Console** (If SSH blocked)

1. Go to https://console.hetzner.cloud
2. Select your server
3. Click "Console"
4. Login as `mirko` / `mirko123`
5. Run the commands from Method 2

---

## 🧪 Test Login

After updating the production password:

1. **Go to:** https://valuearch.com/login
2. **Enter:**
   - Email: `admin@valuearch.com`
   - Password: `admin123`
3. **Click:** "Log in"
4. **You should be redirected to:** https://valuearch.com/dashboard

---

## 🐛 Troubleshooting

### **Problem: Still can't login**

**Check these:**

1. **Is the user in the database?**

   ```bash
   mysql -u root -p'gM7-3$F<1&4^!' dashboard -e "SELECT * FROM users;"
   ```

2. **Is the .env file correct?**

   ```bash
   cat /var/www/dashboard/value/.env | grep AUTH
   ```

   Should show:

   ```
   AUTH_SECRET=ImNUCn0j+wg3bMZLb0Vdssdr/w/enyMZsoVQKzt68F0=
   AUTH_URL=https://valuearch.com
   AUTH_TRUST_HOST=true
   ```

3. **Check app logs:**

   ```bash
   pm2 logs valuearch-app --lines 50
   ```

4. **Restart with fresh cache:**
   ```bash
   cd /var/www/dashboard/value
   rm -rf .next
   npm run build
   pm2 restart valuearch-app
   ```

### **Problem: "Invalid credentials" error**

- Double-check email: `admin@valuearch.com` (exactly, no spaces)
- Password is case-sensitive: `admin123`
- Try resetting password again using Method 1

### **Problem: Page redirects but doesn't show dashboard**

- Clear browser cookies
- Check PM2 logs: `pm2 logs valuearch-app`
- Verify app is running: `pm2 status`

---

## 📋 Quick Reference

### **Local Development**

```
URL: http://localhost:3000/login
Email: admin@valuearch.com
Password: admin123
```

### **Production**

```
URL: https://valuearch.com/login
Email: admin@valuearch.com
Password: admin123 (after you update it)
```

---

## 🔒 After First Login

**Change the default password!**

1. Login to dashboard
2. Go to user settings
3. Change password to something secure
4. Keep it safe!

---

**Ready to fix production? Follow Method 1 or 2 above!** 🚀
