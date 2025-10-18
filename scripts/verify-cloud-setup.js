#!/usr/bin/env node
/**
 * Cloud Storage Setup Verification Script
 * 
 * This script verifies that your cloud storage integration is correctly configured.
 * Run with: node scripts/verify-cloud-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Cloud Storage Setup Verification\n');
console.log('=' .repeat(50));

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

let hasErrors = false;
let hasWarnings = false;

// Check 1: .env.local exists
console.log('\n✓ Checking .env.local file...');
if (!fs.existsSync(envPath)) {
  console.error('  ❌ ERROR: .env.local file not found!');
  console.log('  → Create .env.local in your project root');
  console.log('  → See ENV_SETUP_REFERENCE.md for template');
  hasErrors = true;
} else {
  console.log('  ✅ .env.local exists');
  
  // Read .env.local
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Check 2: Required variables exist
  console.log('\n✓ Checking required environment variables...');
  
  const requiredVars = [
    { name: 'CLOUD_API_BASE_URL', description: 'Cloud storage API base URL' },
    { name: 'CLOUD_API_KEY_FULL', description: 'Admin API key (value-bord)' },
    { name: 'CLOUD_API_KEY_READ', description: 'Public API key (value-site)' },
  ];
  
  requiredVars.forEach(({ name, description }) => {
    const regex = new RegExp(`^${name}=.+`, 'm');
    if (!regex.test(envContent)) {
      console.error(`  ❌ ERROR: ${name} not found`);
      console.log(`  → Add: ${name}=your-${name.toLowerCase()}-value`);
      console.log(`  → Description: ${description}`);
      hasErrors = true;
    } else {
      console.log(`  ✅ ${name} found`);
      
      // Extract value
      const match = envContent.match(new RegExp(`^${name}=(.+)`, 'm'));
      if (match && match[1]) {
        const value = match[1].trim();
        
        // Check for common mistakes
        if (value.startsWith('"') || value.startsWith("'")) {
          console.warn(`  ⚠️  WARNING: ${name} has quotes - remove them`);
          console.log(`  → Change: ${name}="${value.slice(1, -1)}"`);
          console.log(`  → To:     ${name}=${value.slice(1, -1)}`);
          hasWarnings = true;
        }
        
        if (value.length < 10 && name !== 'CLOUD_API_BASE_URL') {
          console.warn(`  ⚠️  WARNING: ${name} looks too short`);
          console.log(`  → Expected: Long API key (64+ characters)`);
          console.log(`  → Current:  ${value.length} characters`);
          hasWarnings = true;
        }
        
        if (name === 'CLOUD_API_BASE_URL' && !value.startsWith('http')) {
          console.error(`  ❌ ERROR: ${name} should start with http:// or https://`);
          console.log(`  → Expected: https://cloud.mirkokawa.dev/api`);
          console.log(`  → Current:  ${value}`);
          hasErrors = true;
        }
      }
    }
  });
  
  // Check 3: Wrong variable names (common mistakes)
  console.log('\n✓ Checking for common mistakes...');
  
  const wrongVars = ['value-bord', 'value-site', 'bucket_id'];
  let foundWrongVars = false;
  
  wrongVars.forEach(wrongName => {
    const regex = new RegExp(`^${wrongName}=`, 'm');
    if (regex.test(envContent)) {
      console.error(`  ❌ ERROR: Found "${wrongName}" - wrong variable name!`);
      
      if (wrongName === 'value-bord') {
        console.log(`  → Change "${wrongName}=" to "CLOUD_API_KEY_FULL="`);
      } else if (wrongName === 'value-site') {
        console.log(`  → Change "${wrongName}=" to "CLOUD_API_KEY_READ="`);
      } else if (wrongName === 'bucket_id') {
        console.log(`  → Change "${wrongName}=" to "CLOUD_BUCKET_ID="`);
      }
      
      foundWrongVars = true;
      hasErrors = true;
    }
  });
  
  if (!foundWrongVars) {
    console.log('  ✅ No wrong variable names found');
  }
}

// Check 4: Key files exist
console.log('\n✓ Checking integration files...');

const requiredFiles = [
  'app/lib/cloud-storage.ts',
  'app/lib/cloud-upload-client.ts',
  'app/api/cloud/upload/route.ts',
  'app/api/cloud/files/[fileId]/route.ts',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ ERROR: ${file} not found`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${file} exists`);
  }
});

// Check 5: Documentation files
console.log('\n✓ Checking documentation...');

const docFiles = [
  'CUSTOM_CLOUD_SETUP.md',
  'ENV_SETUP_REFERENCE.md',
  'CLOUD_INTEGRATION_SUMMARY.md',
];

docFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  WARNING: ${file} not found`);
    hasWarnings = true;
  } else {
    console.log(`  ✅ ${file} exists`);
  }
});

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 VERIFICATION SUMMARY\n');

if (hasErrors) {
  console.error('❌ SETUP HAS ERRORS - Please fix the issues above\n');
  console.log('Next steps:');
  console.log('1. Open .env.local in your editor');
  console.log('2. Fix the errors listed above');
  console.log('3. Run this script again: node scripts/verify-cloud-setup.js');
  console.log('4. See ENV_SETUP_REFERENCE.md for the correct format\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('⚠️  SETUP HAS WARNINGS - Consider fixing the issues above\n');
  console.log('✅ Basic setup is correct, but there are warnings to review\n');
  console.log('Next steps:');
  console.log('1. Review warnings above');
  console.log('2. Restart your development server: npm run dev');
  console.log('3. Test file upload in admin dashboard');
  console.log('4. Test file display on public website\n');
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED!\n');
  console.log('Your cloud storage integration appears to be correctly configured.\n');
  console.log('Next steps:');
  console.log('1. Restart your development server if it\'s running:');
  console.log('   → Press Ctrl+C to stop');
  console.log('   → Run: npm run dev');
  console.log('2. Test file upload in admin dashboard');
  console.log('3. Test file display on public website');
  console.log('4. Check browser console for any errors\n');
  console.log('📚 Documentation:');
  console.log('   → Setup Guide: CUSTOM_CLOUD_SETUP.md');
  console.log('   → Quick Reference: ENV_SETUP_REFERENCE.md');
  console.log('   → Summary: CLOUD_INTEGRATION_SUMMARY.md\n');
  process.exit(0);
}

