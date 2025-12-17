#!/usr/bin/env node

// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('📝 Loading environment variables from .env file...');
  const envFile = fs.readFileSync(envPath, 'utf8');
  
  envFile.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
        console.log(`  ✓ Set ${key}`);
      }
    }
  });
  
  console.log('✅ Environment variables loaded\n');
} else {
  console.log('⚠️  No .env file found, using PM2 environment variables\n');
}

// Verify critical environment variables
const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

console.log('🚀 Starting Next.js server...\n');

// Start the actual Next.js server
require('./.next/standalone/server.js');
