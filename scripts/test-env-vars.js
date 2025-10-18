#!/usr/bin/env node
/**
 * Test Environment Variables Loading
 * This script checks if environment variables are being loaded correctly
 */

const fs = require("fs");
const path = require("path");

console.log("\n🔍 Environment Variables Test\n");
console.log("=".repeat(70));

// Read .env.local file
const envPath = path.join(__dirname, "..", ".env.local");
let envContent = "";

try {
  envContent = fs.readFileSync(envPath, "utf-8");
  console.log("✅ .env.local file found\n");
} catch (error) {
  console.error("❌ .env.local file not found!");
  process.exit(1);
}

// Parse environment variables
const vars = {};
const lines = envContent.split("\n");

lines.forEach((line) => {
  // Skip comments and empty lines
  if (line.trim().startsWith("#") || !line.trim()) return;

  const match = line.match(/^([A-Z_]+)=(.+)$/);
  if (match) {
    const [, key, value] = match;
    vars[key] = value.trim().replace(/^["']|["']$/g, ""); // Remove quotes if any
  }
});

// Check specific variables
const requiredVars = [
  "CLOUD_API_BASE_URL",
  "CLOUD_API_KEY_FULL",
  "CLOUD_API_KEY_READ",
  "CLOUD_BUCKET_ID",
];

console.log("📋 Found Variables:\n");

requiredVars.forEach((name) => {
  const value = vars[name];
  console.log(`${name}:`);
  if (value) {
    console.log(`  ✅ Loaded`);
    console.log(`  Length: ${value.length} characters`);
    console.log(`  First 10 chars: ${value.substring(0, 10)}...`);
    console.log(`  Last 10 chars: ...${value.substring(value.length - 10)}`);

    // Check for common issues
    if (value.includes('"') || value.includes("'")) {
      console.log(`  ⚠️  WARNING: Contains quotes - remove them!`);
    }
    if (value.includes(" ") && !name.includes("URL")) {
      console.log(`  ⚠️  WARNING: Contains spaces - check for errors`);
    }
    if (name.includes("KEY") && value.length < 32) {
      console.log(`  ⚠️  WARNING: Key seems too short`);
    }
  } else {
    console.log(`  ❌ NOT FOUND`);
  }
  console.log("");
});

console.log("=".repeat(70));

// Summary
const allFound = requiredVars.every((name) => vars[name]);
if (allFound) {
  console.log("\n✅ All required variables found!\n");
  console.log("Next: Run the API test:");
  console.log("  node scripts/test-cloud-api.js\n");
} else {
  console.log("\n❌ Some variables are missing!\n");
  console.log("Fix your .env.local file:\n");
  console.log("CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api");
  console.log(
    "CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb"
  );
  console.log(
    "CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0"
  );
  console.log("CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362\n");
}
