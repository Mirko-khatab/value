# 🔐 Login Credentials

## Local Development

### **Login URL:**
```
http://localhost:3000/login
```

### **Credentials:**
- **Email:** `admin@valuearch.com`
- **Password:** `admin123`

---

## Production Server

### **Login URL:**
```
https://valuearch.com/login
```

### **Credentials:**
- **Email:** `admin@valuearch.com`
- **Password:** `admin123`

---

## Reset Password (if needed)

### **Option 1: Using MySQL Directly**

```bash
# Generate new password hash
cd /Users/miko/Documents/web/value
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('your_new_password', 10, (err, hash) => {
  console.log(hash);
});
"

# Update in database (LOCAL)
mysql -u root -padmin123 dashboard -e "
  UPDATE users 
  SET password = 'PASTE_HASH_HERE' 
  WHERE email = 'admin@valuearch.com';
"

# Update in database (PRODUCTION)
ssh mirko@195.90.209.92
mysql -u root -p'gM7-3$F<1&4^!' dashboard -e "
  UPDATE users 
  SET password = 'PASTE_HASH_HERE' 
  WHERE email = 'admin@valuearch.com';
"
```

### **Option 2: Using Script**

Run the `reset-admin-password.js` script:

```bash
node reset-admin-password.js
```

---

## Create New Admin User

```bash
# Generate password hash first
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('new_password', 10, (err, hash) => {
  console.log(hash);
});
"

# Insert new user (LOCAL)
mysql -u root -padmin123 dashboard -e "
  INSERT INTO users (id, name, email, password) 
  VALUES (
    UUID(), 
    'New Admin', 
    'newemail@example.com', 
    'PASTE_HASH_HERE'
  );
"
```

---

## Troubleshooting Login Issues

### **Problem: "Invalid credentials"**

**Solution:**
1. Check email is exactly: `admin@valuearch.com` (no spaces)
2. Check password is: `admin123`
3. Reset password using commands above

### **Problem: "Redirect loop" or "Loading forever"**

**Solution:**
1. Check `.env` file has correct `AUTH_SECRET`
2. Check `AUTH_URL` matches your domain
3. Clear browser cookies and cache
4. Restart the application:
   ```bash
   # Local
   # Stop (Ctrl+C) and restart: npm run dev
   
   # Production
   pm2 restart valuearch-app
   ```

### **Problem: "User not found"**

**Solution:**
```bash
# Check if user exists
mysql -u root -padmin123 dashboard -e "
  SELECT * FROM users WHERE email = 'admin@valuearch.com';
"

# If no user, create one:
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) return console.error(err);
  console.log(\`
  INSERT INTO users (id, name, email, password) 
  VALUES ('admin-1', 'Admin', 'admin@valuearch.com', '\${hash}');
  \`);
});
"
```

---

## Security Notes

- ⚠️ **Change default password** after first login!
- ⚠️ Use strong passwords in production
- ⚠️ Never commit `.env` files with real credentials
- ⚠️ Keep `AUTH_SECRET` secure and unique

---

## Current Status

✅ **Local Development:**
- Database: `dashboard` on localhost
- User: `admin@valuearch.com`
- Password: `admin123` (bcrypt hashed)

🚀 **Production:**
- Database: `dashboard` on server
- User: `admin@valuearch.com`  
- Password: **Needs to be set on production server!**

---

## To Update Production Password:

```bash
# SSH into server
ssh mirko@195.90.209.92

# Generate hash
cd /var/www/dashboard/value
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) return console.error(err);
  console.log(hash);
});
"

# Copy the hash output, then:
mysql -u root -p'gM7-3$F<1&4^!' dashboard -e "
  UPDATE users 
  SET password = 'PASTE_HASH_HERE' 
  WHERE email = 'admin@valuearch.com';
"

# Restart app
pm2 restart valuearch-app
```

---

**✅ You're all set!**

Login at: http://localhost:3000/login (local) or https://valuearch.com/login (production)
